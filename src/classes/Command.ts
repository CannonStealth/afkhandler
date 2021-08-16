import { ClientTypes } from "../types";

export default class Command implements ClientTypes.Command {
    public name: string;
    public aliases?: string[]
    public category?: string
    public callback?: ClientTypes.Callback

    constructor(options: ClientTypes.Command) {
    this.name = options.name
    this.aliases = options.aliases
    this.category = options.category
    this.callback = options.callback || options.fire || options.execute || options.emit || options.run
    }
}