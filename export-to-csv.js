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

async function exportToCSV() {
    let connection;

    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection(DB_CONFIG);

        console.log('📊 Fetching all unique lines from database...');
        const [lines] = await connection.query(`
            SELECT DISTINCT
                line_text,
                category,
                style,
                context,
                stage,
                target_gender,
                quality_score,
                originality_score
            FROM flirting_lines
        `);

        console.log(`✓ Found ${lines.length} unique lines`);

        // Create CSV header
        const header = 'line_text,category,style,context,stage,target_gender,quality_score,originality_score\n';

        // Create CSV rows
        const rows = lines.map(line => {
            return [
                `"${line.line_text.replace(/"/g, '""')}"`, // Escape quotes
                line.category || '',
                line.style || '',
                line.context || '',
                line.stage || '',
                line.target_gender || '',
                line.quality_score || '',
                line.originality_score || ''
            ].join(',');
        }).join('\n');

        const csvContent = header + rows;

        // Backup existing file
        const csvPath = path.join(__dirname, 'flirting_line.csv');
        if (fs.existsSync(csvPath)) {
            const backupPath = path.join(__dirname, `flirting_line_backup_${Date.now()}.csv`);
            fs.copyFileSync(csvPath, backupPath);
            console.log(`📦 Backed up existing CSV to: ${path.basename(backupPath)}`);
        }

        // Write new CSV
        fs.writeFileSync(csvPath, csvContent, 'utf8');
        console.log(`✓ Exported ${lines.length} lines to flirting_line.csv`);

        // Show summary
        const categories = {};
        const styles = {};

        lines.forEach(line => {
            categories[line.category] = (categories[line.category] || 0) + 1;
            styles[line.style] = (styles[line.style] || 0) + 1;
        });

        console.log('\n📈 Summary:');
        console.log('Categories:', categories);
        console.log('Styles:', styles);

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

// Run export
exportToCSV()
    .then(() => {
        console.log('\n✅ Export completed successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Export failed:', err);
        process.exit(1);
    });
