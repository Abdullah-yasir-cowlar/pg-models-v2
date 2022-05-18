export default class Column {
    #name!: string
    #sql!: string
    #nameInTable: string
    #validations: Array<validatorFunction> | []
    #formatter: formatterFunction | undefined

    /**
     * Creates instance of Column
     * @param colName name of the column
     * @param sql sql statement to create column
     * @param validations Array of validation functions, which throw error on validation failure
     * @param formatter Function which formats the column value, returns formatted value
     */
    constructor(
        colName: string,
        sql: string,
        validations: Array<validatorFunction> = [],
        formatter: formatterFunction = val => {}
    ) {
        this.name = colName
        this.#sql = sql.replace('@name', colName)
        this.#nameInTable = this.#sql.split(' ')[0] || colName
        this.#validations = validations
        this.#formatter = formatter
    }

    /**
     * Gets column name
     */
    get name(): string {
        return this.#name
    }

    /**
     * Sets column name
     */
    set name(val: string) {
        this.#name = val
    }

    /**
     * Gets the name of the column which is used to identify it in the sql
     */
    get nameInTable(): string {
        return this.#nameInTable
    }

    /**
     * Gets data type of the column
     */
    get dataType() {
        return this.#sql.split(' ')[1]
    }

    /**
     * Get sql statement which is used for column creation
     */
    get sql() {
        return this.#sql
    }

    /**
     * Runs column's formatter function for given value
     * @param val Any value for column input
     * @returns formatted value
     */
    format(val: any) {
        if (this.#formatter) {
            return this.#formatter(val)
        }
        return val
    }

    /**
     * Runs column's validator functions for given value
     * @param val Any input value
     * @param allInputs Optional - inputs of other columns
     */
    runValidations(val: any, allInputs: Object) {
        this.#validations.forEach(validator => validator(val, this.#name, allInputs))
    }
}
