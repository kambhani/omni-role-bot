import {
  SlashCommandBuilder,
  PermissionsBitField,
  ChatInputCommandInteraction,
  Role,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("remove_role")
  .setDescription(
    "Remove a role from a specific list of users or from everyone"
  )
  .addStringOption((option) => {
    return option
      .setName("list")
      .setDescription("The list of users to remove the role from, or @everyone")
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

    // Ensure that the guild is defined
    if (guild === null) {
      errorMessage = "Guild not found!";
      throw new Error();
    }

    // Get the role to assign to each user
    const role = interaction.options.getRole("role") ?? "";

    // Ensure that the role can be removed
    if (!(role instanceof Role)) {
      errorMessage = "Role cannot be removed!";
      throw new Error();
    }

    // Convert the string list of users into a list of ids
    const users = interaction.options.getString("list")?.trim();

    // Ensure that the users variables is not undefined
    if (typeof users === "undefined") {
      errorMessage = "Cannot find user";
      throw new Error();
    }

    // Store the number of people the role is being removed from
    let removed = 0;

    if (users === "@everyone") {
      let promises: Promise<any>[] = [];
      const members = await guild.members.fetch();
      let ctr = 0;
      members.forEach((member) => {
        if (member.roles.cache.has(role.id)) {
          member.roles.remove(role);
        }
      });
      await interaction.editReply(`${role} has been removed from all users`);
      return;
    }

    const userRegex = /<([^>]+)>/g;
    let userList = [];
    let match;
    while ((match = userRegex.exec(users)) !== null) {
      userList.push(match[1].slice(1));
    }

    // Remove the role to each user in the list
    for (const userId of userList) {
      const member = await guild.members.fetch(userId);
      await member.roles.remove(role);
      removed++;
    }

    await interaction.editReply(
      `${userList.length} member${userList.length !== 1 ? "s" : ""} ${
        userList.length === 1 ? "was" : "were"
      } requested the role removal "${role.name}" by ${
        interaction.user.username
      }, of which ${removed} role update${
        userList.length !== 1 ? "s" : ""
      } happened successfully.`
    );
  } catch (err) {
    console.log(err);
    await interaction.editReply(errorMessage);
  }
};

export { data, execute };
