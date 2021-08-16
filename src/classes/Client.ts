import { Client as DJSClient, ClientApplication } from "discord.js";
import { ClientTypes } from "../types";
import repl from "repl";
import { join } from "path";
import { readdir, lstat } from "fs/promises"; 
import Command from "./Command"

export default class Client<T = unknown> extends DJSClient implements ClientTypes.Client {
  public gadget: T;

  constructor(options: ClientTypes.ClientOptions) {
    super(options.client);

    if (options.eval) repl.start().context.client = this;
    this.gadget = options.gadget as T
  }

  private async _loader<T>(dir: string, callback?: (file: T) => unknown) {
    const files = await readdir(join(__dirname, dir));
    for (const file of files) {
      const stat = await lstat(join(__dirname, dir, file));
      if (stat.isDirectory()) this._loader(join(__dirname, dir));
      else if (
        !file.endsWith(".js") &&
        !file.endsWith(".coffee") &&
        (!file.endsWith(".ts") || file.endsWith(".d.ts"))
      )
        continue;

      const command = (await import(join(__dirname, dir, file))).default;

      console.log(command);
      if (callback) callback!(command);
    }
  }

  /**
   * 
   * @param dir your directory
   * @param callback Function executed when a command is loaded
   * @example <AFKHandler>.commands("./commands", (command) => console.log("Loading command " + command.name))
   */

  public async commands(dir: string, callback?: (file: ClientTypes.Command) => unknown): Promise<void | never> {
    if (!dir) throw new Error("AFKHandler commands method ERROR: You forgot to specify the directory path in the first parameter")
    this._loader<ClientTypes.Command>(dir, (command) => {
      if (!command.name) throw new Error("AFKHandler commands file ERROR: You didn't put any name on a command")

      if (!command.callback && !command.run && !command.emit && !command.execute && !command.fire) throw new Error("AFKHandler commands file ERROR: You didn't put any run function on a command")
    })
  }
}

const client = new Client({ client: { intents: 2 } });
