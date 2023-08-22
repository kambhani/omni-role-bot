import { __awaiter } from "tslib";
import { SlashCommandBuilder, PermissionsBitField, Role, } from "discord.js";
const data = new SlashCommandBuilder()
    .setName("add_role")
    .setDescription("Assign a list of users a specific role")
    .addStringOption((option) => {
    return option
        .setName("list")
        .setDescription("The list of users to assign the role to, each mentioned with the @ prefix")
        .setRequired(true);
})
    .addRoleOption((option) => {
    return option
        .setName("role")
        .setDescription("The role to assign all the users to")
        .setRequired(true);
})
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers);
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let errorMessage = "There was an error running the command";
    yield interaction.deferReply();
    try {
        const guild = interaction.guild;
        if (guild === null) {
            errorMessage = "Server not found!";
            throw new Error();
        }
        const users = interaction.options.getString("list");
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
        const role = (_a = interaction.options.getRole("role")) !== null && _a !== void 0 ? _a : "";
        if (!(role instanceof Role)) {
            errorMessage = "Role cannot be added!";
            throw new Error();
        }
        let assigned = 0;
        for (const userId of userList) {
            const member = yield guild.members.fetch(userId);
            yield member.roles.add(role);
            assigned++;
        }
        yield interaction.editReply(`${userList.length} member${userList.length !== 1 ? "s" : ""} ${userList.length === 1 ? "was" : "were"} requested the role addition "${role.name}" by ${interaction.user.username}, of which ${assigned} role update${userList.length !== 1 ? "s" : ""} happened successfully.`);
    }
    catch (err) {
        console.log(err);
        yield interaction.editReply(errorMessage);
    }
});
export { data, execute };
