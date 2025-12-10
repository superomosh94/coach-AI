const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vibe_coach'
};

async function getStats() {
    let db;
    try {
        db = await mysql.createConnection(DB_CONFIG);

        console.log('='.repeat(60));
        console.log('📊 DATABASE STATISTICS');
        console.log('='.repeat(60));
        console.log();

        // Total count
        const [total] = await db.query('SELECT COUNT(*) as count FROM flirting_lines');
        console.log(`🎯 TOTAL FLIRTING LINES: ${total[0].count}`);
        console.log();

        // By Style
        const [byStyle] = await db.query(`
            SELECT style, COUNT(*) as count 
            FROM flirting_lines 
            GROUP BY style 
            ORDER BY count DESC
        `);
        console.log('📝 By Style:');
        byStyle.forEach(row => {
            const percentage = ((row.count / total[0].count) * 100).toFixed(1);
            console.log(`   ${row.style.padEnd(15)} ${row.count.toString().padStart(4)} (${percentage}%)`);
        });
        console.log();

        // By Category
        const [byCategory] = await db.query(`
            SELECT category, COUNT(*) as count 
            FROM flirting_lines 
            GROUP BY category 
            ORDER BY count DESC
        `);
        console.log('🎨 By Category:');
        byCategory.forEach(row => {
            const percentage = ((row.count / total[0].count) * 100).toFixed(1);
            console.log(`   ${row.category.padEnd(15)} ${row.count.toString().padStart(4)} (${percentage}%)`);
        });
        console.log();

        // By Context
        const [byContext] = await db.query(`
            SELECT context, COUNT(*) as count 
            FROM flirting_lines 
            GROUP BY context 
            ORDER BY count DESC
        `);
        console.log('💬 By Context:');
        byContext.forEach(row => {
            const percentage = ((row.count / total[0].count) * 100).toFixed(1);
            console.log(`   ${row.context.padEnd(15)} ${row.count.toString().padStart(4)} (${percentage}%)`);
        });
        console.log();

        // By Stage
        const [byStage] = await db.query(`
            SELECT stage, COUNT(*) as count 
            FROM flirting_lines 
            GROUP BY stage 
            ORDER BY count DESC
        `);
        console.log('🎭 By Stage:');
        byStage.forEach(row => {
            const percentage = ((row.count / total[0].count) * 100).toFixed(1);
            console.log(`   ${row.stage.padEnd(15)} ${row.count.toString().padStart(4)} (${percentage}%)`);
        });
        console.log();

        // Quality stats
        const [quality] = await db.query(`
            SELECT 
                ROUND(AVG(quality_score), 2) as avg_quality,
                ROUND(MIN(quality_score), 2) as min_quality,
                ROUND(MAX(quality_score), 2) as max_quality,
                ROUND(AVG(originality_score), 2) as avg_originality
            FROM flirting_lines
        `);
        console.log('⭐ Quality Metrics:');
        console.log(`   Average Quality:     ${quality[0].avg_quality}/5.0`);
        console.log(`   Quality Range:       ${quality[0].min_quality} - ${quality[0].max_quality}`);
        console.log(`   Average Originality: ${quality[0].avg_originality}`);
        console.log();

        // Top 5 highest quality lines
        const [topLines] = await db.query(`
            SELECT line_text, quality_score, category, style
            FROM flirting_lines
            ORDER BY quality_score DESC
            LIMIT 5
        `);
        console.log('🏆 Top 5 Highest Quality Lines:');
        topLines.forEach((line, i) => {
            const text = line.line_text.length > 60 ? line.line_text.substring(0, 57) + '...' : line.line_text;
            console.log(`   ${i + 1}. [${line.quality_score}] "${text}"`);
            console.log(`      (${line.category} • ${line.style})`);
        });

        console.log();
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (db) await db.end();
    }
}

getStats();
