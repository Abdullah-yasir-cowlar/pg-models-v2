class Column {
    #name!: string
    #sql!: string
    #nameInTable: string
    #validations: Array<validatorFunction> | []
    #formatter: formatterFunction | undefined

    constructor(
        colName: string,
        sql: string,
        validations: Array<validatorFunction> = [],
        formatter: formatterFunction = val => {}
    ) {
        this.name = colName
        this.#sql = sql.replace('@name', colName)
        this.#nameInTable = sql.split(' ')[0] || colName
        this.#validations = validations
        this.#formatter = formatter
    }

    get name(): string {
        return this.#name
    }

    set name(val: string) {
        this.#name = val
    }

    get nameInTable(): string {
        return this.#nameInTable
    }

    get dataType() {
        return this.#sql.split(' ')[1]
    }

    get sql() {
        return this.#sql
    }

    format(val: any) {
        if (this.#formatter) {
            return this.#formatter(val)
        }
        return val
    }

    runValidations(val: any, allInputs: Object) {
        this.#validations.forEach(validator => validator(val, this.#name, allInputs))
    }
}

module.exports = Column
