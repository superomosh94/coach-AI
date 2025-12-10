const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vibe_coach'
};

async function importCSV() {
    let db;
    try {
        console.log('='.repeat(60));
        console.log('📥 CSV to Database Importer');
        console.log('='.repeat(60));
        console.log();

        // Read CSV file
        const csvPath = path.join(__dirname, 'flirting_line.csv');
        console.log('📖 Reading CSV file...');
        const content = await fs.readFile(csvPath, 'utf-8');
        const lines = content.split('\n');

        // Skip header and filter empty lines
        const dataLines = lines.slice(1).filter(line => line.trim() !== '');
        console.log(`   Found ${dataLines.length} lines to import\n`);

        // Connect to database
        db = await mysql.createConnection(DB_CONFIG);
        console.log('✓ Connected to database\n');

        let imported = 0;
        let duplicates = 0;
        let errors = 0;

        console.log('🔄 Importing lines...\n');

        for (let i = 0; i < dataLines.length; i++) {
            const line = dataLines[i];

            try {
                // Parse CSV line (handling quoted fields)
                const fields = parseCSVLine(line);

                if (fields.length < 7) {
                    console.log(`  ⚠️  Skipping line ${i + 1}: Invalid format`);
                    errors++;
                    continue;
                }

                const [lineText, category, style, context, stage, targetGender, sourceType,
                    qualityScore, originalityScore, usageCount, hasEmoji, hasQuestion, hasCompliment] = fields;

                const query = `
                    INSERT INTO flirting_lines 
                    (line_text, category, style, context, stage, target_gender, source_type, 
                     quality_score, originality_score, success_rate, usage_count, has_emoji, has_question, has_compliment)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0.5, ?, ?, ?, ?)
                `;

                await db.query(query, [
                    lineText,
                    category || 'playful',
                    style || 'international',
                    context || 'opening',
                    stage || 'initial',
                    targetGender || 'neutral',
                    sourceType || 'website',
                    parseFloat(qualityScore) || 4.0,
                    parseFloat(originalityScore) || 0.7,
                    parseInt(usageCount) || 0,
                    parseInt(hasEmoji) || 0,
                    parseInt(hasQuestion) || 0,
                    parseInt(hasCompliment) || 0
                ]);

                imported++;

                if (imported % 20 === 0) {
                    console.log(`  ✓ Imported ${imported} lines...`);
                }

            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    duplicates++;
                } else {
                    console.error(`  ⚠️  Error on line ${i + 1}:`, error.message);
                    errors++;
                }
            }
        }

        console.log();
        console.log('='.repeat(60));
        console.log('✅ Import Complete!');
        console.log(`   • Total lines processed: ${dataLines.length}`);
        console.log(`   • Successfully imported: ${imported}`);
        console.log(`   • Duplicates skipped: ${duplicates}`);
        console.log(`   • Errors: ${errors}`);
        console.log('='.repeat(60));

        // Show database stats
        const [stats] = await db.query('SELECT COUNT(*) as total FROM flirting_lines');
        const [byStyle] = await db.query('SELECT style, COUNT(*) as count FROM flirting_lines GROUP BY style ORDER BY count DESC');
        const [byCategory] = await db.query('SELECT category, COUNT(*) as count FROM flirting_lines GROUP BY category ORDER BY count DESC');

        console.log(`\n📊 Database Statistics:`);
        console.log(`   Total lines in database: ${stats[0].total}`);
        console.log(`\n   By Style:`);
        byStyle.forEach(row => console.log(`      ${row.style}: ${row.count}`));
        console.log(`\n   By Category:`);
        byCategory.forEach(row => console.log(`      ${row.category}: ${row.count}`));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (db) await db.end();
    }
}

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Add last field
    if (current) {
        fields.push(current.trim());
    }

    return fields;
}

importCSV();
