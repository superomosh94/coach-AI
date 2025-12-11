const { Telegraf } = require('telegraf');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Check for token
if (!process.env.TELEGRAM_TOKEN) {
    console.error('❌ Error: TELEGRAM_TOKEN is missing in .env file');
    process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vibe_coach'
};

// Helper function to get database connection
async function getDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        return null;
    }
}

// Start command handler
// Start command handler
const startHandler = async (ctx) => {
    const userName = ctx.from.first_name || 'friend';
    const welcomeMessage = `
Hello ${userName}! 👋

I am your **Vibe Coach Bot**. I'm here to help you find the perfect lines! 💬✨

**Here is what I can do:**
🎲 **/random** - Get a surprise flirting line
🔍 **Search** - Just type any word (e.g., "coffee", "love", "eyes") to find matching lines

_I am connected to the Vibe Coach database, so I'm always learning new lines!_
    `;

    await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
};

// Register commands
bot.command('start', startHandler);
bot.command('tart', startHandler); // Handle typo/alias as requested

// Random line handler
bot.command('random', async (ctx) => {
    try {
        const connection = await getDbConnection();
        if (!connection) {
            return ctx.reply('Sorry, I cannot connect to my brain right now. 😵');
        }

        const [rows] = await connection.execute(
            'SELECT line_text, category FROM flirting_lines ORDER BY RAND() LIMIT 1'
        );
        await connection.end();

        if (rows.length > 0) {
            const line = rows[0];
            await ctx.reply(`✨ *${line.category}*\n\n"${line.line_text}"`, { parse_mode: 'Markdown' });
        } else {
            await ctx.reply('I ran out of lines! 😱');
        }
    } catch (err) {
        console.error('Error in /random:', err);
        await ctx.reply('Oops, something went wrong.');
    }
});

// Search handler
bot.on('text', async (ctx) => {
    const text = ctx.message.text;

    // Ignore commands (they are handled separately, but just in case)
    if (text.startsWith('/')) return;

    try {
        const connection = await getDbConnection();
        if (!connection) {
            return ctx.reply('Sorry, I cannot connect to my brain right now. 😵');
        }

        // Search in category or line_text
        const query = `
            SELECT line_text, category 
            FROM flirting_lines 
            WHERE line_text LIKE ? OR category LIKE ? 
            ORDER BY RAND() 
            LIMIT 5
        `;
        const searchTerm = `%${text}%`;

        const [rows] = await connection.execute(query, [searchTerm, searchTerm]);
        await connection.end();

        if (rows.length > 0) {
            let replyOps = rows.map(row => `✨ *${row.category}*: "${row.line_text}"`).join('\n\n');
            await ctx.reply(`Here are some lines for "${text}":\n\n${replyOps}`, { parse_mode: 'Markdown' });
        } else {
            await ctx.reply(`I couldn't find any lines matching "${text}". 😔\nTry "/random" for a surprise!`);
        }
    } catch (err) {
        console.error('Error handling message:', err);
        await ctx.reply('Sorry, something went wrong while searching.');
    }
});

// Launch bot
console.log('🤖 Starting Vibe Coach Bot...');
bot.launch().then(() => {
    console.log('✅ Bot is running!');
}).catch((err) => {
    console.error('❌ Failed to start bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
