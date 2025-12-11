const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vibe_coach'
};

async function clearAndImport() {
    let connection;

    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection(DB_CONFIG);

        // Step 1: Clear existing data
        console.log('🗑️  Clearing existing flirting lines...');
        const [deleteResult] = await connection.query('DELETE FROM flirting_lines');
        console.log(`✓ Deleted ${deleteResult.affectedRows} existing lines`);

        // Step 2: Read CSV file
        const csvPath = path.join(__dirname, 'flirting_line_backup_1765435493585.csv');
        console.log('📖 Reading CSV file...');
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const lines = csvContent.split('\n');

        // Skip header line
        const dataLines = lines.slice(1).filter(line => line.trim());
        console.log(`✓ Found ${dataLines.length} lines to import`);

        // Step 3: Parse and insert lines
        console.log('💾 Importing lines to database...');
        let imported = 0;
        let errors = 0;

        for (const line of dataLines) {
            try {
                // Parse CSV line (handle quoted fields)
                const fields = parseCSVLine(line);

                if (fields.length >= 8) {
                    const [
                        line_text,
                        category,
                        style,
                        context,
                        stage,
                        target_gender,
                        source_type,
                        quality_score,
                        success_rate,
                        has_emoji,
                        has_question,
                        has_compliment
                    ] = fields;

                    await connection.query(
                        `INSERT INTO flirting_lines 
                        (line_text, category, style, context, stage, target_gender, source_type, 
                         quality_score, success_rate, has_emoji, has_question, has_compliment)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            line_text,
                            category || null,
                            style || null,
                            context || null,
                            stage || null,
                            target_gender || null,
                            source_type || 'manual_entry',
                            parseFloat(quality_score) || 4.0,
                            parseFloat(success_rate) || 0.7,
                            parseInt(has_emoji) || 0,
                            parseInt(has_question) || 0,
                            parseInt(has_compliment) || 0
                        ]
                    );
                    imported++;

                    if (imported % 100 === 0) {
                        console.log(`  ⏳ Imported ${imported}/${dataLines.length} lines...`);
                    }
                }
            } catch (err) {
                errors++;
                if (errors <= 5) {
                    console.error(`  ❌ Error importing line: ${err.message}`);
                }
            }
        }

        console.log(`\n✅ Import completed!`);
        console.log(`  ✓ Successfully imported: ${imported} lines`);
        console.log(`  ✗ Errors: ${errors}`);

        // Verify count
        const [result] = await connection.query('SELECT COUNT(*) as total FROM flirting_lines');
        console.log(`\n📊 Database now contains: ${result[0].total} lines`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n✓ Database connection closed');
        }
    }
}

// Helper function to parse CSV line with quoted fields
function parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator
            fields.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    // Add last field
    fields.push(current);

    return fields;
}

// Run import
console.log('🚀 Starting database clear and import...\n');
clearAndImport()
    .then(() => {
        console.log('\n✅ All done!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Failed:', err);
        process.exit(1);
    });
