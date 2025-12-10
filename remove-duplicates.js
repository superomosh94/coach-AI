const fs = require('fs').promises;
const path = require('path');

async function removeDuplicates() {
    const csvPath = path.join(__dirname, 'flirting_line.csv');

    try {
        console.log('📖 Reading CSV file...');
        const content = await fs.readFile(csvPath, 'utf-8');
        const lines = content.split('\n');

        // Get header
        const header = lines[0];
        const dataLines = lines.slice(1).filter(line => line.trim() !== '');

        console.log(`\n📊 Total lines in file: ${lines.length}`);
        console.log(`   Header: 1`);
        console.log(`   Data lines: ${dataLines.length}`);

        // Track unique lines by the text content (first column)
        const seen = new Set();
        const uniqueLines = [];
        const duplicates = [];

        for (const line of dataLines) {
            // Extract the line_text (first column, handling quoted text)
            const match = line.match(/^"([^"]+)"/);
            if (match) {
                const lineText = match[1];

                if (seen.has(lineText)) {
                    duplicates.push(lineText);
                } else {
                    seen.add(lineText);
                    uniqueLines.push(line);
                }
            } else {
                // No quotes, just use the line as-is
                if (seen.has(line)) {
                    duplicates.push(line);
                } else {
                    seen.add(line);
                    uniqueLines.push(line);
                }
            }
        }

        console.log(`\n🔍 Scan Results:`);
        console.log(`   Unique lines: ${uniqueLines.length}`);
        console.log(`   Duplicates found: ${duplicates.length}`);

        if (duplicates.length > 0) {
            console.log(`\n📝 Sample duplicates (first 5):`);
            duplicates.slice(0, 5).forEach((dup, i) => {
                console.log(`   ${i + 1}. "${dup.substring(0, 60)}..."`);
            });
        }

        // Create cleaned CSV
        const cleanedContent = header + '\n' + uniqueLines.join('\n');

        // Backup original file
        const backupPath = csvPath.replace('.csv', '_backup.csv');
        await fs.copyFile(csvPath, backupPath);
        console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);

        // Write cleaned file
        await fs.writeFile(csvPath, cleanedContent);
        console.log(`✅ Cleaned file saved: ${path.basename(csvPath)}`);

        console.log(`\n📊 Final Statistics:`);
        console.log(`   Original data lines: ${dataLines.length}`);
        console.log(`   Cleaned data lines: ${uniqueLines.length}`);
        console.log(`   Lines removed: ${duplicates.length}`);
        console.log(`   Reduction: ${((duplicates.length / dataLines.length) * 100).toFixed(2)}%`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

removeDuplicates();
