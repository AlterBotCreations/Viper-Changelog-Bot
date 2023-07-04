import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Embed, Guild, SlashCommandBuilder, TextBasedChannel } from "discord.js";
import axios from 'axios';

/** Sends the latest changelog entry to the changelog channel as a nicely-formatted embed.
 * 
 */
export default class LatestSlashCommand {

    static readonly SLASH_COMMAND = new SlashCommandBuilder()
        .setName("latest")
        .setDescription("Sends the latest changelog entry to the changelog channel.")
        .setDefaultMemberPermissions('0')
        .setDMPermission(false);

    /** Returns the changelog data from the url.
     * 
     * @param url The url of the github .json file.
     * @returns 
     */
    static async #getChangelogFromGitHub(): Promise<string> {

        // Define the changelog url.
        const url: string = "https://raw.githubusercontent.com/Ciccioarmory/loadingscreen/main/changelog.json";

        // Use axios to retrieve the data.
        const data = await axios.get(url);
        return data.data.items;
    }

    /** Returns the changelog channel id from the url.
     * 
     * @param url 
     * @returns 
     */
    static async #getChangelogChannelIDFromGitHub(): Promise<string> {

        // Define the changelog url.
        const url: string = "https://raw.githubusercontent.com/AlterBotCreations/Viper-Changelog-Bot/main/options.json?token=GHSAT0AAAAAACEWZLKLFFS6K337ZY25ZRB6ZFEU6ZQ";

        // Use axios to retrieve the data.
        const data = await axios.get(url);
        const parsedData = JSON.parse(data.data);
        return parsedData["changelog_channel_id"];
    }

    /** Returns a nicely-formatted embed that displays a changelog entry.
     * 
     * @param changelogEntry 
     * @returns 
     */
    static #getChangelogEmbed(changelogEntry: string): EmbedBuilder {
        return new EmbedBuilder()
            .setDescription(`${changelogEntry}`);
    }

    /** Sends the changelog embed to the given channel id.
     * 
     * @param guild The guild the channel is in.
     * @param channelId The id of the channel to send the embed to.
     * @param embed The embedbuilder to send to the channel.
     */
    static #sendChangelogEmbedToChannel(guild: Guild, channelId: string, embed: EmbedBuilder) {
        guild?.channels.fetch(channelId).then(channel => {
            if (channel?.isTextBased) {
                (channel as TextBasedChannel).send({
                    embeds: [embed]
                })
            }
        })
    }

    static async execute(interaction: ChatInputCommandInteraction) {

        // If interaction.guild is null, throw an error.
        if (interaction.guild === null) {
            throw new Error(`interaction.guild is null.`);
        }

        // Pull the data from the github.
        const data = await this.#getChangelogFromGitHub();

        // Format the data into a nice embed.
        const embed = this.#getChangelogEmbed(data);

        // Get the changelog channel ID from the github.
        const changelogChannelID: string = await this.#getChangelogChannelIDFromGitHub();

        // Send the embed to the changelog channel.
        this.#sendChangelogEmbedToChannel(interaction.guild, changelogChannelID, embed);
    }

}

module.exports = {

    data: LatestSlashCommand.SLASH_COMMAND,

    async execute(interaction: ChatInputCommandInteraction) {
        LatestSlashCommand.execute(interaction);
    }

}