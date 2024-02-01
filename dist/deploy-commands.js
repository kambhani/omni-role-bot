import dotenv from "dotenv";
dotenv.config();
import { REST, Routes } from "discord.js";
import fs from "node:fs";
const token = process.env.token ?? "TOKEN";
const clientId = process.env.clientId ?? "CLIENT_ID";
const devServerId = process.env.devServerId ?? "DEV_SERVER_ID";
let promises = [];
const commands = [];
const commandsPath = "commands";
const commandFiles = fs
    .readdirSync(`./src/${commandsPath}`)
    .filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
    const filePath = `./${commandsPath}/${file}`;
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
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(Routes.applicationCommands(clientId), {
                body: commands,
            });
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) {
            console.error(error);
        }
    })();
});
