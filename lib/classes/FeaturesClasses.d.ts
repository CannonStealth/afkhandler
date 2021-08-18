import { CommandInterface as Cmd, EventInterface as Evt, FeatureInterface as Ft, SlashCommandInterface as Scmd } from "../types";
export declare class Command<T = unknown> implements Cmd<T> {
    readonly name: Cmd["name"];
    readonly aliases?: Cmd["aliases"];
    readonly callback?: Cmd<T>["callback"];
    readonly emit?: Cmd<T>["callback"];
    readonly run?: Cmd<T>["callback"];
    readonly execute?: Cmd<T>["callback"];
    readonly fire?: Cmd<T>["callback"];
    readonly dev?: Cmd["dev"];
    readonly devMsg?: Cmd["devMsg"];
    readonly permissions?: Cmd["permissions"];
    readonly permissionsMsg?: Cmd["permissionsMsg"];
    readonly guilds?: Cmd["guilds"];
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
    readonly emit?: Scmd<T>["callback"];
    readonly run?: Scmd<T>["callback"];
    readonly execute?: Scmd<T>["callback"];
    readonly fire?: Scmd<T>["callback"];
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
export declare class Event<T = unknown> implements Evt<T> {
    readonly name: Evt["name"];
    readonly once?: Evt["once"];
    readonly callback?: Evt<T>["callback"];
    readonly emit?: Evt<T>["callback"];
    readonly run?: Evt<T>["callback"];
    readonly execute?: Evt<T>["callback"];
    readonly fire?: Evt<T>["callback"];
    constructor(options: Evt<T>);
}
export declare class Feature<T = unknown> implements Ft<T> {
    readonly callback?: Ft<T>["callback"];
    readonly emit?: Ft<T>["callback"];
    readonly run?: Ft<T>["callback"];
    readonly execute?: Ft<T>["callback"];
    readonly fire?: Ft<T>["callback"];
    constructor(options: Evt<T>);
}
declare const _default: Feature<unknown>;
export default _default;
