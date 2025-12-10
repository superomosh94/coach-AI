const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const crypto = require('crypto');
require('dotenv').config();

// Configuration
const config = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'vibe_coach'
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    delayBetweenRequests: 2000, // 2 seconds
    maxRetries: 3
};

class FlirtingLineScraper {
    constructor() {
        this.db = null;
        this.scrapedCount = 0;
        this.duplicateCount = 0;
        this.lines = [];
    }

    async connect() {
        try {
            this.db = await mysql.createConnection(config.db);
            console.log('✓ Connected to database\n');
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            return false;
        }
    }

    async close() {
        if (this.db) {
            await this.db.end();
        }
    }

    hashLine(text) {
        return crypto.createHash('sha256').update(text.toLowerCase().trim()).digest('hex');
    }

    async lineExists(text) {
        const hash = this.hashLine(text);
        const [rows] = await this.db.query(
            'SELECT COUNT(*) as count FROM flirting_lines WHERE SHA2(LOWER(TRIM(line_text)), 256) = ?',
            [hash]
        );
        return rows[0].count > 0;
    }

    cleanText(text) {
        return text
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/^["'""'']+|["'""'']+$/g, '');
    }

    async insertLine(lineData) {
        const { text, category, style, context, quality_score, source_type } = lineData;

        if (await this.lineExists(text)) {
            this.duplicateCount++;
            return false;
        }

        try {
            const query = `
                INSERT INTO flirting_lines 
                (line_text, category, style, context, stage, target_gender, source_type, quality_score, originality_score, success_rate, usage_count)
                VALUES (?, ?, ?, ?, 'initial', 'neutral', ?, ?, 3.5, 0.5, 0)
            `;
            await this.db.query(query, [
                text,
                category || 'playful',
                style || 'international',
                context || 'opening',
                source_type || 'website',
                quality_score || 3.0
            ]);
            this.scrapedCount++;
            this.lines.push(lineData);
            return true;
        } catch (error) {
            console.error('⚠️  Error inserting line:', error.message);
            return false;
        }
    }

    async fetchWithRetry(url, retries = config.maxRetries) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await axios.get(url, {
                    headers: { 'User-Agent': config.userAgent },
                    timeout: 10000
                });
                return response.data;
            } catch (error) {
                if (i === retries - 1) throw error;
                await this.delay(1000 * (i + 1));
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async scrapePickupLinesOrg() {
        console.log('\n📝 Scraping pickup lines from web sources...');

        const sources = [
            {
                url: 'https://www.pickuplinesgalore.com/funny.html',
                category: 'funny',
                style: 'international'
            },
            {
                url: 'https://www.pickuplinesgalore.com/cheesy.html',
                category: 'cheesy',
                style: 'international'
            }
        ];

        for (const source of sources) {
            try {
                console.log(`  Fetching ${source.category} lines...`);
                const html = await this.fetchWithRetry(source.url);
                const $ = cheerio.load(html);

                // Find list items and paragraphs
                $('li, p').each((i, elem) => {
                    const text = this.cleanText($(elem).text());

                    // Filter: reasonable length and looks like a pickup line
                    if (text.length >= 10 && text.length <= 200) {
                        this.insertLine({
                            text,
                            category: source.category,
                            style: source.style,
                            context: 'opening',
                            quality_score: 3.5,
                            source_type: 'website'
                        });
                    }
                });

                await this.delay(config.delayBetweenRequests);
            } catch (error) {
                console.error(`  ⚠️  Failed to scrape ${source.category}:`, error.message);
            }
        }
    }

    async addCuratedLines() {
        console.log('\n📝 Adding curated flirting lines...');

        const curatedLines = [
            { text: "Are you a magician? Because whenever I look at you, everyone else disappears.", category: "romantic", style: "international", quality_score: 4.7 },
            { text: "Do you have a map? I keep getting lost in your eyes.", category: "cheesy", style: "international", quality_score: 3.2 },
            { text: "Is your name Google? Because you have everything I've been searching for.", category: "clever", style: "international", quality_score: 3.8 },
            { text: "If beauty were time, you'd be eternity.", category: "romantic", style: "international", quality_score: 4.8 },
            { text: "Are you a time traveler? Because I see you in my future.", category: "romantic", style: "international", quality_score: 4.5 },
            { text: "Do you believe in love at first sight, or should I walk by again?", category: "playful", style: "international", quality_score: 4.3 },
            { text: "Are you made of copper and tellurium? Because you're Cu-Te.", category: "clever", style: "international", quality_score: 4.1 },
            { text: "I'm not a photographer, but I can picture us together.", category: "smooth", style: "international", quality_score: 4.2 },
            { text: "Do you have a Band-Aid? I just scraped my knee falling for you.", category: "cheesy", style: "international", quality_score: 3.3 },
            { text: "Is your name Wi-fi? Because I'm really feeling a connection.", category: "clever", style: "international", quality_score: 3.6 },
            { text: "You must be tired because you've been running through my mind all day.", category: "playful", style: "international", quality_score: 3.5 },
            { text: "If you were a vegetable, you'd be a cutecumber.", category: "funny", style: "international", quality_score: 3.7 },
            { text: "Are you French? Because Eiffel for you.", category: "clever", style: "international", quality_score: 4.2 },
            { text: "Do you like Star Wars? Because Yoda one for me!", category: "funny", style: "international", quality_score: 3.9 },
            { text: "I was wondering if you had an extra heart, because mine was just stolen.", category: "romantic", style: "international", quality_score: 4.6 },
            { text: "Are you a parking ticket? Because you've got FINE written all over you.", category: "cheesy", style: "international", quality_score: 3.5 },
            { text: "I don't have a pickup line. I just wanted to say you're stunning.", category: "direct", style: "international", quality_score: 4.7 },
            { text: "You're like a dream I never want to wake up from.", category: "romantic", style: "international", quality_score: 4.9 },
            { text: "I don't need to see the stars when I can look at your eyes.", category: "romantic", style: "international", quality_score: 4.8 },
            { text: "Are you a 90 degree angle? Because you're looking right.", category: "funny", style: "international", quality_score: 4.0 }
        ];

        for (const line of curatedLines) {
            await this.insertLine({
                ...line,
                context: 'opening',
                source_type: 'manual_entry'
            });
        }
    }

    async exportToCSV() {
        console.log('\n💾 Exporting to CSV...');

        const csvHeader = 'line_text,category,style,context,quality_score,source_type\n';
        const csvRows = this.lines.map(line =>
            `"${line.text}",${line.category},${line.style},${line.context},${line.quality_score},${line.source_type}`
        ).join('\n');

        const csvContent = csvHeader + csvRows;
        await fs.writeFile('scraped_lines.csv', csvContent);
        console.log(`✓ Exported ${this.lines.length} lines to scraped_lines.csv`);
    }

    async exportToSQL() {
        console.log('💾 Exporting to SQL...');

        let sqlContent = `-- Scraped Flirting Lines (${new Date().toISOString()})\n\n`;
        sqlContent += `USE vibe_coach;\n\n`;
        sqlContent += `INSERT INTO flirting_lines (line_text, category, style, context, stage, target_gender, source_type, quality_score, originality_score, success_rate, usage_count) VALUES\n`;

        const values = this.lines.map((line, i) => {
            const isLast = i === this.lines.length - 1;
            return `('${line.text.replace(/'/g, "''")}', '${line.category}', '${line.style}', '${line.context}', 'initial', 'neutral', '${line.source_type}', ${line.quality_score}, 3.5, 0.5, 0)${isLast ? ';' : ','}`;
        }).join('\n');

        sqlContent += values;

        await fs.writeFile('scraped_lines.sql', sqlContent);
        console.log(`✓ Exported ${this.lines.length} lines to scraped_lines.sql`);
    }

    async run() {
        console.log('='.repeat(60));
        console.log('🔍 Flirting Lines Web Scraper (Node.js)');
        console.log('='.repeat(60));

        const connected = await this.connect();
        if (!connected) {
            console.log('\n⚠️  Running without database - will export to files only\n');
        }

        try {
            // Add curated lines (always works)
            await this.addCuratedLines();

            // Try web scraping (may fail)
            console.log('\n⚠️  Note: Web scraping may fail due to site changes or network issues');
            try {
                await this.scrapePickupLinesOrg();
            } catch (error) {
                console.error('⚠️  Web scraping failed:', error.message);
            }

            // Export to files
            if (this.lines.length > 0) {
                await this.exportToCSV();
                await this.exportToSQL();
            }

            console.log('\n' + '='.repeat(60));
            console.log('✅ Scraping complete!');
            console.log(`   • New lines added to DB: ${this.scrapedCount}`);
            console.log(`   • Duplicates skipped: ${this.duplicateCount}`);
            console.log(`   • Total lines collected: ${this.lines.length}`);
            console.log('='.repeat(60));

        } finally {
            await this.close();
        }
    }
}

// Run the scraper
if (require.main === module) {
    const scraper = new FlirtingLineScraper();
    scraper.run().catch(console.error);
}

module.exports = FlirtingLineScraper;
