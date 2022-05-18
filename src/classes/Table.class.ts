import { isObject } from '../utils'

import Column from './Column.class'
import Query from './Query.class'
import Options from './Options.class'

export default class Table {
    #name: string = ''
    #columns: Array<Column> = []
    #options: Options<configObject>
    #findOptions: Options<findOptions>
    #timetamps: timestampsObject = {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    }
    #crudQuery: Query

    /**
     * Creates a new `Table` instance
     * @param tableName Name of the table to be created
     * @param columns Columns to be added to the table
     * @param options Configuration options for the table
     */
    constructor(tableName: string, columns: columnsObject, options: configObject = {}) {
        this.#options = new Options<configObject>(options, {
            prefix: '',
            pkName: 'id',
            pkType: 'serial',
            alter: false,
            paranoid: false,
            timestamps: false,
            logs: false,
            errLogs: false,
        })
        this.#findOptions = new Options<findOptions>({}, { offset: 0, limit: 1000, columns: [] })
        this.name = tableName
        this.setColumns(columns)
        this.#crudQuery = new Query(tableName, this.getColumnNames())
    }

    /**
     * Connects to the database
     * @param client Client to be used for the query (to connect to the database)
     */
    static setPgClient(client: pgClient) {
        Query.setPgClient(client)
    }

    /**
     * Gets configurable object
     */
    get options() {
        return this.#options
    }

    /**
     * Gets the name of the table
     */
    get name() {
        return this.#name
    }

    /**
     * Gets the columns of the table
     */
    get columns() {
        return this.#columns
    }

    /**
     * Gets the query instance
     */
    get query() {
        return this.#crudQuery
    }

    /**
     * Sets the name of the table
     */
    set name(name) {
        const prefix = this.options.config.prefix
        this.#name = `${prefix}${name}`
    }

    /**
     * Runs a query and returns the result
     * @param query Query to be run
     * @returns result of the query
     */
    async run(query: Query) {
        let result: any = null

        if (this.options.config.logs) query.log()

        try {
            result = await query.run()
            return result
        } catch (err) {
            if (this.options.config.errLogs) console.error(err)
        }
    }

    /**
     * Creates the table in the database
     */
    async create() {
        if (this.options.config.timestamps) {
            this.addTimestamps()
        }
        if (this.options.config.paranoid) {
            this.setParanoid()
        }
        const colsSchema = this.columns.map(col => col.sql).join()

        await this.run(this.query.createTable(colsSchema))
    }

    /**
     * Selects data from the table
     * @param options Set options for the query
     * @returns selected rows
     */
    async select(options: findOptions) {
        const selectOptions = new Options<findOptions>(options, this.#findOptions.config)
        let columns = this.columns.map(col => col.nameInTable)

        if (options.columns) {
            columns = this.columns
                .filter(col =>
                    (selectOptions.config.columns || []).find(
                        colName => colName === col.nameInTable
                    )
                )
                .map(col => col.nameInTable)
        }

        const query = this.query.select({ ...selectOptions.config, columns })
        const result = await this.run(query)
        return result
    }

    /**
     * Inserts a row into the table
     * @param data Data to be inserted
     * @returns inserted row
     */
    async insert(data: Object) {
        const arrangedInputs = this.getInputsArrangedAsColumns(this.getValidInputs(data))
        const query = this.query.insert(arrangedInputs)
        const result = await this.run(query)
        return result
    }

    /**
     * Inserts multiple rows into the table
     * @param data Data to be inserted
     * @returns inserted rows
     */
    async insertMany(data: Array<Object>) {
        const promises = data.map((input: Object) => this.insert(input))
        const result = await Promise.all(promises)
        return result.map(res => res.rows)
    }

    /**
     * Updates all rows in the table, or a single row if `pkey` is provided
     * @param data Data to be updated
     * @param pkey primary key of the row to be updated
     * @returns updated row
     */
    async update(data: Object, pkey?: string) {
        const arrangedInputs = this.getInputsArrangedAsColumns(this.getValidInputs(data))
        const query = this.query.update(arrangedInputs, this.getColumnNames(), {
            sql: `${this.options.config.pkName}=#{idnum}`,
            values: [pkey],
        })
        const result = await this.run(query)
        return result
    }

    /**
     * Deletes row(s) from the table
     * @param pkey primary key of the row to be deleted or where options i.e {where:{sql:'',values:[]}}
     * @returns deleted rows
     */
    async delete(pkey: string | whereOptions) {
        let query: Query
        if (typeof pkey === 'object') {
            // delete many
            throw new Error('Not implemented yet')
        }
        if (this.options.config.paranoid) {
            query = this.query.update(['now()'], ['deleted_at'], {
                sql: `${this.options.config.pkName}=#{idnum}`,
                values: [pkey],
            })
        } else {
            query = this.query.delete({
                sql: `${this.options.config.pkName}=$1`,
                values: [pkey],
            })
        }
        const result = await this.run(query)
        return result
    }

    /**
     * Checks if the table exists in the database
     * @returns true if the table exists, false otherwise
     */
    async exists() {
        // check if table exists
        const result = await this.run(this.query.tableExists())
        return result.rows.length > 0
    }

    /**
     * Checks if the column exists in the table
     * @param name Name of the column
     * @param type Data type of the column
     * @returns true if the column exists, false otherwise
     */
    async columnExists(name: string, type: string) {
        const result = await this.run(this.query.columnExists(name, type))
        return result.rows.length > 0
    }

    /**
     * Check if the constraint exists in the table
     * @param name Name of the table
     * @returns true if constraint exists, false otherwise
     */
    async contraintExists(name: string) {
        const result = await this.run(this.query.constraintExists(name))
        return result.rows.length > 0
    }

    /**
     * Drops the table from database
     */
    async drop() {
        await this.run(this.query.dropTable())
    }

    /**
     * Alters the table in the database
     * @returns true if table is altered, false otherwise
     */
    async alter() {
        if (!this.options.config.alter) return

        const missingColumns = this.columns.filter(
            async col => !(await this.columnExists(col.name, col.dataType))
        )

        if (missingColumns.length === 0) return

        await this.run(this.query.addColumns(missingColumns.map(col => col.nameInTable)))
        return true
    }

    /**
     * Creates a foreign key
     * @param foreignKey Object containing foreign key configuration
     */
    async addForeignKey(foreignKey: foreignKeyOptions) {
        const { column, references, onDelete, onUpdate } = foreignKey
        const colExists = await this.columnExists(column, 'integer')

        if (!colExists) {
            throw new Error(`COLUMN_NOT_FOUND: ${column} column not found in ${this.name} table`)
        }

        await this.run(this.query.foreignKey(foreignKey))
    }

    /**
     * Alters table to add timestamps (created_at, updated_at) columns in it
     */
    addTimestamps() {
        const timestamps = this.options.config.timestamps
        if (typeof timestamps === 'object') {
            this.#timetamps = new Options<timestampsObject>(timestamps, this.#timetamps).config
        }
        const { createdAt, updatedAt } = this.#timetamps
        const createdAtCol = new Column(createdAt, '@name timestamp default now()')
        const updatedAtCol = new Column(updatedAt, '@name timestamp default now()')

        this.#columns.push(createdAtCol, updatedAtCol)
    }

    /**
     * Adds deleted_at column in the table
     */
    setParanoid() {
        const timestamps = this.options.config.timestamps
        let deletedAtCol: Column
        if (!timestamps) {
            throw new Error('NO_TIMESTAMPS: Please set timestamps before setting paranoid')
        }
        if (typeof timestamps === 'object') {
            deletedAtCol = new Column(timestamps.deletedAt, '@name timestamp')
        } else {
            deletedAtCol = new Column(this.#timetamps.deletedAt, '@name timestamp')
        }

        this.#columns.push(deletedAtCol)
    }

    /**
     * Sets new columns on table instance
     * @param columns Object containing table columns configuration
     */
    setColumns(columns: columnsObject) {
        const { pkName = 'id', pkType = 'serial' } = this.options.config
        const pkCol = new Column(pkName, `@name ${pkType} NOT NULL PRIMARY KEY`)
        const columnsArr = Object.entries(columns).map(
            ([name, conf]) => new Column(name, conf.sql, conf?.validations, conf?.formatter)
        )
        this.#crudQuery = new Query(this.#name, this.getColumnNames())
        this.#columns = [pkCol, ...columnsArr]
    }

    /**
     * Gets column object
     * @param colName Column name
     * @returns matched column
     */
    getColumn(colName: string) {
        return this.columns.find(col => col.name === colName)
    }

    /**
     * Get array of column names
     * @param includeTimestamps true for including timestamp columns names, false otherwise
     * @returns array of column names
     */
    getColumnNames(includeTimestamps: boolean = false) {
        let cols = this.columns.map(col => col.nameInTable)
        let timestamps: any = this.#options.config.timestamps

        if (!includeTimestamps) {
            if (timestamps && typeof timestamps === 'object') {
                timestamps = Object.values(timestamps)
            } else {
                timestamps = Object.values(this.#timetamps)
            }
            cols = cols.filter(col => !timestamps.includes(col))
        }

        return cols
    }

    /**
     * Returns a list of valid inputs
     * @param allInputs User inputs object
     * @param nulls If true, will return nulls for missing inputs
     * @returns object of valid inputs, columnName-input pairs
     */
    getValidInputs(allInputs: inputObject, nulls: boolean = false) {
        if (!isObject(allInputs)) {
            throw new Error('INVALID_INPUT: Inputs must be an object')
        }
        const colNames = this.getColumnNames()
        const validInputs: inputObject = Object.entries(allInputs)
            .filter(([key, _]) => colNames.includes(key))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

        if (nulls) {
            return this.getColumnNames().reduce(
                (acc, colName) => ({ ...acc, [colName]: validInputs[colName] || null }),
                {}
            )
        }
        return validInputs
    }

    /**
     * Arranges keys in input object according to arrangment of columns object
     * @param allInputs object containing user inputs
     * @returns object of arranged inputs
     */
    getInputsArrangedAsColumns(allInputs: inputObject) {
        return this.getColumnNames()
            .filter((col: string) => allInputs[col] !== undefined)
            .map(col => allInputs[col])
    }

    /**
     * Runs validation functions of all columns on corresponding input value
     * @param allInputs object containing user inputs
     */
    runValidations(allInputs: inputObject) {
        Object.values(this.columns).forEach(col =>
            col.runValidations(allInputs[col.name], allInputs)
        )
    }
}
