import { CommandInterface as Cmd, EventInterface as Evt, SlashCommandInterface as Scmd } from "../types";
export declare class Command<T = unknown> implements Cmd<T> {
    readonly name: Cmd["name"];
    readonly aliases?: Cmd["aliases"];
    readonly callback?: Cmd<T>["callback"];
    readonly dev?: Cmd["dev"];
    readonly devMsg?: Cmd["devMsg"];
    readonly permissions?: Cmd["permissions"];
    readonly permissionsMsg?: Cmd["permissionsMsg"];
    readonly guilds: Cmd["guilds"];
    readonly guildsMsg?: Cmd["guildsMsg"];
    readonly locked?: Cmd["locked"];
    readonly lockedMsg?: Cmd["lockedMsg"];
    readonly cooldown?: Cmd["cooldown"];
    readonly cooldownMsg?: Cmd["cooldownMsg"];
    readonly args?: Cmd["args"];
    readonly argsMsg?: Cmd["argsMsg"];
    readonly help?: Cmd["help"];
    readonly botPermissions?: Cmd["botPermissions"];
    readonly botPermissionsMsg?: Cmd["botPermissionsMsg"];
    readonly hidden?: Cmd["hidden"];
    constructor(options: Cmd<T>);
}
export declare class SlashCommand<T = unknown> implements Scmd<T> {
    readonly name: Scmd["name"];
    readonly help?: Scmd["help"];
    readonly description: Scmd["description"];
    readonly callback?: Scmd<T>["callback"];
    readonly default?: Scmd["default"];
    readonly options?: Scmd["options"];
    readonly stop?: Scmd["stop"];
    readonly type?: Scmd["type"];
    readonly guilds?: Scmd["guilds"];
    readonly guildsMsg?: Scmd["guildsMsg"];
    readonly cooldown?: Scmd["cooldown"];
    readonly cooldownMsg?: Scmd["cooldownMsg"];
    constructor(options: Scmd<T>);
}
export declare class Event<T> implements Evt<T> {
    readonly name: Evt["name"];
    readonly once?: Evt["once"];
    readonly callback?: Evt<T>["callback"];
    constructor(options: Evt<T>);
}
