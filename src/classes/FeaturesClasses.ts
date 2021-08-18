import { CommandInterface as Cmd,
  EventInterface as Evt, FeatureInterface as Ft, SlashCommandInterface as Scmd } from "../types";

export class Command<T = unknown> implements Cmd<T> {
  public readonly name: Cmd["name"];
  public readonly aliases?: Cmd["aliases"];
  public readonly callback?: Cmd<T>["callback"]
  public readonly emit?: Cmd<T>["callback"]
  public readonly run?: Cmd<T>["callback"]
  public readonly execute?: Cmd<T>["callback"]
  public readonly fire?: Cmd<T>["callback"]
  public readonly dev?: Cmd["dev"];
  public readonly devMsg?: Cmd["devMsg"];
  public readonly permissions?: Cmd["permissions"];
  public readonly permissionsMsg?: Cmd["permissionsMsg"];
  public readonly guilds: Cmd["guilds"];
  public readonly guildsMsg?: Cmd["guildsMsg"];
  public readonly locked?: Cmd["locked"];
  public readonly lockedMsg?: Cmd["lockedMsg"];
  public readonly cooldown?: Cmd["cooldown"];
  public readonly cooldownMsg?: Cmd["cooldownMsg"];
  public readonly args?: Cmd["args"];
  public readonly argsMsg?: Cmd["argsMsg"];
  public readonly help?: Cmd["help"]
  public readonly botPermissions?: Cmd["botPermissions"]
  public readonly botPermissionsMsg?: Cmd["botPermissionsMsg"]
  public readonly hidden?: Cmd["hidden"]

  constructor(options: Cmd<T>) {
    this.name = options.name;
    this.aliases = options.aliases;
    this.callback = options.callback
    this.emit = options.emit
    this.execute = options.execute
    this.fire = options.fire
    this.run = options.run
    this.dev = options.dev;
    this.devMsg = options.devMsg;
    this.permissions = options.permissions;
    this.permissionsMsg = options.permissionsMsg;
    this.guilds = options.guilds;
    this.guildsMsg = options.guildsMsg;
    this.locked = options.locked;
    this.lockedMsg = options.lockedMsg;
    this.cooldown = options.cooldown;
    this.cooldownMsg = options.cooldownMsg;
    this.args = options.args;
    this.argsMsg = options.argsMsg;
    this.help = options.help
    this.botPermissions = options.botPermissions
    this.botPermissionsMsg = options.botPermissionsMsg
    this.hidden = options.hidden
  }
}

export class SlashCommand<T = unknown> implements Scmd<T> {
  public readonly name: Scmd["name"]
  public readonly help?: Scmd["help"]
  public readonly description: Scmd["description"]
  public readonly callback?: Scmd<T>["callback"]
  public readonly emit?: Scmd<T>["callback"]
  public readonly run?: Scmd<T>["callback"]
  public readonly execute?: Scmd<T>["callback"]
  public readonly fire?: Scmd<T>["callback"]
  public readonly default?: Scmd["default"]
  public readonly options?: Scmd["options"]
  public readonly stop?: Scmd["stop"]
  public readonly type?: Scmd["type"]
  public readonly guilds?: Scmd["guilds"]
  public readonly guildsMsg?: Scmd["guildsMsg"]
  public readonly cooldown?: Scmd["cooldown"]
  public readonly cooldownMsg?: Scmd["cooldownMsg"]

  constructor(options: Scmd<T>) {
    this.name = options.name
    this.help = options.help
    this.description = options.description
    this.emit = options.emit
    this.execute = options.execute
    this.callback = options.callback 
    this.fire = options.fire
    this.run = options.run
    this.default = options.default
    this.options = options.options
    this.stop = options.stop
    this.type = options.type
    this.guilds = options.guilds
    this.guildsMsg = options.guildsMsg
    this.cooldown = options.cooldown
    this.cooldownMsg = options.cooldownMsg
  }
}

export class Event<T = unknown> implements Evt<T> {
  public readonly name: Evt["name"]
  public readonly once?: Evt["once"]
  public readonly callback?: Evt<T>["callback"]
  public readonly emit?: Evt<T>["callback"]
  public readonly run?: Evt<T>["callback"]
  public readonly execute?: Evt<T>["callback"]
  public readonly fire?: Evt<T>["callback"]


  constructor(options: Evt<T>) {
    this.name = options.name
    this.once = options.once 
    this.callback = options.callback
    this.emit = options.emit
    this.execute = options.execute
    this.callback = options.callback 
    this.fire = options.fire
    this.run = options.run
  }
}

export class Feature<T = unknown> implements Ft<T> {
  public readonly callback?: Ft<T>["callback"]
  public readonly emit?: Ft<T>["callback"]
  public readonly run?: Ft<T>["callback"]
  public readonly execute?: Ft<T>["callback"]
  public readonly fire?: Ft<T>["callback"]

  constructor(options: Evt<T>) {
    this.callback = options.callback
    this.emit = options.emit
    this.execute = options.execute
    this.callback = options.callback 
    this.fire = options.fire
    this.run = options.run
  }
}

export default {
  
} as Feature