export default class Query {
    static #client: pgClient

    #tableName: string
    #columns: Array<string>
    #query: string = ''
    #values: Array<any> = []

    /**
     * Creates a new `Query` instance
     * @param tableName Name of the table
     * @param columns Names of the columns for the table
     */
    constructor(tableName: string, columns: Array<string>) {
        this.#tableName = tableName
        this.#columns = columns
    }

    /**
     * Connects to the database
     * @param pgClient Client object returned by `pg.Client.connect()`
     */
    static setClient(pgClient: pgClient) {
        Query.#client = pgClient
    }

    /**
     * Checks if provided client is connected to the database
     */
    static #verifyClient() {
        if (!Query.#client || !Query.#client.query) {
            throw new Error(
                'NO_CLIENT: Please set a pgClient, before using any method of ' +
                    this.constructor.name
            )
        }
    }

    /**
     * Gets query string
     */
    get query() {
        return this.#query
    }

    /**
     * Gets query values
     */
    get values() {
        return this.#values
    }

    /**
     * Gets the client object
     */
    get client() {
        return Query.#client
    }

    /**
     * Prepares the query for the given values, that can be get with `query.query` and `query.values`
     * @param query Query string
     * @param values Values to be replaced in the query
     * @param columns Columns to be selected
     * @param where {whereOptions} Where clause
     * @returns reference to the instance
     */
    prepare(
        query: string,
        values: Array<any> = [],
        columns: Array<string> = this.#columns,
        where?: whereOptions
    ) {
        const valuesPlaceholders = values.map((_, index) => `$${index + 1}`).join()
        const updatePlaceholders = values
            .map((_, index) => `${columns[index]}=$${index + 1}`)
            .join()

        let whereClause = ' WHERE '

        if (where && where.sql && where.values) {
            whereClause += `${where.sql}`
            this.#values = [...this.#values, ...where.values]
        } else {
            whereClause = ''
        }

        const result = query
            .replace(/#{tableName}/g, this.#tableName)
            .replace('#{columns}', columns.join())
            .replace('#{values}', valuesPlaceholders)
            .replace('#{updateValues}', updatePlaceholders)
            .replace('#{where}', whereClause)
            .replace('#{idnum}', `$${this.#values.length}`)
            .replace('  ', ' ')

        this.#query = result
        this.#values = values
        return this
    }

    /**
     * Appends `returning` clause to the query
     * @param cols string (comma seperated) or an array of column names
     * @returns reference to the instance
     */
    returning(cols: string | Array<string>) {
        let _returning = ' RETURNING '

        if (cols === '*') {
            this.#query += _returning + '*'
        } else if (cols.includes(',') && !Array.isArray(cols)) {
            this.#query += _returning + cols
        } else if (Array.isArray(cols) && cols.length > 0) {
            this.#query += _returning + cols.join(',')
        } else {
            throw new Error(
                `INVALID_PARAM: cols can either be '*' or 'col1,col2' or ['col1', 'col2']`
            )
        }
        return this
    }

    /**
     * Creates a query to count values of given column in the table
     * @param column Name of the column
     * @returns reference to the instance
     */
    count(column: string | undefined, where: whereOptions | undefined) {
        let _col = '*'
        let _query = 'SELECT COUNT(#{column}) FROM #{tableName} #{where}'
        if (column && column !== '*') {
            _col = column
        }

        _query = _query.replace('#{column}', _col)
        this.prepare(_query, [], [], where)
        return this
    }

    /**
     * Create a query to sum the values of given column
     * @param column Name of the column
     * @param where {whereOptions} An object of filters
     * @returns reference to the instance
     */
    sum(column: string, where: whereOptions | undefined) {
        let _query = 'SELECT SUM(#{column}) FROM #{tableName} #{where}'

        if (!column) {
            throw new Error('INVALID_PARAM: "column" must be a non emtpy string')
        }
        _query = _query.replace('#{column}', column)
        this.prepare(_query, [], [], where)
        return this
    }

    /**
     * Appends `order by` clause for given columns to the query
     * @param columns List of column names, a comma seperated string, or an array of strings
     * @returns reference to the instance
     */
    orderBy(columns: string | Array<string>) {
        let _cols = columns
        if (Array.isArray(columns) && columns.length) {
            _cols = columns.join(',')
        }
        this.#query += ` ORDER BY ${_cols}`
        return this
    }

    /**
     * Appends `group by` clause for given columns to the query
     * @param columns List of column names, a comma seperated string, or an array of strings
     * @returns reference to the instance
     */
    groupBy(columns: string | Array<string>) {
        let _cols = columns
        if (Array.isArray(columns) && columns.length) {
            _cols = columns.join(',')
        }
        this.#query += ` GROUP BY ${_cols}`
        return this
    }

    /**
     * Creates an insert query
     * @param values Values to be inserted
     * @returns reference to the instance
     */
    insert(values: Array<any>) {
        const query = `INSERT INTO #{tableName} (#{columns}) VALUES (#{values})`
        this.prepare(query, values)
        return this
    }

    /**
     * Creates a select query
     * @param options Select options like `limit`, `offset`, `orderBy`, `where`
     * @returns reference to the instance
     */
    select(options: findOptions = {}) {
        const { offset, limit, columns, where } = options
        let query = `SELECT #{columns} FROM #{tableName}`

        if (offset && limit) {
            query += ` LIMIT ${limit} OFFSET ${offset}`
        } else if (offset) {
            query += ` OFFSET ${offset}`
        } else if (limit) {
            query += ` LIMIT ${limit}`
        }

        if (where && where.sql) {
            query += ` WHERE ${where.sql}`
        }

        this.prepare(query, [], columns, where)

        return this
    }

    /**
     * Creates a query to update a row
     * @param values Values to be replaced in the query
     * @param columns Columns to be selected
     * @param where Where clause
     * @returns reference to the instance
     */
    update(values: Array<any>, columns: Array<string>, where?: whereOptions) {
        const query = `UPDATE #{tableName} SET #{updateValues} #{where}`

        if (values && columns && columns.length && values.length !== columns.length) {
            throw new Error(
                'UPDATE_VALUES_MISMATCH: The number of values and columns must be equal'
            )
        }

        if (where) {
            this.prepare(query, values, columns, where)
        } else {
            this.prepare(query, values, columns)
        }
        return this
    }

    /**
     * Creates a query to delete a row
     * @param where Where clause
     * @returns reference to the instance
     */
    delete(where: whereOptions) {
        const query = `DELETE FROM #{tableName} #{where}`
        this.prepare(query, [], [], where)
        return this
    }

    /**
     * Creates a query to check if the table exists
     * @returns reference to the instance
     */
    tableExists() {
        const query = `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = '#{tableName}')`
        this.prepare(query)
        return this
    }

    /**
     * Creates a query to check if the column exists
     * @param name Name of the column
     * @param type Data type of the column
     * @returns reference to the instance
     */
    columnExists(name: string, type: string) {
        const query = `SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = '#{tableName}' AND column_name = '${name}' AND data_type = '${type}')`
        this.prepare(query)
        return this
    }

    /**
     * Creates a query to check if the constraint exists
     * @param name Name of the constraint
     * @returns reference to the instance
     */
    constraintExists(name: string) {
        const query = `SELECT EXISTS(SELECT 1 FROM information_schema.table_constraints WHERE table_name = '#{tableName}' AND constraint_name = '${name}')`
        this.prepare(query)
        return this
    }

    /**
     * Creates a query to create a table
     * @param colsSchema Schema of the columns
     * @returns reference to the instance
     */
    createTable(colsSchema: string) {
        this.prepare(`CREATE TABLE IF NOT EXISTS #{tableName} (${colsSchema})`)
        return this
    }

    /**
     * Creates a query to alter a table to add columns
     * @param colsSchema Schema of the columns
     * @returns reference to the instance
     */
    addColumns(colsSchema: Array<string>) {
        const schemaString = colsSchema.map(col => `ADD COLUMN ${col}`).join(', ')
        this.prepare(`ALTER TABLE #{tableName} ${schemaString}`)
        return this
    }

    /**
     * Creates a query to drop a table
     * @returns reference to the instance
     */
    dropTable() {
        this.prepare(`DROP TABLE IF EXISTS #{tableName}`)
        return this
    }

    /**
     * Creates a query to drop a column
     * @param name Name of the column
     * @returns reference to the instance
     */
    dropColumn(name: string) {
        this.prepare(`ALTER TABLE #{tableName} DROP COLUMN ${name}`)
        return this
    }

    /**
     * Creates a query to add a foreign key constraint
     * @param options Options for the constraint
     * @returns reference to the instance
     */
    foreignKey(options: foreignKeyOptions) {
        const {
            column,
            onDelete,
            onUpdate,
            references: { table, column: referencedColumn },
        } = options
        const contraintName = `#{tableName}_${column}_fkey`
        let query = `ALTER TABLE #{tableName} ADD CONSTRAINT ${contraintName} FOREIGN KEY (${column}) REFERENCES ${table} (${referencedColumn})`

        if (onDelete) {
            query += ` ON DELETE ${onDelete}`
        }

        if (onUpdate) {
            query += ` ON UPDATE ${onUpdate}`
        }

        this.prepare(query)
        return this
    }

    /**
     * Runs the query
     * @returns reference to the instance
     */
    async run() {
        Query.#verifyClient()
        let result: any
        if (this.values) {
            result = await Query.#client.query(this.query, this.values)
        } else {
            result = await Query.#client.query(this.query)
        }
        return result
    }

    /**
     * Logs the query and its values
     * @returns reference to the instance
     */
    log() {
        console.log(this.#query, this.#values)
        return this
    }
}
