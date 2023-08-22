import {
  SlashCommandBuilder,
  PermissionsBitField,
  ChatInputCommandInteraction,
  Role,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("add_role")
  .setDescription("Assign a list of users a specific role")
  .addStringOption((option) => {
    return option
      .setName("list")
      .setDescription(
        "The list of users to assign the role to, each mentioned with the @ prefix"
      )
      .setRequired(true);
  })
  .addRoleOption((option) => {
    return option
      .setName("role")
      .setDescription("The role to assign all the users to")
      .setRequired(true);
  })
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers);

const execute = async (interaction: ChatInputCommandInteraction) => {
  // Error message if needed
  let errorMessage = "There was an error running the command";

  // Defer the reply
  await interaction.deferReply();

  try {
    // Get the server in which the command was executed
    const guild = interaction.guild;

    // Ensure that the guild is not null
    if (guild === null) {
      errorMessage = "Server not found!";
      throw new Error();
    }

    // Convert the string list of users into a list of ids
    const users = interaction.options.getString("list");

    // Ensure that the users list is not null
    if (users === null) {
      errorMessage = "No users found!";
      throw new Error();
    }

    const userRegex = /<([^>]+)>/g;
    let userList = [];
    let match;
    while ((match = userRegex.exec(users)) !== null) {
      userList.push(match[1].slice(1));
    }

    // Get the role to assign to each user
    const role = interaction.options.getRole("role") ?? "";

    // Ensure that the role can be added
    if (!(role instanceof Role)) {
      errorMessage = "Role cannot be added!";
      throw new Error();
    }

    // Assign the role to each user in the list
    let assigned = 0;
    for (const userId of userList) {
      const member = await guild.members.fetch(userId);
      await member.roles.add(role);
      assigned++;
    }

    await interaction.editReply(
      `${userList.length} member${userList.length !== 1 ? "s" : ""} ${
        userList.length === 1 ? "was" : "were"
      } requested the role addition "${role.name}" by ${
        interaction.user.username
      }, of which ${assigned} role update${
        userList.length !== 1 ? "s" : ""
      } happened successfully.`
    );
  } catch (err) {
    console.log(err);
    await interaction.editReply(errorMessage);
  }
};

export { data, execute };
