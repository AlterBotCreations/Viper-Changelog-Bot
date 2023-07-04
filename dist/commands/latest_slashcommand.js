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
var _a, _LatestSlashCommand_getChangelogFromGitHub, _LatestSlashCommand_getChangelogChannelIDFromGitHub, _LatestSlashCommand_getChangelogEmbed, _LatestSlashCommand_sendChangelogEmbedToChannel;
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const config_json_1 = require("../config.json");
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
            const embed = __classPrivateFieldGet(this, _a, "m", _LatestSlashCommand_getChangelogEmbed).call(this, data);
            // Get the changelog channel ID from the github.
            const changelogChannelID = yield __classPrivateFieldGet(this, _a, "m", _LatestSlashCommand_getChangelogChannelIDFromGitHub).call(this);
            // Send the embed to the changelog channel.
            __classPrivateFieldGet(this, _a, "m", _LatestSlashCommand_sendChangelogEmbedToChannel).call(this, interaction.guild, changelogChannelID, embed);
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
        // Define the changelog url.
        const url = config_json_1.changelogURL;
        // Use axios to retrieve the data.
        const data = yield axios_1.default.get(url);
        return data.data.items;
    });
}, _LatestSlashCommand_getChangelogChannelIDFromGitHub = function _LatestSlashCommand_getChangelogChannelIDFromGitHub() {
    return __awaiter(this, void 0, void 0, function* () {
        // Define the changelog url.
        const url = config_json_1.optionsURL;
        // Use axios to retrieve the data.
        const response = yield axios_1.default.get(url);
        const parsedData = response.data;
        return parsedData["changelog_channel_id"];
    });
}, _LatestSlashCommand_getChangelogEmbed = function _LatestSlashCommand_getChangelogEmbed(changelogEntry) {
    return new builders_1.EmbedBuilder()
        .setDescription(`${changelogEntry}`);
}, _LatestSlashCommand_sendChangelogEmbedToChannel = function _LatestSlashCommand_sendChangelogEmbedToChannel(guild, channelId, embed) {
    guild === null || guild === void 0 ? void 0 : guild.channels.fetch(channelId).then(channel => {
        if (channel === null || channel === void 0 ? void 0 : channel.isTextBased) {
            channel.send({
                embeds: [embed]
            });
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
