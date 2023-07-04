import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
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

    static #getChangelogEmbed(changelogEntry: string): EmbedBuilder {

    }

    static async execute(interaction: ChatInputCommandInteraction) {

        // Pull the data from the github.
        const url: string = "https://raw.githubusercontent.com/Ciccioarmory/loadingscreen/main/changelog.json";
        const data = await this.#getChangelogFromGitHub(url);

        // Format the data into a nice embed.
        const embed = this.#getChangelogEmbed(data);

        // Get the changelog channel ID from the github.

        // Send the embed to the changelog channel.
    }

}

module.exports = {

    data: LatestSlashCommand.SLASH_COMMAND,

    async execute(interaction: ChatInputCommandInteraction) {
        LatestSlashCommand.execute(interaction);
    }

}