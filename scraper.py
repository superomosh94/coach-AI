import os
import sys
import time

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

import hashlib
import mysql.connector
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'vibe_coach')
}

# Scraping configuration
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
DELAY_BETWEEN_REQUESTS = 2  # seconds
MAX_RETRIES = 3

class FlirtyLineScraper:
    def __init__(self):
        self.db = None
        self.cursor = None
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})
        self.scraped_count = 0
        self.duplicate_count = 0
        
    def connect_db(self):
        """Connect to MySQL database"""
        try:
            self.db = mysql.connector.connect(**DB_CONFIG)
            self.cursor = self.db.cursor()
            print("✓ Connected to database\n")
        except mysql.connector.Error as e:
            print(f"❌ Database connection failed: {e}")
            return False
        return True
    
    def close_db(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.db:
            self.db.close()
    
    def line_exists(self, line_text):
        """Check if line already exists in database"""
        line_hash = hashlib.sha256(line_text.strip().lower().encode()).hexdigest()
        query = "SELECT COUNT(*) FROM flirting_lines WHERE SHA2(LOWER(TRIM(line_text)), 256) = %s"
        self.cursor.execute(query, (line_hash,))
        count = self.cursor.fetchone()[0]
        return count > 0
    
    def insert_line(self, line_text, category='General', style='International', source='Web Scraping'):
        """Insert a flirting line into database"""
        if self.line_exists(line_text):
            self.duplicate_count += 1
            return False
        
        try:
            query = """
                INSERT INTO flirting_lines (line_text, category, style, usage_count)
                VALUES (%s, %s, %s, 0)
            """
            self.cursor.execute(query, (line_text, category, style))
            self.db.commit()
            self.scraped_count += 1
            return True
        except mysql.connector.Error as e:
            print(f"⚠️  Error inserting line: {e}")
            return False
    
    def clean_text(self, text):
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        # Remove quotes if they wrap the entire text
        text = text.strip('"\'""''')
        return text
    
    def scrape_pickuplines_com(self):
        """Scrape pickup lines from pickuplines.com"""
        print("📝 Scraping pickuplines.com...")
        base_url = "https://www.pickuplines.com"
        categories = ['funny', 'cheesy', 'cute', 'romantic', 'corny']
        
        for cat in categories:
            try:
                url = f"{base_url}/{cat}-pickup-lines/"
                print(f"  Fetching {cat} lines...")
                
                response = self.session.get(url, timeout=10)
                if response.status_code != 200:
                    print(f"  ⚠️  Failed to fetch {url}")
                    continue
                
                soup = BeautifulSoup(response.content, 'lxml')
                
                # Find all pickup lines (adjust selector based on site structure)
                lines = soup.find_all(['p', 'li', 'div'], class_=re.compile(r'line|pickup|quote'))
                
                if not lines:
                    # Fallback: get all paragraphs
                    lines = soup.find_all('p')
                
                for line in lines:
                    text = self.clean_text(line.get_text())
                    
                    # Filter: must be between 10 and 200 characters
                    if 10 <= len(text) <= 200 and '?' not in text[:50]:
                        category_map = {
                            'funny': 'Witty',
                            'cheesy': 'Playful',
                            'cute': 'Sweet',
                            'romantic': 'Romantic',
                            'corny': 'Playful'
                        }
                        self.insert_line(text, category=category_map.get(cat, 'General'))
                
                time.sleep(DELAY_BETWEEN_REQUESTS)
                
            except Exception as e:
                print(f"  ⚠️  Error scraping {cat}: {e}")
    
    def scrape_thought_catalog(self):
        """Scrape pickup lines from Thought Catalog articles"""
        print("\n📝 Scraping Thought Catalog...")
        urls = [
            "https://thoughtcatalog.com/january-nelson/2021/05/pickup-lines/",
            "https://thoughtcatalog.com/january-nelson/2020/02/funny-pickup-lines/"
        ]
        
        for url in urls:
            try:
                print(f"  Fetching {url[:50]}...")
                response = self.session.get(url, timeout=10)
                
                if response.status_code != 200:
                    continue
                
                soup = BeautifulSoup(response.content, 'lxml')
                
                # Find list items and paragraphs
                items = soup.find_all(['li', 'p'])
                
                for item in items:
                    text = self.clean_text(item.get_text())
                    
                    # Must be a reasonable length and not a header/navigation
                    if 15 <= len(text) <= 200 and not text.startswith(('Related', 'Share', 'Tweet')):
                        self.insert_line(text, category='Witty', style='Modern')
                
                time.sleep(DELAY_BETWEEN_REQUESTS)
                
            except Exception as e:
                print(f"  ⚠️  Error: {e}")
    
    def scrape_manual_sources(self):
        """Add some manually curated lines as fallback"""
        print("\n📝 Adding curated lines...")
        
        curated_lines = [
            ("Are you a magician? Because whenever I look at you, everyone else disappears.", "Romantic", "Classic"),
            ("Do you have a map? I just got lost in your eyes.", "Sweet", "Classic"),
            ("Is your name Google? Because you have everything I've been searching for.", "Witty", "Modern"),
            ("Are you a parking ticket? Because you've got FINE written all over you.", "Playful", "Modern"),
            ("Do you believe in love at first sight, or should I walk by again?", "Playful", "Classic"),
            ("Are you a camera? Because every time I look at you, I smile.", "Sweet", "Modern"),
            ("If beauty were time, you'd be an eternity.", "Romantic", "Classic"),
            ("Are you made of copper and tellurium? Because you're Cu-Te.", "Witty", "Modern"),
            ("Do you have a Band-Aid? I just scraped my knee falling for you.", "Playful", "Classic"),
            ("Is your name Wi-Fi? Because I'm feeling a connection.", "Witty", "Modern"),
        ]
        
        for line, category, style in curated_lines:
            self.insert_line(line, category=category, style=style)
    
    def run(self):
        """Run the scraper"""
        print("=" * 60)
        print("🔍 Flirty Lines Web Scraper")
        print("=" * 60)
        
        if not self.connect_db():
            return
        
        try:
            # Add manual curated lines first (always works)
            self.scrape_manual_sources()
            
            # Try scraping websites (may fail due to network/structure)
            print("\n⚠️  Note: Web scraping may fail due to site changes or network issues")
            print("   The script will add what it can find.\n")
            
            try:
                self.scrape_pickuplines_com()
            except Exception as e:
                print(f"⚠️  Skipping pickuplines.com: {e}")
            
            try:
                self.scrape_thought_catalog()
            except Exception as e:
                print(f"⚠️  Skipping Thought Catalog: {e}")
            
            print("\n" + "=" * 60)
            print(f"✅ Scraping complete!")
            print(f"   • New lines added: {self.scraped_count}")
            print(f"   • Duplicates skipped: {self.duplicate_count}")
            print("=" * 60)
            
        finally:
            self.close_db()

if __name__ == "__main__":
    scraper = FlirtyLineScraper()
    scraper.run()
