import { ClientOptions as DJSClientOptions, Message, Collection } from "discord.js";

export namespace ClientTypes {
  export interface ClientOptions {
    client: DJSClientOptions;
    eval?: boolean;
    gadget?: unknown;
  }

  export interface Client<T = unknown> {
    gadget: T;
    commands: Collection<string, Command>
    aliases: Collection<string, string>
    categories: Collection<string, string[]>
  }

  export type Callback<T = unknown> = (
    destructureThis: {
      client: Client<T>;
      args: string[];
      message: Message;
    },
    gadget: Client["gadget"]
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
    callback?: (file: ClientTypes.Command) => unknown
  }
}
