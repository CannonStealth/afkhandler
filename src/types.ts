import {
  ClientOptions as DJSClientOptions,
  Message,
  Collection,
  Snowflake,
  MessagePayload,
  MessageOptions,
} from "discord.js";

type RenameKeyHelper<T, S extends string> = `${string & keyof T}${S}`;
export type RenameKey<T, S extends string, V> = {
  [Property in string & RenameKeyHelper<T, S>]: V;
} &
  T;

export type Arrayed<T> = T | T[];
export type DJSSend = string | MessagePayload | MessageOptions;

  export interface AFKHandlerOptions<T = unknown> {
    client: DJSClientOptions;
    eval?: boolean;
    gadget?: T;
    developers?: Arrayed<Snowflake>;
  }

  export interface AFKHandler<T = unknown> {
    gadget: T;
    commands: Collection<string, CommandInterface>;
    aliases: Collection<string, string>;
    categories: Collection<string, string[]>;
    developers?: Snowflake[];
    cooldowns: Collection<string, number>
  }

  export type Callback<T = unknown> = (
    destructureThis: {
      client: AFKHandler<T>;
      args: string[];
      message: Message;
    },
    gadget: AFKHandler["gadget"]
  ) => unknown;

  interface CommandReturns { 
    guilds: Arrayed<Snowflake>
    nsfw: boolean;
    dev: boolean;
    permissions: Arrayed<Permissions>;
    locked: boolean
    cooldown: string | number
    args: {
      max?: number,
      min?: number,
    }
    botPermissions: Arrayed<Permissions>
  }


  type CommandReturnedMessage = Partial<RenameKey<CommandReturns, "Msg", DJSSend>>

    type CommandHelp = {
      [Property in "description" | "usage" | "example" | "note" | "category"]?: string
    }


  export interface CommandInterface<T = unknown> extends CommandReturnedMessage {
    name: string;
    aliases?: string[];
    help?: CommandHelp;
    callback?: Callback<T>;
    run?: this["callback"];
    execute?: this["callback"];
    fire?: this["callback"];
    emit?: this["callback"];
    hidden?: boolean | null
  }

  export interface CommandsOptions {
    category?: string;
    callback?: (file: CommandInterface) => unknown;
    prefix: string;
  }


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
| "USE_EXTERNAL_STICKERS"