import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Colors, Guild, GuildBasedChannel, Message, SlashCommandBuilder, TextBasedChannel } from "discord.js";
import axios from 'axios';
import { changelogURL, optionsURL } from "../config.json";
import { guildId, changelog_channel_id } from "../options.json";

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

    // /** Returns the changelog channel id from the github options.
    //  * 
    //  * @param url 
    //  * @returns 
    //  */
    // static async #getChangelogChannelIDFromGitHub(): Promise<string> {
    //     // Use axios to retrieve the data.
    //     const response = await axios.get(optionsURL);
    //     const parsedData = response.data;
    //     return parsedData["changelog_channel_id"];
    // }

    /** Returns a nicely-formatted embed that displays a changelog entry.
     * 
     * @param changelogEntry 
     * @returns 
     */
    static #getChangelogEmbed(changelogEntry: any): EmbedBuilder {

        // Create the description.
        var description: string = "";

        // Append the changes.
        for (const index in changelogEntry.changes) {
            description += `➤ ${changelogEntry.changes[index]}\n`;
        }

        const iconURL: string = "https://github.com/AlterBotCreations/Viper-Changelog-Bot/blob/main/Viper3.0White.png?raw=true";

        return new EmbedBuilder()
            .setTitle(`${changelogEntry.date}`)
            .setDescription(`${description}`)
            .setColor(Colors.Purple)
            .setAuthor({
                name: "Viper Roleplay 3.0",
                iconURL: iconURL
            })
            .setThumbnail(iconURL);
    }

    /** Sends the changelog embed to the given channel id.
     * 
     * @param guild The guild the channel is in.
     * @param channelId The id of the channel to send the embed to.
     * @param embed The embedbuilder to send to the channel.
     */
    static async #sendChangelogEmbedToChannel(guild: Guild, channelId: string, embed: EmbedBuilder) {

        // Fetch the channel.
        const channel: GuildBasedChannel | null = await guild.channels.fetch(channelId);

        // If the channel is null, throw an error.
        if (channel === null) {
            throw new Error(`channel is null.`);
        }

        // Attempt to send the message to the channel.
        const sentMessage: Message | null = await (channel as TextBasedChannel).send({
            embeds: [embed]
        });

        // If the message is null, throw an error.
        if(sentMessage === null) {
            throw new Error(`Message failed to send. Check the channel/bot permissions.`);
        }
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
        const changelogChannelID: string = changelog_channel_id;

        // Fetch the guild by the id.
        const guild: Guild | null = await interaction.client.guilds.fetch(guildId);

        // If the guild is null, throw an error.
        if(guild === null) {
            throw new Error(`guild is null. Check the id.`);
        }

        // Send the embed to the changelog channel.
        this.#sendChangelogEmbedToChannel(guild, changelogChannelID, embed);

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