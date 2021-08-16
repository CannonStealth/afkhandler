import { ClientOptions as DJSClientOptions, Message, Collection } from "discord.js";

export namespace AFKHandlerTypes {
  export interface AFKHandlerOptions {
    client: DJSClientOptions;
    eval?: boolean;
    gadget?: unknown;
  }

  export interface AFKHandler<T = unknown> {
    gadget: T;
    commands: Collection<string, Command>
    aliases: Collection<string, string>
    categories: Collection<string, string[]>
  }

  export type Callback<T = unknown> = (
    destructureThis: {
      client: AFKHandler<T>;
      args: string[];
      message: Message;
    },
    gadget: AFKHandler["gadget"]
  ) => unknown;

  export interface Command<T = unknown> {
    name: string;
    aliases?: string[];
    category?: string;
    callback?: Callback<T>;
    run?: this["callback"];
    execute?: this["callback"];
    fire?: this["callback"];
    emit?: this["callback"];

  }

  export interface CommandsOptions {
    category?: string
    callback?: (file: Command) => unknown
  }
}
