"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const repl_1 = __importDefault(require("repl"));
const path_1 = require("path");
const promises_1 = require("fs/promises");
class AFKHandler extends discord_js_1.Client {
    constructor(options) {
        super(options?.client);
        this.commands = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.categories = new discord_js_1.Collection();
        this.developers = options.developers ? [...options.developers] : undefined;
        this.cooldowns = new discord_js_1.Collection();
        this.slashCommands = new discord_js_1.Collection();
        if (options.eval)
            repl_1.default.start().context.client = this;
        this.gadget = options.gadget;
    }
    async _loader(dir, callback) {
        const files = await promises_1.readdir(path_1.join(process.cwd(), dir));
        for (const file of files) {
            const stat = await promises_1.lstat(path_1.join(process.cwd(), dir, file));
            if (stat.isDirectory())
                this._loader(path_1.join(process.cwd(), dir));
            else if (!file.endsWith(".js") &&
                !file.endsWith(".coffee") &&
                (!file.endsWith(".ts") || file.endsWith(".d.ts")))
                continue;
            const imported = (await Promise.resolve().then(() => __importStar(require(path_1.join(process.cwd(), dir, file))))).default;
            console.log(file);
            if (callback)
                callback(imported);
        }
    }
    /**
     *
     * @param dir your directory
     * @example client.Commands("./commands", {
     * prefix: "!",
     * category: "Misc",
     * callback(command) {
     *  console.log("Loading command " + command.name))
     * }
     */
    async Commands(dir, options) {
        if (!dir)
            throw new Error("AFKHandler commands method ERROR: You forgot to specify the directory path in the first parameter");
        if (!options?.prefix)
            throw new Error("AFKHandler commands method ERROR: You forgot to specify the prefix on options object (2nd paramerer)");
        this.on("messageCreate", async (message) => {
            if (message.author.bot || message.channel.type === "DM")
                return;
            const { prefix } = options;
            if (!message.content.startsWith(prefix))
                return;
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmdName = args.shift();
            if (!cmdName)
                return;
            if (!message.content.startsWith(`${prefix.toLowerCase()}${cmdName.toLowerCase()}`))
                return;
            const cmd = this.commands.get(cmdName.toLowerCase()) ||
                this.commands.get(this.aliases.get(cmdName.toLowerCase()));
            if (!cmd)
                return;
            if (cmd.locked) {
                if (cmd.lockedMsg)
                    message.channel.send(cmd.lockedMsg);
                return;
            }
            if (cmd.dev && !this.developers?.includes(message.author.id)) {
                if (cmd.devMsg)
                    message.channel.send(cmd.devMsg);
                return;
            }
            if (cmd.nsfw &&
                message.channel instanceof discord_js_1.TextChannel &&
                message.channel.nsfw) {
                if (cmd.nsfwMsg)
                    message.channel.send(cmd.nsfwMsg);
                return;
            }
            let guilds = cmd.guilds;
            if (guilds) {
                if (typeof guilds === "string")
                    guilds = [guilds];
                if (!guilds.includes(message.guildId)) {
                    if (cmd.guildsMsg)
                        message.channel.send(cmd.guildsMsg);
                    return;
                }
            }
            if (cmd.cooldown) {
                const cooldown = this.cooldowns.get(cmd.name + message.guild.id + message.author.id);
                if (cooldown && cooldown > Date.now()) {
                    if (cmd.cooldownMsg)
                        message.channel.send(cmd.cooldownMsg);
                    return;
                }
            }
            let botPermissions = cmd.botPermissions;
            if (botPermissions) {
                if (typeof botPermissions === "string")
                    botPermissions = [botPermissions];
                const channel = message.channel;
                if (botPermissions.every((p) => !channel.permissionsFor(message.member).has(p))) {
                    if (cmd.botPermissionsMsg)
                        message.channel.send(cmd.botPermissionsMsg);
                    return;
                }
            }
            let permissions = cmd.permissions;
            if (permissions) {
                if (typeof permissions === "string")
                    permissions = [permissions];
                const channel = message.channel;
                if (!permissions.some((p) => !channel.permissionsFor(message.member).has(p))) {
                    if (cmd.permissionsMsg)
                        message.channel.send(cmd.permissionsMsg);
                    return;
                }
            }
            if (cmd.args &&
                ((cmd.args.min && args.length < cmd.args.min) ||
                    (cmd.args.max && args.length > cmd.args.max))) {
                if (cmd.argsMsg)
                    message.channel.send(cmd.argsMsg);
                return;
            }
            let result;
            if (cmd.callback)
                result = await cmd.callback({ client: this, args, message }, this.gadget);
            if (cmd.run)
                result = await cmd.run({ client: this, args, message }, this.gadget);
            if (cmd.execute)
                result = await cmd.execute({ client: this, args, message }, this.gadget);
            if (cmd.fire)
                result = await cmd.fire({ client: this, args, message }, this.gadget);
            if (cmd.emit)
                result = await cmd.emit({ client: this, args, message }, this.gadget);
            if (result === true && cmd.cooldown) {
                this._setCooldown(cmd.name, message.guild, message.author, cmd.cooldown);
            }
        });
        this._loader(dir, (command) => {
            if (!command.name)
                throw new Error("AFKHandler commands file ERROR: You didn't put any name on a command");
            if (!command.callback &&
                !command.run &&
                !command.emit &&
                !command.execute &&
                !command.fire)
                throw new Error("AFKHandler commands file ERROR: You didn't put any run function on a command");
            if (command.cooldown &&
                typeof command.cooldown === "string" &&
                !/^(\d+[mhsd]\s?)+$/gi.test(command.cooldown))
                throw new Error("AFKHandler commands file ERROR: Invalid time to convert");
            if (options?.callback)
                options.callback(command);
            this.commands.set(command.name.toLowerCase(), command);
            if (command.aliases)
                for (const alias of command.aliases)
                    this.aliases.set(alias.toLowerCase(), command.name);
            const category = (command.help?.category || options?.category)?.toLowerCase();
            if (!category)
                return;
            let categoryGetter = this.categories.get(category);
            if (!categoryGetter)
                categoryGetter = [category];
            categoryGetter.push(command.name.toLowerCase());
            this.categories.set(category, categoryGetter);
        });
        return this;
    }
    /**
     *
     * @param dir your directory
     * @param callback function executed when a command is loaded
     * @example client.SlashCommand("./slash-commands",
     * (cmd) => console.log("Loading slash command " + cmd.name))
     */
    async SlashCommands(dir, callback) {
        const application = this.application;
        if (!application)
            throw new Error("AFKHandler SlashCommands function ERROR: Client isn't logged in, please log in to publish slash commands");
        this.on("interactionCreate", async (interaction) => {
            if (!interaction.inGuild() && interaction.isCommand()) {
                return interaction.reply("Try using slash commands in a guild!");
            }
            if (interaction.isCommand()) {
                const cmd = this.slashCommands.get(interaction.commandName);
                if (!cmd)
                    return;
                const user = interaction.user;
                const guild = interaction.guild;
                if (cmd.cooldown) {
                    const cooldown = this.cooldowns.get(interaction.commandName + guild.id + user.id);
                    if (cooldown) {
                        if (Date.now() < cooldown) {
                            if (cmd.cooldownMsg)
                                interaction.reply(cmd.cooldownMsg);
                            return;
                        }
                    }
                }
                const member = await guild.members.fetch(user.id);
                let result;
                if (cmd.callback)
                    result = cmd.callback({ client: this, interaction, member, guild, user }, this.gadget);
                if (cmd.run)
                    result = cmd.run({ client: this, interaction, member, guild, user }, this.gadget);
                if (cmd.execute)
                    result = cmd.execute({ client: this, interaction, member, guild, user }, this.gadget);
                if (cmd.fire)
                    result = cmd.fire({ client: this, interaction, member, guild, user }, this.gadget);
                if (cmd.emit)
                    result = cmd.emit({ client: this, interaction, member, guild, user }, this.gadget);
                if (result === true && cmd.cooldown)
                    this._setCooldown(cmd.name, guild, user, cmd.cooldown);
                return;
            }
            return;
        });
        this._loader(dir, (file) => {
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
                            .then(() => (callback ? callback(file) : undefined))
                            .catch((e) => {
                            console.log("AFKHandler warning: THIS ERROR CAN BE CAUSED BY AN INVALID SNOWFLAKE IN GUILDS ARRAY / STRING");
                            throw new Error(e);
                        });
                    }
                }
                else {
                    application.commands
                        .create(toSend)
                        .then(() => (callback ? callback(file) : undefined)); // creating the slash command
                }
            }
        });
    }
    async _setCooldown(name, guild, author, timer) {
        let time;
        if (typeof timer === "string")
            time = this.date(timer);
        else
            time = timer * 1000;
        this.cooldowns.set(name + guild.id + author.id, Date.now() + time);
    }
    /**
     *
     * @param text time to convert
     * @returns converted
     * @example client.date("5h 2m") // 18120000
     */
    date(text) {
        text = text.toLowerCase();
        return /^(\d+[mhsd]\s?)+$/gi.test(text)
            ? eval("( " +
                text
                    .replace("m", " * 60 + ")
                    .replace("h", " * 60 * 60 + ")
                    .replace("d", " * 24 * 60 * 60 + ")
                    .replace("s", " + 0 + ") +
                "0 ) * 1000")
            : (() => {
                throw new Error("AFKHandler date ERROR: Invalid time to convert");
            })();
    }
}
exports.default = AFKHandler;
