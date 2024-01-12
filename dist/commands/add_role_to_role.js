import { __awaiter } from "tslib";
import { SlashCommandBuilder, PermissionsBitField, Role, } from "discord.js";
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
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let errorMessage = "There was an error running the command";
    yield interaction.deferReply();
    try {
        const guild = interaction.guild;
        if (guild === null) {
            errorMessage = "Guild not found!";
            throw new Error();
        }
        const target_role = (_a = interaction.options.getRole("target_role")) !== null && _a !== void 0 ? _a : "";
        const new_role = (_b = interaction.options.getRole("new_role")) !== null && _b !== void 0 ? _b : "";
        if (!(target_role instanceof Role) || !(new_role instanceof Role)) {
            errorMessage = "Invalid roles!";
            throw new Error();
        }
        let added = 0;
        const members = yield guild.members.fetch();
        members.forEach((member) => {
            if (member.roles.cache.has(target_role.id) &&
                !member.roles.cache.has(new_role.id)) {
                member.roles.add(new_role);
                added++;
            }
        });
        yield interaction.editReply(`${new_role} has been added to users with ${target_role}. ${added} additions were performed`);
    }
    catch (err) {
        console.log(err);
        yield interaction.editReply(errorMessage);
    }
});
export { data, execute };
