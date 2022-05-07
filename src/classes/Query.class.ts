export default class Query {
    static #client: pgClient

    #tableName: string
    #columns: Array<string>
    #query: string = ''
    #values: Array<any> = []

    constructor(tableName: string, columns: Array<string>) {
        this.#tableName = tableName
        this.#columns = columns
    }

    static setPgClient(pgClient: pgClient) {
        Query.#client = pgClient
    }

    static #verifyClient() {
        if (!Query.#client || !Query.#client.query) {
            throw new Error(
                'NO_CLIENT: Please set a pgClient, before using any method of ' +
                    this.constructor.name
            )
        }
    }

    get query() {
        return this.#query
    }

    get values() {
        return this.#values
    }

    get client() {
        return Query.#client
    }

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

    insert(values: Array<any>) {
        const query = `INSERT INTO #{tableName} (#{columns}) VALUES (#{values}) RETURNING *`
        this.prepare(query, values)
        return this
    }

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

    update(values: Array<any>, columns: Array<string>, where?: whereOptions) {
        const query = `UPDATE #{tableName} SET #{updateValues} #{where} RETURNING *`

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

    delete(where: whereOptions) {
        const query = `DELETE FROM #{tableName} #{where} RETURNING *`
        this.prepare(query, [], [], where)
        return this
    }

    tableExists() {
        const query = `SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = '#{tableName}')`
        this.prepare(query)
        return this
    }

    columnExists(name: string, type: string) {
        const query = `SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = '#{tableName}' AND column_name = '${name}' AND data_type = '${type}')`
        this.prepare(query)
        return this
    }

    constraintExists(name: string) {
        const query = `SELECT EXISTS(SELECT 1 FROM information_schema.table_constraints WHERE table_name = '#{tableName}' AND constraint_name = '${name}')`
        this.prepare(query)
        return this
    }

    createTable(colsSchema: string) {
        this.prepare(`CREATE TABLE IF NOT EXISTS #{tableName} (${colsSchema})`)
        return this
    }

    addColumns(colsSchema: Array<string>) {
        const schemaString = colsSchema.map(col => `ADD COLUMN ${col}`).join(', ')
        this.prepare(`ALTER TABLE #{tableName} ${schemaString}`)
        return this
    }

    dropTable() {
        this.prepare(`DROP TABLE IF EXISTS #{tableName}`)
        return this
    }

    dropColumn(name: string) {
        this.prepare(`ALTER TABLE #{tableName} DROP COLUMN ${name}`)
        return this
    }

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

    log() {
        console.log(this.#query, this.#values)
        return this
    }
}
