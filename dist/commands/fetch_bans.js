import { SlashCommandBuilder, PermissionsBitField, } from "discord.js";
const data = new SlashCommandBuilder()
    .setName("fetch_bans")
    .setDescription("Fetch a list of all users who have been banned from a server")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers);
const execute = async (interaction) => {
    let errorMessage = "There was an error running the command";
    await interaction.deferReply();
    try {
        const guild = interaction.guild;
        if (guild === null) {
            errorMessage = "Guild not found!";
            throw new Error();
        }
        guild.bans.fetch().then(async (bans) => {
            let list = bans
                .map((user) => user.user.username.replaceAll("\n", ""))
                .join("\n");
            await interaction.editReply(`__**${bans.size} users are banned:**__\n${list}`);
        });
    }
    catch (err) {
        console.log(err);
        await interaction.editReply(errorMessage);
    }
};
export { data, execute };
