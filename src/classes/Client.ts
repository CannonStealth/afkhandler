import { Client as DJSClient, ClientApplication, Collection } from "discord.js";
import { AFKHandlerTypes } from "../types";
import repl from "repl";
import { join } from "path";
import { readdir, lstat } from "fs/promises";

export default class AFKHandler<T = unknown>
  extends DJSClient
  implements AFKHandlerTypes.AFKHandler
{
  public gadget: T;
  public commands: Collection<string, AFKHandlerTypes.Command>;
  public aliases: Collection<string, string>;
  public categories: Collection<string, string[]>;

  constructor(options: AFKHandlerTypes.AFKHandlerOptions) {
    super(options.client);

    this.commands = new Collection();
    this.aliases = new Collection();
    this.categories = new Collection();

    if (options.eval) repl.start().context.client = this;
    this.gadget = options.gadget as T;
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

      const imported = (await import(join(__dirname, dir, file))).default;

      console.log(file);
      if (callback) callback!(imported);
    }
  }

  /**
   *
   * @param dir your directory
   * @param callback Function executed when a command is loaded
   * @example <AFKHandler>.commands("./commands", (command) => console.log("Loading command " + command.name))
   */

  public async Commands(
    dir: string,
    options: AFKHandlerTypes.CommandsOptions
  ): Promise<this | never> {
    if (!dir)
      throw new Error(
        "AFKHandler commands method ERROR: You forgot to specify the directory path in the first parameter"
      );

    if (!options.prefix)
      throw new Error(
        "AFKHandler commands method ERROR: You forgot to specify the prefix on options object (2nd paramerer)"
      );

    this.on("messageCreate", (message) => {
      if (message.author.bot || message.channel.type === "DM") return;

      const { prefix } = options;
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/g);

      const cmdName = args.shift();

      if (
        !message.content.startsWith(
          `${prefix.toLowerCase()}${cmdName?.toLowerCase()}`
        )
      )
        return;

      const cmd =
        this.commands.get(cmdName!.toLowerCase()) ||
        this.commands.get(this.aliases.get(cmdName!.toLowerCase())!); // Get command

      if (!cmd) return;

      if (cmd.callback) cmd.run!({ client: this, args, message }, this.gadget);
      if (cmd.run) cmd.run!({ client: this, args, message }, this.gadget);
      if (cmd.execute) cmd.run!({ client: this, args, message }, this.gadget);
      if (cmd.fire) cmd.run!({ client: this, args, message }, this.gadget);
      if (cmd.emit) cmd.run!({ client: this, args, message }, this.gadget);
    });

    this._loader<AFKHandlerTypes.Command>(dir, (command) => {
      if (!command.name)
        throw new Error(
          "AFKHandler commands file ERROR: You didn't put any name on a command"
        );

      if (
        !command.callback &&
        !command.run &&
        !command.emit &&
        !command.execute &&
        !command.fire
      )
        throw new Error(
          "AFKHandler commands file ERROR: You didn't put any run function on a command"
        );

      if (options?.callback) options.callback(command);
      this.commands.set(command.name.toLowerCase(), command);

      if (command.aliases)
        for (const alias of command.aliases)
          this.aliases.set(alias.toLowerCase(), command.name);

      const category = (command.category || options?.category)?.toLowerCase();
      if (!category) return;

      let categoryGetter = this.categories.get(category);
      if (!categoryGetter) categoryGetter = [category];
      categoryGetter.push(command.name.toLowerCase());

      this.categories.set(category, categoryGetter);
    });

    return this;
  }
}
