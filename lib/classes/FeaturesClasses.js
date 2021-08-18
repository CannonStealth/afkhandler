"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = exports.Event = exports.SlashCommand = exports.Command = void 0;
class Command {
    constructor(options) {
        this.name = options.name;
        this.aliases = options.aliases;
        this.callback = options.callback;
        this.emit = options.emit;
        this.execute = options.execute;
        this.fire = options.fire;
        this.run = options.run;
        this.dev = options.dev;
        this.devMsg = options.devMsg;
        this.permissions = options.permissions;
        this.permissionsMsg = options.permissionsMsg;
        this.guilds = options.guilds;
        this.guildsMsg = options.guildsMsg;
        this.locked = options.locked;
        this.lockedMsg = options.lockedMsg;
        this.cooldown = options.cooldown;
        this.cooldownMsg = options.cooldownMsg;
        this.args = options.args;
        this.argsMsg = options.argsMsg;
        this.help = options.help;
        this.botPermissions = options.botPermissions;
        this.botPermissionsMsg = options.botPermissionsMsg;
        this.hidden = options.hidden;
    }
}
exports.Command = Command;
class SlashCommand {
    constructor(options) {
        this.name = options.name;
        this.help = options.help;
        this.description = options.description;
        this.emit = options.emit;
        this.execute = options.execute;
        this.callback = options.callback;
        this.fire = options.fire;
        this.run = options.run;
        this.default = options.default;
        this.options = options.options;
        this.stop = options.stop;
        this.type = options.type;
        this.guilds = options.guilds;
        this.guildsMsg = options.guildsMsg;
        this.cooldown = options.cooldown;
        this.cooldownMsg = options.cooldownMsg;
    }
}
exports.SlashCommand = SlashCommand;
class Event {
    constructor(options) {
        this.name = options.name;
        this.once = options.once;
        this.callback = options.callback;
        this.emit = options.emit;
        this.execute = options.execute;
        this.callback = options.callback;
        this.fire = options.fire;
        this.run = options.run;
    }
}
exports.Event = Event;
class Feature {
    constructor(options) {
        this.callback = options.callback;
        this.emit = options.emit;
        this.execute = options.execute;
        this.callback = options.callback;
        this.fire = options.fire;
        this.run = options.run;
    }
}
exports.Feature = Feature;
exports.default = {};
