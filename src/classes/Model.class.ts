export default class Model {
    #table: Table

    #beforeCreateHook: hook | undefined
    #afterCreateHook: hook | undefined

    #beforeUpdateHook: hook | undefined
    #afterUpdateHook: hook | undefined

    #beforeDestoryHook: hook | undefined
    #afterDestroyHook: hook | undefined

    constructor(tableName: string, config: configObject) {
        this.#table = new Table(tableName, {}, config)
    }

    static useConnection(pgClient: pgClient) {
        Table.setPgClient(pgClient)
    }

    #pkeyCheck(pkey: string | number) {
        if (this.table.options.config.pkType === 'uuid' && typeof pkey !== 'string') {
            throw new Error('INVALID_PK_TYPE: pkey must be a string if pkType is uuid')
        } else if (this.table.options.config.pkType === 'serial' && typeof pkey !== 'number') {
            throw new Error('INVALID_PK_TYPE: pkey must be a number if pkType is serial')
        }
    }

    get tableName(): string {
        return this.table.name
    }

    get table() {
        return this.#table
    }

    /* hooks */

    beforeCreate(hook: hook) {
        this.#beforeCreateHook = hook
    }

    afterCreate(hook: hook) {
        this.#afterCreateHook = hook
    }

    beforeUpdate(hook: hook) {
        this.#beforeUpdateHook = hook
    }

    afterUpdate(hook: hook) {
        this.#afterUpdateHook = hook
    }

    beforeDestroy(hook: hook) {
        this.#beforeDestoryHook = hook
    }

    afterDestroy(hook: hook) {
        this.#afterDestroyHook = hook
    }

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

    async addForeignKey(foreignKey: foreignKeyOptions) {
        await this.table.addForeignKey(foreignKey)
    }

    async define(columns: columnsObject) {
        this.table.setColumns(columns)
        const tableExists = await this.table.exists()
        if (tableExists) {
            await this.table.alter()
        } else {
            await this.table.create()
        }
    }

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

        if (before && typeof before === 'function') {
            await before(this.table.query.client, allInputs, this.table.getColumnNames(true))
        }

        const result = await fn()

        if (after && typeof after === 'function') {
            await after(this.table.query.client, result, this.table.getColumnNames(true))
        }

        return result
    }

    /* crud methods */

    async findAll(options: findOptions) {
        const { rows } = await this.table.select(options)
        return rows
    }

    // this method is for backwards compatibility
    async findAllWhere(whereClause: string, params: Array<any>) {
        const { rows } = await this.table.select({ where: { sql: whereClause, values: params } })
        return rows
    }

    async findOne(needle: Object) {}

    async findByPk(pkey: any) {
        const { rows } = await this.table.select({
            where: { sql: `${this.table.options.config.pkName} = $1`, values: [pkey] },
        })
        return rows[0]
    }

    // this method is for backwards compatibility
    findById = this.findByPk

    async create(data: Object) {
        return await this.runWithHooks('Create', data, async () => {
            return (await this.table.insert(data)).rows
        })
    }

    async createMany(data: Array<Object>) {
        return await this.runWithHooks('Create', data, async () => {
            return await this.table.insertMany(data)
        })
    }

    async update(data: Object) {
        return await this.runWithHooks('Update', data, async () => {
            return (await this.table.update(data)).rows
        })
    }

    async updateByPk(pkey: any, data: Object) {
        return await this.runWithHooks('Update', data, async () => {
            return (await this.table.update(data, pkey)).rows
        })
    }

    // this method is for backwards compatibility
    updateById = this.updateByPk

    async patch(data: Object) {
        return await this.runWithHooks('Update', data, async () => {
            return (await this.table.update(data)).rows
        })
    }

    async patchByPk(pkey: any, data: Object) {
        this.#pkeyCheck(pkey)
        return await this.runWithHooks('Update', data, async () => {
            return (await this.table.update(data, pkey)).rows
        })
    }

    // this method is for backwards compatibility
    patchById = this.patchByPk

    async destroy(where: whereOptions) {
        return await this.runWithHooks('Destroy', where, async () => {
            return (await this.table.delete(where)).rows
        })
    }

    async destroyByPk(pkey: any) {
        this.#pkeyCheck(pkey)
        return await this.runWithHooks('Destroy', pkey, async () => {
            return (await this.table.delete(pkey)).rows
        })
    }

    // this method is for backwards compatibility
    destroyById = this.destroyByPk
}
