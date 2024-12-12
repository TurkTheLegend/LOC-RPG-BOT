import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import dotenv from 'dotenv';

dotenv.config();


const e = ["1", "2"]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'even') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'e') {
    await interaction.reply(e[Math.floor(Math.random() * e.length)]);
  }
  
});

client.login(process.env.TOKEN);