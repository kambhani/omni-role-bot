var _a, _b, _c;
import { __awaiter } from "tslib";
import dotenv from "dotenv";
dotenv.config();
import { REST, Routes } from "discord.js";
import fs from "node:fs";
const token = (_a = process.env.token) !== null && _a !== void 0 ? _a : "TOKEN";
const clientId = (_b = process.env.clientId) !== null && _b !== void 0 ? _b : "CLIENT_ID";
const devServerId = (_c = process.env.devServerId) !== null && _c !== void 0 ? _c : "DEV_SERVER_ID";
let promises = [];
const commands = [];
const commandsPath = "./commands";
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const filePath = `${commandsPath}/${file}`;
    promises.push(import(filePath)
        .then((command) => {
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    })
        .catch((err) => {
        console.log(err);
        console.log(`[WARNING] The command at ${filePath} could not be loaded.`);
    }));
}
const rest = new REST().setToken(token);
Promise.all(promises).then(() => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = yield rest.put(Routes.applicationCommands(clientId), {
                body: commands,
            });
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) {
            console.error(error);
        }
    }))();
});
