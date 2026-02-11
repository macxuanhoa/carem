const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
    console.error('DATABASE_URL is not defined in .env');
    process.exit(1);
}

// Create backups directory if it doesn't exist
const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `backup-${timestamp}.sql`;
const filepath = path.join(backupDir, filename);

console.log(`Starting backup to ${filepath}...`);

// Use pg_dump (assumes it is installed and in PATH)
// If running in Docker, you might execute this inside the container
const command = `pg_dump "${DB_URL}" -f "${filepath}"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Backup error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
    }
    console.log(`Backup completed successfully: ${filename}`);
});
