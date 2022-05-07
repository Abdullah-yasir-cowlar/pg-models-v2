export default class Options<T> {
    #config: T
    constructor(config: T, defaults: T) {
        if (!config) {
            this.#config = defaults
        } else {
            this.#config = { ...defaults, ...config }
        }
    }

    get config() {
        return this.#config
    }
}
