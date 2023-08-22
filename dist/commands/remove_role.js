import { __awaiter } from "tslib";
import { SlashCommandBuilder, PermissionsBitField, Role, } from "discord.js";
const data = new SlashCommandBuilder()
    .setName("remove_role")
    .setDescription("Remove a role from a specific list of users or from everyone")
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
        const role = (_a = interaction.options.getRole("role")) !== null && _a !== void 0 ? _a : "";
        if (!(role instanceof Role)) {
            errorMessage = "Role cannot be removed!";
            throw new Error();
        }
        const users = (_b = interaction.options.getString("list")) === null || _b === void 0 ? void 0 : _b.trim();
        if (typeof users === "undefined") {
            errorMessage = "Cannot find user";
            throw new Error();
        }
        let removed = 0;
        if (users === "@everyone") {
            let promises = [];
            const members = yield guild.members.fetch();
            let ctr = 0;
            members.forEach((member) => {
                if (member.roles.cache.has(role.id)) {
                    member.roles.remove(role);
                }
            });
            yield interaction.editReply("Role has been removed from all users");
            return;
        }
        const userRegex = /<([^>]+)>/g;
        let userList = [];
        let match;
        while ((match = userRegex.exec(users)) !== null) {
            userList.push(match[1].slice(1));
        }
        for (const userId of userList) {
            const member = yield guild.members.fetch(userId);
            yield member.roles.remove(role);
            removed++;
        }
        yield interaction.editReply(`${userList.length} member${userList.length !== 1 ? "s" : ""} ${userList.length === 1 ? "was" : "were"} requested the role removal "${role.name}" by ${interaction.user.username}, of which ${removed} role update${userList.length !== 1 ? "s" : ""} happened successfully.`);
    }
    catch (err) {
        console.log(err);
        yield interaction.editReply(errorMessage);
    }
});
export { data, execute };
