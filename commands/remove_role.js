import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

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
  .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

const execute = async (interaction) => {
  // Error message if needed
  let errorMessage = "There was an error running the command";
  try {
    // Get the server in which the command was executed
    const guild = interaction.guild;

    // Get the role to assign to each user
    const role = interaction.options.getRole("role") ?? "";

    // Conver the string list of users into a list of ids
    const users = interaction.options.getString("list").trim();

    // Store the number of people the role is being removed from
    let removed = 0;

    if (users === "@everyone") {
      const members = await guild.members.fetch();
      await members.forEach(async (member) => {
        await member.roles.remove(role);
      });
      interaction.reply("Role has been removed from all users");
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

    await interaction.reply(
      `${userList.length} member(s) were requested the role removal "${role.name}" by ${interaction.user.username}. Of the member(s) requested, ${removed} role update(s) happened successfully.`
    );
  } catch (err) {
    console.log(err);
    await interaction.reply(errorMessage);
  }
};

export { data, execute };
