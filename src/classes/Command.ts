import { Collection } from "discord.js";
import { CommandInterface as Cmd } from "../types";

export default class Command implements Cmd {
  public readonly name: Cmd["name"];
  public readonly aliases?: Cmd["aliases"];
  public readonly callback?: Cmd["callback"];
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

  constructor(options: Cmd) {
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

