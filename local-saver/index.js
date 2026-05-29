let { parse, stringify } = JSON

export default class LocalSaver {
    constructor(name) {
        this.name = name
    }

    get data() {
        return parse(localStorage.getItem(this.name))
    }

    #init() {
        let store = localStorage.getItem(this.name)
        store === null && localStorage.setItem(this.name, stringify({}))
        return this
    }

    clear() {
        localStorage.removeItem(this.name)
    }

    getItem(key) {
        this.#init()
        let data = parse(localStorage.getItem(this.name))
        return Object.hasOwn(data, key) ? data[key] : null
    }

    setItem(key, value) {
        this.#init()
        let data = parse(localStorage.getItem(this.name))
        data[key] = value
        localStorage.setItem(this.name, stringify(data))
    }

    removeItem(key) {
        this.#init()
        let data = parse(localStorage.getItem(this.name))
        delete data[key]
        localStorage.setItem(this.name, stringify(data))
    }
}