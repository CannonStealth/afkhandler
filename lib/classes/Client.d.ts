import { Client as DJSClient, Collection, Snowflake } from "discord.js";
import { CommandInterface as Command, AFKHandlerOptions, CommandsOptions, SlashCommandInterface, EventInterface as Event, FeatureInterface } from "../types";
export default class AFKHandler<T = unknown> extends DJSClient implements AFKHandler {
    gadget: T;
    commands: Collection<string, Command>;
    aliases: Collection<string, string>;
    categories: Collection<string, string[]>;
    developers?: Snowflake[];
    cooldowns: Collection<string, number>;
    slashCommands: Collection<string, SlashCommandInterface>;
    constructor(options: AFKHandlerOptions<T>);
    private _loader;
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
    Commands(dir: string, options: CommandsOptions): Promise<this | never>;
    /**
     *
     * @param dir your directory
     * @param callback function executed when a command is loaded
     * @example client.SlashCommand("./slash-commands",
     * (cmd) => console.log("Loading slash command " + cmd.name))
     */
    SlashCommands(dir: string, callback?: (slashCommand: SlashCommandInterface, fileName: string) => unknown): Promise<this>;
    Events(dir: string, callback?: (event: Event, file: string) => unknown): this;
    Features(dir: string, callback: (feature: FeatureInterface, file: string) => unknown): this;
    private _setCooldown;
    /**
     *
     * @param text time to convert
     * @returns converted
     * @example client.date("5h 2m") // 18120000
     */
    date(text: string): number | never;
}
