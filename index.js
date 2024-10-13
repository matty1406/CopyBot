const { Client, GatewayIntentBits, Events } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,  // Required to listen to nickname changes
    ]
});

// Replace with your bot's token
const TOKEN = 'YOUR_DISCORD_BOT_TOKEN';

// The target user ID you want to track
const targetUserID = '';

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Listen for deleted messages
client.on(Events.MessageDelete, async (deletedMessage) => {
    try {
        // Check if the deleted message is from the target user
        if (deletedMessage.author && deletedMessage.author.id === targetUserID) {
            const channel = deletedMessage.channel;

            // Send the deleted message content to the same channel or a log channel
            if (deletedMessage.content) {
                await channel.send(deletedMessage.content);
            }
        }
    } catch (error) {
        console.error('Error handling deleted message:', error);
    }
});

// Listen for nickname changes
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    try {
        // Check if the nickname change is from the target user
        if (newMember.id === targetUserID) {
            const newNickname = newMember.nickname;  // Get the new nickname (null if no nickname)
            const botMember = await newMember.guild.members.fetch(client.user.id);

            if (newNickname) {
                // Set the bot's nickname to "Not {newNickname}"
                const botNickname = `Not ${newNickname}`;
                await botMember.setNickname(botNickname);
                console.log(`Changed the bot's nickname to: ${botNickname}`);
            } else {
                // Reset the bot's nickname to default (null to remove custom nickname)
                await botMember.setNickname(null);
                console.log('Reset the bot\'s nickname to default.');
            }
        }
    } catch (error) {
        console.error('Error handling nickname change:', error);
    }
});

client.login(TOKEN);