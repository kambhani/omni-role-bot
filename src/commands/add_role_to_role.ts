import {
  SlashCommandBuilder,
  PermissionsBitField,
  ChatInputCommandInteraction,
  Role,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("add_role_to_role")
  .setDescription("Assign a role to all users with the given role")
  .addRoleOption((option) => {
    return option
      .setName("target_role")
      .setDescription("The role to target")
      .setRequired(true);
  })
  .addRoleOption((option) => {
    return option
      .setName("new_role")
      .setDescription("The role to add")
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

    // Get the role to target and role to add
    const target_role = interaction.options.getRole("target_role") ?? "";
    const new_role = interaction.options.getRole("new_role") ?? "";

    // Ensure that the role can be removed
    if (!(target_role instanceof Role) || !(new_role instanceof Role)) {
      errorMessage = "Invalid roles!";
      throw new Error();
    }

    // Store the number of people the role is being removed from
    let added = 0;
    const members = await guild.members.fetch();
    members.forEach((member) => {
      if (
        member.roles.cache.has(target_role.id) &&
        !member.roles.cache.has(new_role.id)
      ) {
        member.roles.add(new_role);
        added++;
      }
    });
    await interaction.editReply(
      `${new_role} has been added to users with ${target_role}. ${added} additions were performed`
    );
  } catch (err) {
    console.log(err);
    await interaction.editReply(errorMessage);
  }
};

export { data, execute };
