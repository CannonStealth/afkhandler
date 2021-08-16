import { AFKHandlerTypes } from "../types";

export default class Command implements AFKHandlerTypes.Command {
    public name: string;
    public aliases?: string[]
    public category?: string
    public callback?: AFKHandlerTypes.Callback

    constructor(options: AFKHandlerTypes.Command) {
    this.name = options.name
    this.aliases = options.aliases
    this.category = options.category
    this.callback = options.callback || options.fire || options.execute || options.emit || options.run
    }
}