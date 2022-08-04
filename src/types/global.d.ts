export {}

declare global {
    /* function types */
    type validatorFunction = (param: any, colName: string, allInputs: Object) => void
    type formatterFunction = (value: any) => any
    type hook = (client: pgClient, allInputs: Object, columns: Array<string>) => any

    /* object types */
    type pgClient = {
        query: Function
    }
    type timestampsObject = {
        createdAt: string
        updatedAt: string
        deletedAt: string
    }
    type configObject = {
        prefix?: string
        pkName?: string
        pkType?: string
        alter?: boolean
        paranoid?: boolean
        timestamps?: timestampsObject | boolean
        logs?: boolean
        errLogs?: boolean
    }

    type whereOptions = {
        sql: string
        values: Array<any>
    }

    type findOptions = {
        offset?: number
        limit?: number
        columns?: Array<string>
        where?: whereOptions
    }
    type foreignKeyOptions = {
        column: string
        references: {
            table: string
            column: string
        }
        onDelete: string
        onUpdate: string
    }
    type columnObject = {
        name: string
        sql: string
        validations?: Array<validatorFunction>
        formatter?: formatterFunction
    }
    type columnsObject = {
        [key: string]: columnObject
    }

    type inputObject = { [key: string]: any }

    enum hookTypes {
        BEFORE_CREATE = 'beforeCreate',
        AFTER_CREATE = 'afterCreate',

        BEFORE_UPDATE = 'beforeUpdate',
        AFTER_UPDATE = 'afterUpdate',

        BEFORE_DESTROY = 'beforeDestroy',
        AFTER_DESTROY = 'afterDestroy',
    }
}
