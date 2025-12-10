import os
import logging
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters

# Load environment variables
load_dotenv()

# Configuration
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

# Logging setup
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler for the /start command"""
    user_name = update.effective_user.first_name
    await context.bot.send_message(
        chat_id=update.effective_chat.id, 
        text=f"Hello {user_name}! I am your Vibe Coach. I can help you with flirting lines and cultural terms. Just ask me something!"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler for the /help command"""
    help_text = (
        "Here's how I can help:\n"
        "- Just type a keyword to search for flirting lines.\n"
        "- /start: Restart the conversation."
    )
    await context.bot.send_message(chat_id=update.effective_chat.id, text=help_text)

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler for text messages"""
    user_text = update.message.text
    # TODO: Connect to database to fetch real responses
    response_text = f"You said: '{user_text}'. I'm still learning, but soon I'll fetch cool lines for this!"
    
    await context.bot.send_message(chat_id=update.effective_chat.id, text=response_text)

async def main():
    """Main function to run the bot"""
    if not TELEGRAM_TOKEN:
        print("Error: TELEGRAM_TOKEN not found in .env file.")
        return
    
    print("Starting Vibe Coach Bot...")
    
    try:
        # Build application with custom timeout settings
        from telegram.request import HTTPXRequest
        request = HTTPXRequest(connection_pool_size=8, connect_timeout=30.0, read_timeout=30.0)
        application = ApplicationBuilder().token(TELEGRAM_TOKEN).request(request).build()
        
        # Add handlers
        start_handler = CommandHandler('start', start)
        help_handler = CommandHandler('help', help_command)
        message_handler = MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message)
        
        application.add_handler(start_handler)
        application.add_handler(help_handler)
        application.add_handler(message_handler)
        
        print("Initializing bot...")
        # Initialize and start polling
        await application.initialize()
        await application.start()
        await application.updater.start_polling()
        
        print("Bot is running! Press Ctrl+C to stop.")
        print("Try sending /start to @Searchmenetbot on Telegram")
        
        # Keep the bot running
        import asyncio
        try:
            while True:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            print("\nStopping bot...")
        finally:
            await application.updater.stop()
            await application.stop()
            await application.shutdown()
            
    except Exception as e:
        print(f"Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check your internet connection")
        print("2. If you're behind a firewall/proxy, Telegram API might be blocked")
        print("3. Try disabling any VPN or proxy")
        print("4. Check if api.telegram.org is accessible from your network")

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())

