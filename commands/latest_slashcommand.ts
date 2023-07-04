import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, ColorResolvable, Colors, Guild, SlashCommandBuilder, TextBasedChannel } from "discord.js";
import axios from 'axios';
import { changelogURL, optionsURL } from "../config.json";

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
        // Use axios to retrieve the data.
        const data = await axios.get(changelogURL);
        return data.data.items;
    }

    /** Returns the changelog channel id from the github options.
     * 
     * @param url 
     * @returns 
     */
    static async #getChangelogChannelIDFromGitHub(): Promise<string> {
        // Use axios to retrieve the data.
        const response = await axios.get(optionsURL);
        const parsedData = response.data;
        return parsedData["changelog_channel_id"];
    }

    /** Returns a nicely-formatted embed that displays a changelog entry.
     * 
     * @param changelogEntry 
     * @returns 
     */
    static #getChangelogEmbed(changelogEntry: any): EmbedBuilder {

        // Create the description.
        var description: string = "";

        // Append the changes.
        for(const index in changelogEntry.changes) {
            description += `➤ ${changelogEntry.changes[index]}\n`;
        }

        return new EmbedBuilder()
            .setTitle(`${changelogEntry.date}`)
            .setDescription(`${description}`)
            .setColor(Colors.Purple);
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
        const embed = this.#getChangelogEmbed(data[0]);

        // Get the changelog channel ID from the github.
        const changelogChannelID: string = await this.#getChangelogChannelIDFromGitHub();

        // Send the embed to the changelog channel.
        this.#sendChangelogEmbedToChannel(interaction.guild, changelogChannelID, embed);


        // Reply to the interaction.
        await interaction.reply({
            ephemeral: true,
            content: `Latest changelog entry sent to <#${changelogChannelID}>`
        });

    }

}

module.exports = {

    data: LatestSlashCommand.SLASH_COMMAND,

    async execute(interaction: ChatInputCommandInteraction) {
        LatestSlashCommand.execute(interaction);
    }

}