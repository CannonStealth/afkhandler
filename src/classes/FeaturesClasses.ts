import { CommandInterface as Cmd } from "../types";
import { SlashCommandInterface as Scmd } from "../types"

export class Command<T = unknown> implements Cmd<T> {
  public readonly name: Cmd["name"];
  public readonly aliases?: Cmd["aliases"];
  public readonly callback?: Cmd<T>["callback"];
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
    this.callback = options.run || options.callback || options.fire || options.execute || options.emit;
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
    this.callback = options.run || options.callback || options.fire || options.execute || options.emit;
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

