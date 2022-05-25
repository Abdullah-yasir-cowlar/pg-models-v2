import Table from './Table.class'

export default class Model {
    #table: Table

    #beforeCreateHook: hook | undefined
    #afterCreateHook: hook | undefined

    #beforeUpdateHook: hook | undefined
    #afterUpdateHook: hook | undefined

    #beforeDestoryHook: hook | undefined
    #afterDestroyHook: hook | undefined

    /**
     * Creates `Model` instance
     * @param tableName name of the database table
     * @param config model configurations
     */
    constructor(tableName: string, config: configObject) {
        this.#table = new Table(tableName, {}, config)
    }

    /**
     * Connects Model class to database using `pg`, postgresql driver for nodejs
     * @param pgClient client instance returned by `pg` package
     */
    static useConnection(pgClient: pgClient) {
        Table.setClient(pgClient)
    }

    #pkeyCheck(pkey: string | number) {
        if (this.table.options.config.pkType === 'uuid' && typeof pkey !== 'string') {
            throw new Error('INVALID_PK_TYPE: pkey must be a string if pkType is uuid')
        } else if (this.table.options.config.pkType === 'serial' && typeof pkey !== 'number') {
            throw new Error('INVALID_PK_TYPE: pkey must be a number if pkType is serial')
        }
    }

    /**
     * Returns table name (with prefix)
     */
    get tableName(): string {
        return this.table.name
    }

    /**
     * Returns `Table` instance
     */
    get table() {
        return this.#table
    }

    /* hooks */

    /**
     * Creates a hook on model which runs before every `insert` query
     * @param hook A function, which runs before every insertion in DB
     */
    beforeCreate(hook: hook) {
        this.#beforeCreateHook = hook
    }

    /**
     * Creates a hook on model which runs after every `insert` query
     * @param hook A function, which runs after every insertion in DB
     */
    afterCreate(hook: hook) {
        this.#afterCreateHook = hook
    }

    /**
     * Creates a hook on model which runs before every `update` query
     * @param hook A function, which runs before every update action in DB
     */
    beforeUpdate(hook: hook) {
        this.#beforeUpdateHook = hook
    }

    /**
     * Creates a hook on model which runs after every `update` query
     * @param hook A function, which runs after every update action in DB
     */
    afterUpdate(hook: hook) {
        this.#afterUpdateHook = hook
    }

    /**
     * Creates a hook on model which runs before every `delete` query
     * @param hook A function, which runs before every delete action in DB
     */
    beforeDestroy(hook: hook) {
        this.#beforeDestoryHook = hook
    }

    /**
     * Creates a hook on model which runs after every `delete` query
     * @param hook A function, which runs after every delete action in DB
     */
    afterDestroy(hook: hook) {
        this.#afterDestroyHook = hook
    }

    /**
     * Adds specified hook to the Model, you can add as many hooks as you want
     * @param type Name of the hook, i.e 'beforeCreate,afterCreate,beforeUpdate,afterUpdate,beforeDestroy,afterDestroy
     * @param hook A function, to add as hook
     */
    useHook(type: hookTypes, hook: hook) {
        switch (type) {
            case 'beforeCreate':
                this.#beforeCreateHook = hook
                break
            case 'afterCreate':
                this.#afterCreateHook = hook
                break
            case 'beforeUpdate':
                this.#beforeUpdateHook = hook
                break
            case 'afterUpdate':
                this.#afterUpdateHook = hook
                break
            case 'beforeDestroy':
                this.#beforeDestoryHook = hook
                break
            case 'afterDestroy':
                this.#afterDestroyHook = hook
                break
            default:
                throw new Error(
                    "INVALID_HOOK_TYPE: Hook type must be one of 'beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate', 'beforeDestroy', 'afterDestroy'"
                )
        }
    }

    /**
     * Creates foreign key on the Model
     * @param foreignKey An object containing foregin key config options
     */
    async addForeignKey(foreignKey: foreignKeyOptions) {
        await this.table.addForeignKey(foreignKey)
    }

    /**
     * Creates new tables with specified columns, or alters table if exists already (and `alter:true` is set in model options)
     * @param columns An object cotaining columns schema and other options
     */
    async define(columns: columnsObject) {
        this.table.setColumns(columns)
        const tableExists = await this.table.exists()
        if (tableExists) {
            await this.table.alter()
        } else {
            await this.table.create()
        }
    }

    /**
     * Takes user inputs, operation name and runs given function with all the hooks matching `operation`
     * @param operation Name of the database operation i.e 'Create, Update or Destroy'
     * @param allInputs User inputs
     * @param fn Function which does some database operation
     * @returns any value returned by 'fn'
     */
    async runWithHooks(
        operation: 'Create' | 'Update' | 'Destroy',
        allInputs: any,
        fn: () => Promise<any>
    ) {
        let before: hook | undefined
        let after: hook | undefined

        switch (operation) {
            case 'Create':
                before = this.#beforeCreateHook
                after = this.#afterCreateHook
                break
            case 'Update':
                before = this.#beforeUpdateHook
                after = this.#afterUpdateHook
                break
            case 'Destroy':
                before = this.#beforeDestoryHook
                after = this.#afterDestroyHook
                break
            default:
                throw new Error(
                    "INVALID_HOOK_TYPE: Hook type must be one of 'beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate', 'beforeDestroy', 'afterDestroy'"
                )
        }

        // call before-hook
        if (before && typeof before === 'function') {
            await before(this.table.query.client, allInputs, this.table.getColumnNames(true))
        }

        // call function (which does some database operation)
        const result = await fn()

        // call after-hook
        if (after && typeof after === 'function') {
            await after(this.table.query.client, result, this.table.getColumnNames(true))
        }

        return result
    }

    /* crud methods */

    /**
     * Finds all records in the table, or records matching given conditions
     * @param options Search options
     * @returns Found rows or empty array
     */
    async findAll(options: findOptions) {
        const { rows } = await this.table.select(options)
        return rows
    }

    // this method is for backwards compatibility
    /**
     * Finds all records matching given conditions
     * @param whereClause String containing where clause
     * @param params Values to replace in where clause
     * @returns Found rows or empty array
     */
    async findAllWhere(whereClause: string, params: Array<any>) {
        const { rows } = await this.table.select({ where: { sql: whereClause, values: params } })
        return rows
    }

    /**
     * Finds first record in the table, or record matching given conditions
     * @param needle Object containing search conditions, column-value pairs
     * @returns Found row or null
     */
    async findOne(needle: Object) {}

    /**
     * Finds first record matching primary key
     * @param pkey Primary key value
     * @returns Found row or null
     */
    async findByPk(pkey: any) {
        const { rows } = await this.table.select({
            where: { sql: `${this.table.options.config.pkName} = $1`, values: [pkey] },
        })
        return rows[0]
    }

    // this method is for backwards compatibility
    /**
     * Finds first record matching primary key
     * @param pkey Primary key value
     * @returns Found row or null
     */
    findById = this.findByPk

    /**
     * Inserts new record in the table
     * @param data Object containing data to insert, column-value pairs
     * @returns Inserted row
     */
    async create(data: Object) {
        return await this.runWithHooks('Create', data, async () => {
            return (await this.table.insert(data)).rows
        })
    }

    /**
     * Inserts multiple records in the table
     * @param data Array of objects containing data to insert, column-value pairs
     * @returns Inserted rows
     */
    async createMany(data: Array<Object>) {
        return await this.runWithHooks('Create', data, async () => {
            return await this.table.insertMany(data)
        })
    }

    /**
     * Updates all records matching given conditions
     * @param data Object containing data to update, column-value pairs
     * @param where  Object containing where options {where: {sql: '', values: []}}
     * @returns Updated row
     */
    async update(data: Object, where: whereOptions) {
        return await this.runWithHooks('Update', data, async () => {
            return (await this.table.update(data)).rows
        })
    }

    /**
     * Updates first record matching given conditions
     * @param pkey Primary key value
     * @param data Object containing data to update, column-value pairs
     * @returns Updated row
     */
    async updateByPk(pkey: any, data: Object) {
        return await this.runWithHooks('Update', data, async () => {
            return (await this.table.update(data, pkey)).rows
        })
    }

    /**
     * Updates first record matching given conditions
     * @param pkey Primary key value
     * @param data Object containing data to update, column-value pairs
     * @returns Updated row
     */
    updateById = this.updateByPk // this method is for backwards compatibility

    /**
     * Partially updates all records matching given conditions
     * @param data Object containing data to update, column-value pairs
     * @param where  Object containing where options {where: {sql: '', values: []}}
     * @returns Updated row
     */
    async patch(data: Object, where: whereOptions) {
        return await this.runWithHooks('Update', data, async () => {
            return (await this.table.update(data)).rows
        })
    }

    /**
     * Partially updates first record matching primary key
     * @param pkey Primary key value
     * @param data Object containing data to update, column-value pairs
     * @returns Updated row
     */
    async patchByPk(pkey: any, data: Object) {
        this.#pkeyCheck(pkey)
        return await this.runWithHooks('Update', data, async () => {
            return (await this.table.update(data, pkey)).rows
        })
    }

    /**
     * Partially updates first record matching primary key
     * @param pkey Primary key value
     * @param data Object containing data to update, column-value pairs
     * @returns Updated row
     */
    patchById = this.patchByPk // this method is for backwards compatibility

    /**
     * Deletes all records matching given conditions
     * @param where Object containing where options {where: {sql: '', values: []}}
     * @returns Deleted rows
     */
    async destroy(where: whereOptions) {
        return await this.runWithHooks('Destroy', where, async () => {
            return (await this.table.delete(where)).rows
        })
    }

    /**
     * Deletes first record matching primary key
     * @param pkey Primary key value
     * @returns Deleted row
     */
    async destroyByPk(pkey: any) {
        this.#pkeyCheck(pkey)
        return await this.runWithHooks('Destroy', pkey, async () => {
            return (await this.table.delete(pkey)).rows
        })
    }

    /**
     * Deletes first record matching primary key
     * @param pkey Primary key value
     * @returns Deleted row
     */
    destroyById = this.destroyByPk // this method is for backwards compatibility
}
