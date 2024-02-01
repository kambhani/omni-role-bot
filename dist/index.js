import dotenv from "dotenv";
dotenv.config();
import fs from "node:fs";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
const token = process.env.token;
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});
client.commands = new Collection();
const commandFiles = fs
    .readdirSync(new URL("./commands", import.meta.url))
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
for (const file of commandFiles) {
    import(new URL(`./commands/${file}`, import.meta.url).toString())
        .then((command) => {
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command from file ${file} is missing a required "data" or "execute" property.`);
        }
    })
        .catch((err) => {
        console.log(err);
        console.log(`[WARNING] The command from file ${file} could not be loaded.`);
    });
}
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
        else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});
client.login(token);
