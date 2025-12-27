const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const seedDatabase = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon
        const queries = sql
            .split(';')
            .map((query) => query.trim())
            .filter((query) => query.length > 0);

        console.log(`Found ${queries.length} queries to execute.`);

        for (const query of queries) {
            // Skip comments
            if (query.startsWith('--')) continue;

            console.log(`Executing: ${query.substring(0, 50)}...`);
            await db.query(query);
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
