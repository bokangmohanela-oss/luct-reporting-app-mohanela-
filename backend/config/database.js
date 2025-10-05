const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'luct_reporting.db');

let db = null;

const initializeDatabase = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('✅ Connected to SQLite database');
        
        // Create tables
        await createTables();
        
        return db;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

const createTables = async () => {
    const tables = [
        `CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lecturer_id INTEGER DEFAULT 1,
            faculty_name TEXT NOT NULL,
            class_name TEXT NOT NULL,
            week_of_reporting INTEGER NOT NULL,
            date_of_lecture TEXT NOT NULL,
            course_name TEXT NOT NULL,
            course_code TEXT NOT NULL,
            lecturer_name TEXT DEFAULT 'Dr. John Smith',
            actual_students_present INTEGER NOT NULL,
            total_registered_students INTEGER NOT NULL,
            venue TEXT NOT NULL,
            scheduled_time TEXT NOT NULL,
            topic_taught TEXT NOT NULL,
            learning_outcomes TEXT NOT NULL,
            recommendations TEXT NOT NULL,
            status TEXT DEFAULT 'submitted',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_code TEXT UNIQUE NOT NULL,
            course_name TEXT NOT NULL
        )`
    ];

    for (const tableSql of tables) {
        try {
            await db.exec(tableSql);
        } catch (error) {
            console.error('Error executing SQL:', error.message);
        }
    }
    
    // Insert sample courses
    const sampleCourses = [
        ['DIWA2110', 'Web Application Development'],
        ['DBS2110', 'Database Systems'],
        ['NET2110', 'Networking Fundamentals'],
        ['PRO2110', 'Programming Fundamentals']
    ];
    
    for (const [code, name] of sampleCourses) {
        try {
            await db.run(
                'INSERT OR IGNORE INTO courses (course_code, course_name) VALUES (?, ?)',
                [code, name]
            );
        } catch (error) {
            console.error('Error inserting course:', error.message);
        }
    }
    
    console.log('✅ All tables created successfully');
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase first.');
    }
    return db;
};

module.exports = { initializeDatabase, getDb };