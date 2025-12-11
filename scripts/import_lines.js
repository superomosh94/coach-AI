const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const CSV_FILE_PATH = path.join(__dirname, '..', 'flirty.csv');

async function importLines() {
    console.log('Starting import process...');

    // 1. Read CSV File
    let fileContent;
    try {
        fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf8');
        console.log(`Read ${fileContent.length} bytes from ${CSV_FILE_PATH}`);
    } catch (error) {
        console.error('Error reading CSV file:', error.message);
        process.exit(1);
    }

    // 2. Parse CSV
    // Simple parser: split by newlines, then regex for CSV with quotes
    const lines = fileContent.split(/\r?\n/);
    const parsedData = [];

    console.log(`Found ${lines.length} lines in CSV.`);

    // Regex to match CSV fields: 
    // Matches quoted strings OR unquoted non-comma sequences, followed by comma or end of line.
    const csvRegex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;

    for (const line of lines) {
        if (!line.trim()) continue; // Skip empty lines

        const matches = [];
        let match;
        // Reset lastIndex because we're reusing the regex object? No, strict mode usually fine, but safer to re-create or careful loop.
        // Actually String.prototype.matchAll is better or split.
        // Let's use a simpler split if we can trust the format, but quotes are tricky.
        // Let's use a robust simple parser loop.

        const row = [];
        let currentField = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    // Escaped quote
                    currentField += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                row.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        row.push(currentField); // Last field

        if (row.length >= 9) {
            parsedData.push({
                line_text: row[0],
                category: row[1],
                style: row[2],
                context: row[3],
                stage: row[4],
                target_gender: row[5],
                source_type: row[6],
                quality_score: parseFloat(row[7]) || 0,
                success_rate: parseFloat(row[8]) || 0.5
            });
        }
    }

    console.log(`Parsed ${parsedData.length} valid data rows.`);

    // 3. Connect to Database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('Connected to database.');

    // 4. Insert Data
    let insertedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (const data of parsedData) {
        try {
            // Check for duplicates
            const [rows] = await connection.execute(
                'SELECT line_id FROM flirting_lines WHERE line_text = ?',
                [data.line_text]
            );

            if (rows.length > 0) {
                duplicateCount++;
                continue;
            }

            // Insert
            await connection.execute(
                `INSERT INTO flirting_lines 
                (line_text, category, style, context, stage, target_gender, source_type, quality_score, success_rate, is_approved) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                [
                    data.line_text,
                    data.category,
                    data.style,
                    data.context,
                    data.stage,
                    data.target_gender,
                    data.source_type,
                    data.quality_score,
                    data.success_rate
                ]
            );
            insertedCount++;
            if (insertedCount % 50 === 0) process.stdout.write('.');

        } catch (error) {
            console.error(`\nError inserting line: "${data.line_text.substring(0, 20)}..." - ${error.message}`);
            errorCount++;
        }
    }

    console.log('\n\nImport Complete!');
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Duplicates Skipped: ${duplicateCount}`);
    console.log(`Errors: ${errorCount}`);

    await connection.end();
}

importLines();
