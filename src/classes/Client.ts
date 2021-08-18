import {
  Client as DJSClient,
  Collection as Map,
  Guild,
  GuildMember,
  Snowflake,
  TextChannel,
  User,
} from "discord.js";
import {
  CommandInterface as Command,
  AFKHandlerOptions,
  CommandsOptions,
  SlashCommandInterface,
  EventInterface,
  FeatureInterface,
} from "../types";
import repl from "repl";
import { join } from "path";
import { readdir, lstat } from "fs/promises";
import { callbackify } from "util";

export default class AFKHandler<T = unknown>
  extends DJSClient
  implements AFKHandler
{
  public gadget: T;
  public commands: Map<string, Command>;
  public aliases: Map<string, string>;
  public categories: Map<string, string[]>;
  public developers?: Snowflake[];
  public cooldowns: Map<string, number>;
  public slashCommands: Map<string, SlashCommandInterface>;

  constructor(options: AFKHandlerOptions<T>) {
    super(options?.client);

    this.commands = new Map();
    this.aliases = new Map();
    this.categories = new Map();
    this.developers = options.developers ? [...options.developers] : undefined;
    this.cooldowns = new Map();
    this.slashCommands = new Map();

    if (options.eval) repl.start().context.client = this;
    this.gadget = options.gadget as T;
  }

  private async _loader<T>(
    dir: string,
    callback?: (file: T, fileName: string) => unknown
  ) {
    const files = await readdir(join(process.cwd(), dir));
    for (const file of files) {
      const stat = await lstat(join(process.cwd(), dir, file));
      if (stat.isDirectory()) this._loader(join(process.cwd(), dir));
      else if (
        !file.endsWith(".js") &&
        !file.endsWith(".coffee") &&
        (!file.endsWith(".ts") || file.endsWith(".d.ts"))
      )
        continue;

      const imported = (await import(join(process.cwd(), dir, file))).default;

      if (callback) callback(imported, file);
    }
  }

  /**
   *
   * @param dir your directory
   * @example client.Commands("./commands", {
  prefix: "!",
  category: "Misc",
  callback(command) {
  console.log("Loading command " + command.name)
  }
})
   */

  public async Commands(
    dir: string,
    options: CommandsOptions
  ): Promise<this | never> {
    if (!dir)
      throw new Error(
        "AFKHandler commands method ERROR: You forgot to specify the directory path in the first parameter"
      );

    if (!options?.prefix)
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
          const remaining = this.convert(cooldown);

          if (cmd.cooldownMsg)
            message.channel.send(await cmd.cooldownMsg(remaining));
          return;
        }
      }

      let botPermissions = cmd.botPermissions;

      if (botPermissions) {
        if (typeof botPermissions === "string")
          botPermissions = [botPermissions];

        const channel = message.channel as TextChannel;

        if (
          botPermissions.every(
            (p) => !channel.permissionsFor(message.member!).has(p)
          )
        ) {
          if (cmd.botPermissionsMsg)
            message.channel.send(cmd.botPermissionsMsg);
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
        this._setCooldown(
          cmd.name,
          message.guild!,
          message.author,
          cmd.cooldown
        );
      }
    });

    this._loader<Command>(dir, (command, file) => {
      if (!command.name)
        throw new Error(
          "AFKHandler commands " +
            file +
            " ERROR: You didn't put any name on a command"
        );

      if (
        !command.callback &&
        !command.run &&
        !command.emit &&
        !command.execute &&
        !command.fire
      )
        throw new Error(
          "AFKHandler commands " +
            file +
            " ERROR: You didn't put any run function on a command"
        );

      if (
        command.cooldown &&
        typeof command.cooldown === "string" &&
        !/^(\d+[mhsd]\s?)+$/gi.test(command.cooldown)
      )
        throw new Error(
          "AFKHandler commands " + file + " ERROR: Invalid time to convert"
        );

      this.commands.set(command.name.toLowerCase(), command);

      if (command.aliases)
        for (const alias of command.aliases)
          this.aliases.set(alias.toLowerCase(), command.name);

      const category = (
        command.help?.category || options?.category
      )?.toLowerCase();
      if (!category) {
        if (options?.callback) options.callback(command, file);
        return;
      }

      let categoryGetter = this.categories.get(category);
      if (!categoryGetter) categoryGetter = [category];
      categoryGetter.push(command.name.toLowerCase());

      this.categories.set(category, categoryGetter);

      if (options?.callback) options.callback(command, file);
    });

    return this;
  }

  /**
   *
   * @param dir your directory
   * @param callback function executed when a command is loaded
   * @example client.SlashCommands("./slash-commands",
   * (cmd) => console.log("Loading slash command " + cmd.name))
   */
  public async SlashCommands(
    dir: string,
    callback?: (
      slashCommand: SlashCommandInterface,
      fileName: string
    ) => unknown
  ) {
    const application = this.application;
    if (!application)
      throw new Error(
        "AFKHandler SlashCommands function ERROR: Client isn't logged in, please log in to publish slash commands"
      );

    this.on("interactionCreate", async (interaction) => {
      if (!interaction.inGuild() && interaction.isCommand()) {
        return interaction.reply("Try using slash commands in a guild!");
      }

      if (interaction.isCommand()) {
        const cmd = this.slashCommands.get(interaction.commandName);

        if (!cmd) return;

        const user = interaction.user;
        const guild = interaction.guild!;

        if (cmd.cooldown) {
          const cooldown = this.cooldowns.get(
            interaction.commandName + guild.id + user.id
          );

          if (cooldown) {
            if (Date.now() < cooldown) {
              const remaining = this.convert(cooldown);
              if (cmd.cooldownMsg)
                interaction.reply(await cmd.cooldownMsg(remaining));
              return;
            }
          }
        }

        const member = await guild.members.fetch(user.id);

        let result;
        if (cmd.callback)
          result = cmd.callback(
            { client: this, interaction, member, guild, user },
            this.gadget
          );
        if (cmd.run)
          result = cmd.run(
            { client: this, interaction, member, guild, user },
            this.gadget
          );
        if (cmd.execute)
          result = cmd.execute(
            { client: this, interaction, member, guild, user },
            this.gadget
          );
        if (cmd.fire)
          result = cmd.fire(
            { client: this, interaction, member, guild, user },
            this.gadget
          );
        if (cmd.emit)
          result = cmd.emit(
            { client: this, interaction, member, guild, user },
            this.gadget
          );

        if (result === true && cmd.cooldown)
          this._setCooldown(cmd.name, guild, user, cmd.cooldown);
        return;
      }

      return;
    });

    this._loader<SlashCommandInterface>(
      dir,
      (file: SlashCommandInterface, fileName) => {
        if (!file.name)
          throw new Error(
            "AFKHandler commands " +
              fileName +
              " ERROR: You didn't put any name in the command"
          );

        if (!file.description)
          throw new Error(
            "AFKHandler commands " +
              fileName +
              " ERROR: You didn't put any description property in the command"
          );

        if (
          !file.callback &&
          !file.run &&
          !file.emit &&
          !file.execute &&
          !file.fire
        )
          throw new Error(
            "AFKHandler commands " +
              fileName +
              " ERROR: You didn't put any run function on a command"
          );

        if (
          file.cooldown &&
          typeof file.cooldown === "string" &&
          !/^(\d+[mhsd]\s?)+$/gi.test(file.cooldown)
        )
          throw new Error(
            "AFKHandler commands " +
              fileName +
              " ERROR: Invalid time to convert"
          );

        this.slashCommands.set(file.name, file);
        if (!file.stop) {
          const toSend = {
            name: file.name,
            description: file.description,
            defaultPermission: file.default,
            options: file.options,
          };

          if (file.guilds && file.guilds.length) {
            for (const guild of file.guilds) {
              application.commands
                .create(toSend, guild)
                .then(() => (callback ? callback(file, fileName) : undefined))
                .catch((e: string) => {
                  console.log(
                    "AFKHandler warning: THIS ERROR CAN BE CAUSED BY AN INVALID SNOWFLAKE IN GUILDS ARRAY / STRING"
                  );
                  throw new Error(e);
                });
            }
          } else {
            application.commands
              .create(toSend)
              .then(() => (callback ? callback(file, fileName) : undefined));
          }
        }
      }
    );

    return this;
  }

  public Events(
    dir: string,
    callback?: (event: EventInterface, file: string) => unknown
  ) {
    this._loader<EventInterface>(dir, (event, file) => {
      if (!event.name)
        throw new Error(
          "AFKHandler events " + file + " ERROR: there's no event name"
        );
      const fun =
        event.callback ||
        event.run ||
        event.execute ||
        event.fire ||
        event.emit;

      if (!fun)
        throw new Error(
          "AFKHandler events " + file + " ERROR: there's no run function"
        );
      if (!event.once)
        this.on(
          event.name,
          fun.bind(null, { client: this, gadget: this.gadget })
        );
      else
        this.once(
          event.name,
          fun.bind(null, { client: this, gadget: this.gadget })
        );

      if (callback) callback(event, file);
    });

    return this;
  }

  public Features(
    dir: string,
    callback: (feature: FeatureInterface, file: string) => unknown
  ) {
    this._loader<FeatureInterface>(dir, (feature, file) => {
      const run =
        feature.run ||
        feature.execute ||
        feature.callback ||
        feature.emit ||
        feature.fire;

      if (!run)
        throw new Error(
          "AFKHandler features " + file + " ERROR: there's no run function"
        );

      run({ client: this, gadget: this.gadget });
      if (callback) callback(feature, file);
    });

    return this;
  }
  private async _setCooldown(
    name: string,
    guild: Guild,
    author: User | GuildMember,
    timer: string | number
  ) {
    let time;

    if (typeof timer === "string") time = this.date(timer);
    else time = timer * 1000;

    this.cooldowns.set(name + guild.id + author.id, Date.now() + time);
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

  public convert(number: number, decimals: number = 0) {
    let totalSeconds = number / 1000;
    let days = Math.floor(totalSeconds / 86400).toFixed() || 0;

    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600).toFixed() || 0;

    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60).toFixed() || 0;
    let seconds = totalSeconds % 60 || 0;
    seconds = +seconds.toFixed(decimals);

    return this._convertLong(
      [days, hours, minutes, seconds].map((t) => t.toString())
    );
  }

  private _convertLong(converted: string[]) {
    {
      let days: number | string = converted[0];
      let hours: number | string = converted[1];
      let minutes: number | string = converted[2];
      let seconds: number | string = converted[3];

      let dias: string = "days";
      let horas: string = "hours";
      let minutos: string = "minutes";
      let segundos: string = "seconds";

      if (+days <= 0) {
        days = "";
        dias = "";
      }

      if (+days === 1) dias = dias.replace("s", "");

      if (+hours <= 0) {
        hours = "";
        horas = "";
      }

      if (+hours === 1) horas = "hour";

      if (+minutes <= 0) {
        minutes = "";
        minutos = "";
      }
      if (+minutes === 1) minutos = "minute";

      if (+seconds <= 0) {
        seconds = "";
        segundos = "";
      }
      if (+seconds === 1) segundos = "second";

      return [days, dias, hours, horas, minutes, minutos, seconds, segundos]
        .join(" ")
        .split(/[ ]+/)
        .join(" ");
    }
  }
}

const client = new AFKHandler({
  client: {
    // discord.js ClientOptions
    intents: 32767,
  },
  developers: ["123456788910"], // developers
  eval: true, // eval on terminal
  gadget: "Test",
  // property that you can use in an event or command or feature
});

client.on("ready", () => {
  client.Commands("./commands", {
    // commands folder
    prefix: "!", // prefix
    category: "Misc", // default category
    callback(command, file) {
      // function executed when a command is loaded
      console.log("Loading command " + command.name);
    },
  });

  client.SlashCommands(
    "./slash-commands",
    (
      cmd,
      file // slash folder
    ) => console.log("Loading slash command " + cmd.name)
    // function executed when a slash command is published
  );

  client.Events(
    "./events",
    (
      event,
      file // events folder
    ) => console.log(`Loading event ${event.name}`)
    // function executed when an event is loaded
  );
  client.Features(
    "./features",
    (
      feature,
      file // features folder
    ) => console.log(`Loading feature from ${file}`)
    // function executed when a feature is loaded
  );
});

client.login("token");
