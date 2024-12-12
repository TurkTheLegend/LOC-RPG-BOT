const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

// Path to the registration data file
const REGISTER_FILE_PATH = path.join(__dirname, 'registrpg.json');

class UserRegistrationSystem {
    constructor(client) {
        this.client = client;
        this.registeredUsers = this.loadUsers();
    }

    // Load existing users from file
    loadUsers() {
        try {
            if (fs.existsSync(REGISTER_FILE_PATH)) {
                const data = fs.readFileSync(REGISTER_FILE_PATH, 'utf8');
                return JSON.parse(data);
            }
            return { users: [], metadata: { totalUsers: 0, lastModified: new Date().toISOString() } };
        } catch (error) {
            console.error('Error loading users:', error);
            return { users: [], metadata: { totalUsers: 0, lastModified: new Date().toISOString() } };
        }
    }

    // Save users to file
    saveUsers() {
        try {
            this.registeredUsers.metadata.totalUsers = this.registeredUsers.users.length;
            this.registeredUsers.metadata.lastModified = new Date().toISOString();
            
            fs.writeFileSync(REGISTER_FILE_PATH, JSON.stringify(this.registeredUsers, null, 4), 'utf8');
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    // Register a new user
    registerUser(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const discordTag = interaction.user.tag;

        // Check if user already exists
        const existingUser = this.registeredUsers.users.find(user => user.userId === userId);
        if (existingUser) {
            interaction.reply({ content: 'You are already registered!', ephemeral: true });
            return;
        }

        // Create new user entry
        const newUser = {
            userId: userId,
            username: username,
            discordTag: discordTag,
            points: 0,
            lastUpdated: new Date().toISOString()
        };

        // Add user to registrations
        this.registeredUsers.users.push(newUser);
        this.saveUsers();

        interaction.reply({ content: 'You have been successfully registered!', ephemeral: true });
    }

    // Get user's points
    getUserPoints(interaction) {
        const userId = interaction.user.id;
        const user = this.registeredUsers.users.find(u => u.userId === userId);

        if (user) {
            interaction.reply({ content: `Your current points: ${user.points}`, ephemeral: true });
        } else {
            interaction.reply({ content: 'You are not registered. Use /register first!', ephemeral: true });
        }
    }

    // Add command handlers
    setupCommands(client) {
        // Register Command
        const registerCommand = new SlashCommandBuilder()
            .setName('register')
            .setDescription('Register for the RPG system');

        // Points Command
        const pointsCommand = new SlashCommandBuilder()
            .setName('points')
            .setDescription('Check your current points');

        // Command handling logic would be implemented in your main bot file
        return { registerCommand, pointsCommand };
    }
}

// Export the class for use in main bot file
module.exports = UserRegistrationSystem;

// Example of how to use in main bot file:
/*
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages
    ] 
});

const userSystem = new UserRegistrationSystem(client);

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'register') {
        userSystem.registerUser(interaction);
    }

    if (commandName === 'points') {
        userSystem.getUserPoints(interaction);
    }
});

client.login('YOUR_DISCORD_BOT_TOKEN');
*/