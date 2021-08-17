import { AFKHandlerTypes } from "../types";

type Cmd = AFKHandlerTypes.Command
export default class Command implements Cmd {

    public readonly name: Cmd["name"];
    public readonly aliases?: Cmd["aliases"]
    public readonly category?: Cmd["category"]
    public readonly callback?: Cmd["callback"]
    public readonly dev?: Cmd["dev"]
    public readonly devMsg?: Cmd["devMsg"]
    public readonly permissions?: Cmd["permissions"]
    public readonly permissionsMsg?: Cmd["permissionsMsg"]
    public readonly guilds: Cmd["guilds"]
    public readonly guildsMsg?: Cmd["guildsMsg"]
    public readonly locked?: Cmd["locked"]
    public readonly lockedMsg?: Cmd["lockedMsg"]

    constructor(options: AFKHandlerTypes.Command) {
    this.name = options.name
    this.aliases = options.aliases
    this.category = options.category
    this.callback =  options.run || options.callback || options.fire || options.execute || options.emit
    this.dev = options.dev 
    this.devMsg = options.devMsg
    this.permissions = options.permissions
    this.permissionsMsg = options.permissionsMsg
    this.guilds = options.guilds
    this.guildsMsg = options.guildsMsg
    this.locked = options.locked
    this.lockedMsg = options.lockedMsg
    }
}