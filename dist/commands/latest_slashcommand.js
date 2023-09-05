"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _LatestSlashCommand_getChangelogFromGitHub, _LatestSlashCommand_getChangelogEmbed, _LatestSlashCommand_sendChangelogEmbedToChannel;
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const config_json_1 = require("../config.json");
const options_json_1 = require("../options.json");
/** Sends the latest changelog entry to the changelog channel as a nicely-formatted embed.
 *
 */
class LatestSlashCommand {
    static execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // If interaction.guild is null, throw an error.
            if (interaction.guild === null) {
                throw new Error(`interaction.guild is null.`);
            }
            // Pull the data from the github.
            const data = yield __classPrivateFieldGet(this, _a, "m", _LatestSlashCommand_getChangelogFromGitHub).call(this);
            // Format the data into a nice embed.
            const embed = __classPrivateFieldGet(this, _a, "m", _LatestSlashCommand_getChangelogEmbed).call(this, data[0]);
            // Get the changelog channel ID from the github.
            const changelogChannelID = options_json_1.changelog_channel_id;
            // Fetch the guild by the id.
            const guild = yield interaction.client.guilds.fetch(options_json_1.guildId);
            // If the guild is null, throw an error.
            if (guild === null) {
                throw new Error(`guild is null. Check the id.`);
            }
            // Send the embed to the changelog channel.
            __classPrivateFieldGet(this, _a, "m", _LatestSlashCommand_sendChangelogEmbedToChannel).call(this, guild, changelogChannelID, embed);
            // Reply to the interaction.
            yield interaction.reply({
                ephemeral: true,
                content: `Latest changelog entry sent to <#${changelogChannelID}>`
            });
        });
    }
}
_a = LatestSlashCommand, _LatestSlashCommand_getChangelogFromGitHub = function _LatestSlashCommand_getChangelogFromGitHub() {
    return __awaiter(this, void 0, void 0, function* () {
        // Use axios to retrieve the data.
        const data = yield axios_1.default.get(config_json_1.changelogURL);
        return data.data.items;
    });
}, _LatestSlashCommand_getChangelogEmbed = function _LatestSlashCommand_getChangelogEmbed(changelogEntry) {
    // Create the description.
    var description = "";
    // Append the changes.
    for (const index in changelogEntry.changes) {
        description += `➤ ${changelogEntry.changes[index]}\n`;
    }
    const iconURL = "https://github.com/AlterBotCreations/Viper-Changelog-Bot/blob/main/Viper3.0White.png?raw=true";
    return new builders_1.EmbedBuilder()
        .setTitle(`${changelogEntry.date}`)
        .setDescription(`${description}`)
        .setColor(discord_js_1.Colors.Purple)
        .setAuthor({
        name: "viper-antiNerds",
        iconURL: iconURL
    })
        .setThumbnail(iconURL);
}, _LatestSlashCommand_sendChangelogEmbedToChannel = function _LatestSlashCommand_sendChangelogEmbedToChannel(guild, channelId, embed) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch the channel.
        const channel = yield guild.channels.fetch(channelId);
        // If the channel is null, throw an error.
        if (channel === null) {
            throw new Error(`channel is null.`);
        }
        // Attempt to send the message to the channel.
        const sentMessage = yield channel.send({
            embeds: [embed]
        });
        // If the message is null, throw an error.
        if (sentMessage === null) {
            throw new Error(`Message failed to send. Check the channel/bot permissions.`);
        }
    });
};
LatestSlashCommand.SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName("latest")
    .setDescription("Sends the latest changelog entry to the changelog channel.")
    .setDefaultMemberPermissions('0')
    .setDMPermission(false);
exports.default = LatestSlashCommand;
module.exports = {
    data: LatestSlashCommand.SLASH_COMMAND,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            LatestSlashCommand.execute(interaction);
        });
    }
};
