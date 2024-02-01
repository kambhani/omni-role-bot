import {
  SlashCommandBuilder,
  PermissionsBitField,
  ChatInputCommandInteraction,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("fetch_ban")
  .addStringOption((option) => {
    return option
      .setName("username")
      .setDescription("The name of the banned user")
      .setRequired(true);
  })
  .setDescription("Fetch a specific ban, given the username")
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
      const user = bans.find(
        (ban) => ban.user.username === interaction.options.getString("username")
      );
      if (user) {
        await interaction.editReply(
          `**${user.user.username}:** ${user.reason ?? "No reason given"}`
        );
      } else {
        await interaction.editReply("User not found in ban list!");
      }
    });
  } catch (err) {
    console.log(err);
    await interaction.editReply(errorMessage);
  }
};

export { data, execute };
