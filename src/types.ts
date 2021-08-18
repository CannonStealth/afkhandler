import {
  ClientOptions as DJSClientOptions,
  Message,
  Collection as Map,
  Snowflake,
  MessagePayload,
  MessageOptions,
  CommandInteraction,
  Guild,
  GuildMember,
  User,
  ApplicationCommandOptionData,
  ApplicationCommandType,
  InteractionReplyOptions,
  ClientEvents,
  Awaited as DJSAwaited,
} from "discord.js";

import AFKHandler from "./classes/Client";

type RenameKeyHelper<T, S extends string> = `${string & keyof T}${S}`;
export type RenameKey<T, S extends string, V> = {
  [Property in string & RenameKeyHelper<T, S>]: V;
} &
  T;

export type Awaited<T> = T | Promise<T>;
export type Arrayed<T> = T | T[];
export type DJSSend = string | MessagePayload | MessageOptions;
export type SlashSend = string | MessagePayload | InteractionReplyOptions;

export interface AFKHandlerOptions<T = unknown> {
  client: DJSClientOptions;
  eval?: boolean;
  gadget?: T;
  developers?: Arrayed<Snowflake>;
}

export interface AFKHandlerInterface<T = unknown> {
  gadget: AFKHandler<T>["gadget"];
  commands: Map<string, CommandInterface>;
  aliases: Map<string, string>;
  categories: Map<string, string[]>;
  developers?: Snowflake[];
  cooldowns: Map<string, number>;
  slashCommands: Map<string, SlashCommandInterface>;
}

export type Callback<T = unknown> = (
  destructureThis: {
    client: AFKHandler<T>;
    args: string[];
    message: Message;
  },
  gadget: AFKHandler["gadget"]
) => Awaited<unknown>;

interface CommandReturns {
  guilds: Arrayed<Snowflake>;
  nsfw: boolean;
  dev: boolean;
  permissions: Arrayed<Permissions>;
  locked: boolean;
  args: {
    max?: number;
    min?: number;
  };
  botPermissions: Arrayed<Permissions>;
}

type CommandReturnedMessage = Partial<
  RenameKey<CommandReturns, "Msg", DJSSend>
>;

type CommandHelp = {
  [Property in
    | "description"
    | "usage"
    | "example"
    | "note"
    | "category"]?: string;
};

export interface CommandInterface<T = unknown> extends CommandReturnedMessage {
  name: string;
  aliases?: string[];
  help?: CommandHelp;
  callback?: Callback<T>;
  run?: this["callback"];
  execute?: this["callback"];
  fire?: this["callback"];
  emit?: this["callback"];
  hidden?: boolean | null;
  cooldown?: string | number;
  cooldownMsg?: (remaining: string) => Awaited<SlashSend>;
}


interface SlashCommandReturns {
  guilds: Arrayed<Snowflake>;
}

type SlashCommandReturnedMessage = Partial<
  RenameKey<SlashCommandReturns, "Msg", SlashSend>
>;

export interface SlashCommandInterface<T = unknown>
  extends SlashCommandReturnedMessage {
  name: string;
  description: string;
  help?: CommandHelp;
  callback?: SlashCallback<T>;
  run?: this["callback"];
  execute?: this["callback"];
  fire?: this["callback"];
  emit?: this["callback"];
  default?: boolean;
  options?: Array<ApplicationCommandOptionData>;
  stop?: boolean;
  type?: ApplicationCommandType;
  cooldown?: string | number;
  cooldownMsg?: (remaining: string) => Awaited<SlashSend>;
}

export interface CommandsOptions {
  category?: string;
  callback?: (file: CommandInterface, fileName: string) => unknown;
  prefix: string;
}

export type SlashCallback<T = unknown> = (
  destructureThis: {
    client: AFKHandler<T>;
    interaction: CommandInteraction;
    member: GuildMember;
    guild: Guild;
    user: User;
  },
  gadget: AFKHandler<T>["gadget"]
) => Awaited<unknown>;

export interface EventInterface<T = unknown> {
  name: keyof ClientEvents;
  once?: boolean;
  callback?: EventCallback<T>;
  run?: this["callback"];
  fire?: this["callback"];
  execute?: this["callback"];
  emit?: this["callback"];
}

type EventCallback<T = unknown> = (destructureThis: {
  client: AFKHandler<T>;
  gadget: AFKHandler<T>["gadget"];
}) => DJSAwaited<void>;

export interface FeatureInterface<T = unknown> {
  callback?: FeatureCallback<T>;
  emit?: this["callback"];
  fire?: this["callback"];
  run?: this["callback"];
  execute?: this["callback"];
}

type FeatureCallback<T = unknown> = (destructureThis: {
  client: AFKHandler<T>;
  gadget: AFKHandler<T>["gadget"];
}) => unknown;

type Permissions =
  | "CREATE_INSTANT_INVITE"
  | "KICK_MEMBERS"
  | "BAN_MEMBERS"
  | "ADMINISTRATOR"
  | "MANAGE_CHANNELS"
  | "MANAGE_GUILD"
  | "ADD_REACTIONS"
  | "VIEW_AUDIT_LOG"
  | "VIEW_AUDIT_LOG"
  | "STREAM"
  | "VIEW_CHANNEL"
  | "SEND_MESSAGES"
  | "SEND_TTS_MESSAGES"
  | "MANAGE_MESSAGES"
  | "EMBED_LINKS"
  | "ATTACH_FILES"
  | "READ_MESSAGE_HISTORY"
  | "MENTION_EVERYONE"
  | "USE_EXTERNAL_EMOJIS"
  | "VIEW_GUILD_INSIGHTS"
  | "CONNECT"
  | "SPEAK"
  | "MUTE_MEMBERS"
  | "DEAFEN_MEMBERS"
  | "MOVE_MEMBERS"
  | "USE_VAD"
  | "CHANGE_NICKNAME"
  | "MANAGE_NICKNAMES"
  | "MANAGE_ROLES"
  | "MANAGE_WEBHOOKS"
  | "MANAGE_EMOJIS_AND_STICKERS"
  | "USE_APPLICATION_COMMANDS"
  | "REQUEST_TO_SPEAK"
  | "MANAGE_THREADS"
  | "USE_PUBLIC_THREADS"
  | "USE_PRIVATE_THREADS"
  | "USE_EXTERNAL_STICKERS";
