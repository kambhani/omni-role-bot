import {
  SlashCommandBuilder,
  PermissionsBitField,
  ChatInputCommandInteraction,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("fetch_bans")
  .setDescription(
    "Fetch a list of all users who have been banned from a server"
  )
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers);

const execute = async (interaction: ChatInputCommandInteraction) => {
  // Error message if needed
  let errorMessage = "There was an error running the command";

  // Defer the reply
  await interaction.deferReply();

  try {
    // Get the server in which the command was executed
    const guild = interaction.guild;

    // Ensure that the guild is defined
    if (guild === null) {
      errorMessage = "Guild not found!";
      throw new Error();
    }

    guild.bans.fetch().then(async (bans) => {
      let list = bans
        .map((user) => user.user.username.replaceAll("\n", ""))
        .join("\n");
      await interaction.editReply(
        `__**${bans.size} users are banned:**__\n${list}`
      );
    });
  } catch (err) {
    console.log(err);
    await interaction.editReply(errorMessage);
  }
};

export { data, execute };
