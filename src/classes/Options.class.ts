export default class Options<T> {
    #config: T

    /**
     * Takes an input object and a default object, merges both objects and generates new config, that can be accessed using `config` property
     * @param input input object
     * @param defaults default values for missing input values
     */
    constructor(input: T, defaults: T) {
        if (!input) {
            this.#config = defaults
        } else {
            this.#config = { ...defaults, ...input }
        }
    }

    /**
     * Returns merged `input` and `defaults` objects
     */
    get config() {
        return this.#config
    }
}
