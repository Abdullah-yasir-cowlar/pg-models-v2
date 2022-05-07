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

    static setPgClient(client: pgClient) {
        Query.setPgClient(client)
    }

    get options() {
        return this.#options
    }

    get name() {
        return this.#name
    }

    get columns() {
        return this.#columns
    }

    get query() {
        return this.#crudQuery
    }

    set name(name) {
        const prefix = this.options.config.prefix
        this.#name = `${prefix}${name}`
    }

    setColumns(columns: columnsObject) {
        const { pkName = 'id', pkType = 'serial' } = this.options.config
        const pkCol = new Column(pkName, `@name ${pkType} NOT NULL PRIMARY KEY`)
        const columnsArr = Object.entries(columns).map(
            ([name, conf]) => new Column(name, conf.sql, conf?.validations, conf?.formatter)
        )
        this.#crudQuery = new Query(this.#name, this.getColumnNames())
        this.#columns = [pkCol, ...columnsArr]
    }

    getColumn(colName: string) {
        return this.columns.find(col => col.name === colName)
    }

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

    async insert(data: Object) {
        const arrangedInputs = this.getInputsArrangedAsColumns(this.getValidInputs(data))
        const query = this.query.insert(arrangedInputs)
        const result = await this.run(query)
        return result
    }

    async insertMany(data: Array<Object>) {
        const promises = data.map((input: Object) => this.insert(input))
        const result = await Promise.all(promises)
        return result.map(res => res.rows)
    }

    async update(data: Object, pkey?: string) {
        const arrangedInputs = this.getInputsArrangedAsColumns(this.getValidInputs(data))
        const query = this.query.update(arrangedInputs, this.getColumnNames(), {
            sql: `${this.options.config.pkName}=#{idnum}`,
            values: [pkey],
        })
        const result = await this.run(query)
        return result
    }

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

    async exists() {
        // check if table exists
        const result = await this.run(this.query.tableExists())
        return result.rows.length > 0
    }

    async columnExists(name: string, type: string) {
        const result = await this.run(this.query.columnExists(name, type))
        return result.rows.length > 0
    }

    async contraintExists(name: string) {
        const result = await this.run(this.query.constraintExists(name))
        return result.rows.length > 0
    }

    async drop() {
        await this.run(this.query.dropTable())
    }

    async alter() {
        if (!this.options.config.alter) return

        const missingColumns = this.columns.filter(
            async col => !(await this.columnExists(col.name, col.dataType))
        )

        if (missingColumns.length === 0) return

        await this.run(this.query.addColumns(missingColumns.map(col => col.nameInTable)))
    }

    async addForeignKey(foreignKey: foreignKeyOptions) {
        const { column, references, onDelete, onUpdate } = foreignKey
        const colExists = await this.columnExists(column, 'integer')

        if (!colExists) {
            throw new Error(`COLUMN_NOT_FOUND: ${column} column not found in ${this.name} table`)
        }

        await this.run(this.query.foreignKey(foreignKey))
    }

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

    setParanoid() {
        const timestamps = this.options.config.timestamps
        if (!timestamps) {
            throw new Error('NO_TIMESTAMPS: Please set timestamps before setting paranoid')
        }
        const deletedAtCol = new Column(this.#timetamps.deletedAt, '@name timestamp')

        this.#columns.push(deletedAtCol)
    }

    /* utility methods */

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
     * @returns Object with valid inputs
     */
    getValidInputs(allInputs: any, nulls: boolean = false) {
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

    getInputsArrangedAsColumns(allInputs: any) {
        return this.getColumnNames().map(col => allInputs[col])
    }

    runValidations(allInputs: any) {
        Object.values(this.columns).forEach(col =>
            col.runValidations(allInputs[col.name], allInputs)
        )
    }
}
