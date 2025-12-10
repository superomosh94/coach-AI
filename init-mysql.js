const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

console.log('🔧 MySQL Database Initialization Script');
console.log('========================================\n');

// Step 1: Connect to MySQL server (without database)
const connection = mysql.createConnection(DB_CONFIG);

connection.connect((err) => {
    if (err) {
        console.error('❌ Failed to connect to MySQL:', err.message);
        process.exit(1);
    }
    console.log('✓ Connected to MySQL server\n');

    // Step 2: Create database
    const dbName = process.env.DB_NAME || 'vibe_coach';
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
        if (err) {
            console.error('❌ Failed to create database:', err.message);
            connection.end();
            process.exit(1);
        }
        console.log(`✓ Database '${dbName}' ready\n`);

        // Step 3: Use the database
        connection.query(`USE ${dbName}`, (err) => {
            if (err) {
                console.error('❌ Failed to use database:', err.message);
                connection.end();
                process.exit(1);
            }

            // Step 4: Run schema.sql
            console.log('📋 Running schema.sql...');
            const schemaPath = path.join(__dirname, 'database', 'schema.sql');

            if (!fs.existsSync(schemaPath)) {
                console.error('❌ schema.sql not found at:', schemaPath);
                connection.end();
                process.exit(1);
            }

            let schemaSQL = fs.readFileSync(schemaPath, 'utf8');

            // Remove DELIMITER commands (not needed in Node.js)
            schemaSQL = schemaSQL.replace(/DELIMITER\s+\S+/gi, '');

            // Split by semicolons but handle procedures
            const statements = parseSQL(schemaSQL);

            executeStatements(statements, () => {
                console.log('✓ Schema created successfully\n');

                // Step 5: Run seed.sql
                console.log('🌱 Running seed.sql...');
                const seedPath = path.join(__dirname, 'database', 'seed.sql');

                if (!fs.existsSync(seedPath)) {
                    console.warn('⚠️  seed.sql not found, skipping seed data');
                    connection.end();
                    console.log('\n✅ Database initialization complete!');
                    process.exit(0);
                }

                let seedSQL = fs.readFileSync(seedPath, 'utf8');
                seedSQL = seedSQL.replace(/DELIMITER\s+\S+/gi, '');

                const seedStatements = parseSQL(seedSQL);

                executeStatements(seedStatements, () => {
                    console.log('✓ Seed data inserted successfully\n');
                    connection.end();
                    console.log('✅ Database initialization complete!');
                    console.log('\nYou can now run: node server.js');
                    process.exit(0);
                });
            });
        });
    });
});

function parseSQL(sql) {
    const statements = [];
    let current = '';
    let inProcedure = false;

    const lines = sql.split('\n');

    for (let line of lines) {
        line = line.trim();

        // Skip empty lines and comments
        if (!line || line.startsWith('--')) continue;

        // Check if we're entering a procedure/function
        if (line.match(/CREATE\s+(PROCEDURE|FUNCTION|TRIGGER)/i)) {
            inProcedure = true;
        }

        current += line + ' ';

        // Check for statement end
        if (inProcedure) {
            // End procedure on END followed by delimiter
            if (line.match(/^END\s*$/i) || line.match(/^END\s*\/\/\s*$/)) {
                inProcedure = false;
                statements.push(current.trim());
                current = '';
            }
        } else {
            if (line.endsWith(';')) {
                statements.push(current.trim());
                current = '';
            }
        }
    }

    if (current.trim()) {
        statements.push(current.trim());
    }

    return statements.filter(s => s.length > 0);
}

function executeStatements(statements, callback) {
    let index = 0;

    function executeNext() {
        if (index >= statements.length) {
            callback();
            return;
        }

        const statement = statements[index];
        index++;

        connection.query(statement, (err) => {
            if (err) {
                console.error(`⚠️  Warning executing statement: ${err.message}`);
                console.error(`Statement: ${statement.substring(0, 100)}...`);
            }
            executeNext();
        });
    }

    executeNext();
}
