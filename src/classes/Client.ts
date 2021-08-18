import {
  Client as DJSClient,
  Collection,
  Message,
  Snowflake,
  TextChannel,
} from "discord.js";
import { AFKHandlerTypes, DJSSend } from "../types";
import repl from "repl";
import { join } from "path";
import { readdir, lstat } from "fs/promises";

const format = (text: string) =>
  eval(
    "( " +
      text
        .replace("m", " * 60 + ")
        .replace("h", " * 60 * 60 + ")
        .replace("d", " * 24 * 60 * 60 + ")
        .replace("s", " + 0 + ") +
      "0 ) * 1000"
  );

export default class AFKHandler<T = unknown>
  extends DJSClient
  implements AFKHandlerTypes.AFKHandler
{
  public gadget: T;
  public commands: Collection<string, AFKHandlerTypes.Command>;
  public aliases: Collection<string, string>;
  public categories: Collection<string, string[]>;
  public developers?: Snowflake[];
  public cooldowns: Collection<string, number>;

  constructor(options: AFKHandlerTypes.AFKHandlerOptions) {
    super(options.client);

    this.commands = new Collection();
    this.aliases = new Collection();
    this.categories = new Collection();
    this.developers = options.developers ? [...options.developers] : undefined;
    this.cooldowns = new Collection();

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

    this.on("messageCreate", async (message) => {
      if (message.author.bot || message.channel.type === "DM") return;

      const { prefix } = options;
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/g);

      const cmdName = args.shift();

      if (!cmdName) return;

      if (
        !message.content.startsWith(
          `${prefix.toLowerCase()}${cmdName.toLowerCase()}`
        )
      )
        return;

      const cmd =
        this.commands.get(cmdName.toLowerCase()) ||
        this.commands.get(this.aliases.get(cmdName.toLowerCase())!);

      if (!cmd) return;

      if (cmd.locked) {
        if (cmd.lockedMsg) message.channel.send(cmd.lockedMsg);
        return;
      }

      if (cmd.dev && !this.developers?.includes(message.author.id)) {
        if (cmd.devMsg) message.channel.send(cmd.devMsg);
        return;
      }

      if (
        cmd.nsfw &&
        message.channel instanceof TextChannel &&
        message.channel.nsfw
      ) {
        if (cmd.nsfwMsg) message.channel.send(cmd.nsfwMsg);
        return;
      }

      let guilds = cmd.guilds;
      if (guilds) {
        if (typeof guilds === "string") guilds = [guilds];
        if (!guilds.includes(message.guildId!)) {
          if (cmd.guildsMsg) message.channel.send(cmd.guildsMsg);
          return;
        }
      }

      if (cmd.cooldown) {
        const cooldown = this.cooldowns.get(
          cmd.name + message.guild!.id + message.author.id
        );
        if (cooldown && cooldown > Date.now()) {
          if (cmd.cooldownMsg) message.channel.send(cmd.cooldownMsg);
          return;
        }
      }

      let permissions = cmd.permissions;

      if (permissions) {
        if (typeof permissions === "string") permissions = [permissions];

        const channel = message.channel as TextChannel;
        if (
          !permissions.some(
            (p) => !channel.permissionsFor(message.member!).has(p)
          )
        ) {
          if (cmd.permissionsMsg) message.channel.send(cmd.permissionsMsg);
          return;
        }
      }

      if (
        cmd.args &&
        ((cmd.args.min && args.length < cmd.args.min) ||
          (cmd.args.max && args.length > cmd.args.max))
      ) {
        if (cmd.argsMsg) message.channel.send(cmd.argsMsg);
        return;
      }

      let result;
      if (cmd.callback)
        result = await cmd.callback(
          { client: this, args, message },
          this.gadget
        );
      if (cmd.run)
        result = await cmd.run({ client: this, args, message }, this.gadget);
      if (cmd.execute)
        result = await cmd.execute(
          { client: this, args, message },
          this.gadget
        );
      if (cmd.fire)
        result = await cmd.fire({ client: this, args, message }, this.gadget);
      if (cmd.emit)
        result = await cmd.emit({ client: this, args, message }, this.gadget);

      if (result === true && cmd.cooldown) {
        this._setCooldown(message, cmd.cooldown, prefix);
      }
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

      if (
        command.cooldown &&
        typeof command.cooldown === "string" &&
        !/^(\d+[mhsd]\s?)+$/gi.test(command.cooldown)
      )
        throw new Error(
          "AFKHandler commands file ERROR: Invalid time to convert"
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
  private async _setCooldown(
    message: Message,
    timer: string | number,
    prefix: string
  ) {
    let time;

    if (typeof timer === "string") time = this.date(timer);
    else time = timer * 1000;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift();

    if (!cmdName) return;

    const cmd =
      this.commands.get(cmdName.toLowerCase()) ??
      this.commands.get(this.aliases.get(cmdName.toLowerCase())!);
    if (!cmd) return;

    const name = cmd.name;

    this.cooldowns.set(
      name + message.guild!.id + message.author.id,
      Date.now() + time
    );
  }

  /**
   *
   * @param text time to convert
   * @returns converted
   * @example client.date("5h 2m") // 18120000
   */
  public date(text: string): number | never {
    text = text.toLowerCase();
    return /^(\d+[mhsd]\s?)+$/gi.test(text)
      ? eval(
          "( " +
            text
              .replace("m", " * 60 + ")
              .replace("h", " * 60 * 60 + ")
              .replace("d", " * 24 * 60 * 60 + ")
              .replace("s", " + 0 + ") +
            "0 ) * 1000"
        )
      : (() => {
          throw new Error("AFKHandler date ERROR: Invalid time to convert");
        })();
  }
}
