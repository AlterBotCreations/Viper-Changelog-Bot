import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, SlashCommandBuilder, TextBasedChannel } from "discord.js";
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
    static async #getChangelogFromGitHub(url: string): Promise<string> {
        const data = await axios.get(url);
        return data.data.items;
    }

    /** Returns the changelog channel id from the url.
     * 
     * @param url 
     * @returns 
     */
    static async #getChangelogChannelIDFromGitHub(url: string): Promise<string> {
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

    static async execute(interaction: ChatInputCommandInteraction) {

        // Pull the data from the github.
        const changelogURL: string = "https://raw.githubusercontent.com/Ciccioarmory/loadingscreen/main/changelog.json";
        const data = await this.#getChangelogFromGitHub(changelogURL);

        // Format the data into a nice embed.
        const embed = this.#getChangelogEmbed(data);

        // Get the changelog channel ID from the github.
        const optionsURL: string = "https://raw.githubusercontent.com/AlterBotCreations/Viper-Changelog-Bot/main/options.json?token=GHSAT0AAAAAACDFRVBTHEEWB35YLW4QNZV6ZFEUMNA";
        const changelogChannelID: string = await this.#getChangelogChannelIDFromGitHub(optionsURL);

        // Send the embed to the changelog channel.
        interaction.guild?.channels.fetch(changelogChannelID).then(channel => {
            if (channel?.isTextBased) {
                (channel as TextBasedChannel).send({
                    embeds: [embed]
                })
            }
        })
    }

}

module.exports = {

    data: LatestSlashCommand.SLASH_COMMAND,

    async execute(interaction: ChatInputCommandInteraction) {
        LatestSlashCommand.execute(interaction);
    }

}