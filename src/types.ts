import { ClientOptions as DJSClientOptions, Message } from "discord.js";

export namespace ClientTypes {
  export interface ClientOptions {
    client: DJSClientOptions;
    eval?: boolean;
    gadget?: unknown;
  }

  export interface Client<T = unknown> {
    gadget: T;
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
}
