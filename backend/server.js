import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const dbPath = path.join(__dirname, 'data', 'luct_reporting.db');

// Initialize database
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err.message);
                reject(err);
            } else {
                console.log('✅ Connected to SQLite database');
                
                // Create tables
                db.serialize(() => {
                    // Create reports table
                    db.run(`
                        CREATE TABLE IF NOT EXISTS reports (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
                            prl_feedback TEXT,
                            status TEXT DEFAULT 'submitted',
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `, (err) => {
                        if (err) {
                            console.error('Error creating reports table:', err);
                        } else {
                            console.log('✅ Reports table created');
                        }
                    });
                    
                    // Create courses table
                    db.run(`
                        CREATE TABLE IF NOT EXISTS courses (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            course_code TEXT UNIQUE NOT NULL,
                            course_name TEXT NOT NULL
                        )
                    `, (err) => {
                        if (err) {
                            console.error('Error creating courses table:', err);
                        } else {
                            console.log('✅ Courses table created');
                        }
                    });
                    
                    // Create users table
                    db.run(`
                        CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            email TEXT UNIQUE NOT NULL,
                            password TEXT NOT NULL,
                            role TEXT NOT NULL,
                            name TEXT NOT NULL,
                            faculty TEXT DEFAULT 'Faculty of ICT',
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `, (err) => {
                        if (err) {
                            console.error('Error creating users table:', err);
                        } else {
                            console.log('✅ Users table created');
                        }
                    });
                    
                    // Create ratings table
                    db.run(`
                        CREATE TABLE IF NOT EXISTS ratings (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            report_id INTEGER NOT NULL,
                            student_id INTEGER NOT NULL,
                            rating_value INTEGER CHECK (rating_value BETWEEN 1 AND 5),
                            comments TEXT,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `, (err) => {
                        if (err) {
                            console.error('Error creating ratings table:', err);
                        } else {
                            console.log('✅ Ratings table created');
                        }
                    });

                    // Create classes table for PRL
                    db.run(`
                        CREATE TABLE IF NOT EXISTS classes (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            class_name TEXT NOT NULL,
                            course_code TEXT NOT NULL,
                            lecturer_id INTEGER,
                            schedule_day TEXT,
                            schedule_time TEXT,
                            venue TEXT,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `, (err) => {
                        if (err) {
                            console.error('Error creating classes table:', err);
                        } else {
                            console.log('✅ Classes table created');
                        }
                    });

                    // Create program_modules table for PL
                    db.run(`
                        CREATE TABLE IF NOT EXISTS program_modules (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            module_code TEXT UNIQUE NOT NULL,
                            module_name TEXT NOT NULL,
                            program TEXT NOT NULL,
                            credits INTEGER DEFAULT 3,
                            semester INTEGER DEFAULT 1,
                            lecturer_id INTEGER,
                            status TEXT DEFAULT 'active',
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `, (err) => {
                        if (err) {
                            console.error('Error creating program_modules table:', err);
                        } else {
                            console.log('✅ Program Modules table created');
                        }
                    });
                    
                    // Insert sample courses
                    const courses = [
                        ['DIWA2110', 'Web Application Development'],
                        ['DBS2110', 'Database Systems'],
                        ['NET2110', 'Networking Fundamentals'],
                        ['PRO2110', 'Programming Fundamentals']
                    ];
                    
                    const insertCourse = db.prepare('INSERT OR IGNORE INTO courses (course_code, course_name) VALUES (?, ?)');
                    courses.forEach(([code, name]) => {
                        insertCourse.run([code, name], (err) => {
                            if (err) {
                                console.log(`Course ${code} already exists`);
                            }
                        });
                    });
                    insertCourse.finalize();
                    console.log('✅ Sample courses inserted');
                    
                    // Insert sample student
                    db.run(
                        `INSERT OR IGNORE INTO users (email, password, role, name) VALUES (?, ?, ?, ?)`,
                        ['student@luct.ac.ls', 'password123', 'student', 'Alice Wonder'],
                        (err) => {
                            if (err) {
                                console.log('Sample student already exists');
                            } else {
                                console.log('✅ Sample student inserted');
                            }
                        }
                    );
                    
                    // Insert sample lecturer
                    db.run(
                        `INSERT OR IGNORE INTO users (email, password, role, name) VALUES (?, ?, ?, ?)`,
                        ['lecturer@luct.ac.ls', 'password123', 'lecturer', 'Dr. John Smith'],
                        (err) => {
                            if (err) {
                                console.log('Sample lecturer already exists');
                            } else {
                                console.log('✅ Sample lecturer inserted');
                            }
                        }
                    );
                    
                    // Insert sample PRL
                    db.run(
                        `INSERT OR IGNORE INTO users (email, password, role, name) VALUES (?, ?, ?, ?)`,
                        ['prl@luct.ac.ls', 'password123', 'prl', 'Prof. Mary Johnson'],
                        (err) => {
                            if (err) {
                                console.log('Sample PRL already exists');
                            } else {
                                console.log('✅ Sample PRL inserted');
                            }
                        }
                    );

                    // Insert sample PL
                    db.run(
                        `INSERT OR IGNORE INTO users (email, password, role, name) VALUES (?, ?, ?, ?)`,
                        ['pl@luct.ac.ls', 'password123', 'pl', 'Dr. James Wilson'],
                        (err) => {
                            if (err) {
                                console.log('Sample PL already exists');
                            } else {
                                console.log('✅ Sample PL inserted');
                            }
                        }
                    );

                    // Insert sample classes
                    const classes = [
                        ['IT2A', 'DIWA2110', 2, 'Monday', '14:00', 'Lab 301'],
                        ['IT2B', 'DIWA2110', 2, 'Tuesday', '10:00', 'Lab 302'],
                        ['BIT1A', 'DBS2110', 2, 'Wednesday', '08:00', 'Room 201'],
                        ['BIT1B', 'NET2110', 2, 'Thursday', '16:00', 'Lab 303']
                    ];
                    
                    const insertClass = db.prepare('INSERT OR IGNORE INTO classes (class_name, course_code, lecturer_id, schedule_day, schedule_time, venue) VALUES (?, ?, ?, ?, ?, ?)');
                    classes.forEach(([className, courseCode, lecturerId, day, time, venue]) => {
                        insertClass.run([className, courseCode, lecturerId, day, time, venue], (err) => {
                            if (err) {
                                console.log(`Class ${className} already exists`);
                            }
                        });
                    });
                    insertClass.finalize();
                    console.log('✅ Sample classes inserted');

                    // Insert sample program modules
                    const modules = [
                        ['WD101', 'Advanced Web Development', 'Web Development', 3, 2, 2],
                        ['DS201', 'Database Design & Implementation', 'Database Systems', 3, 1, 2],
                        ['NT301', 'Network Security', 'Networking', 3, 2, 2],
                        ['PF401', 'Advanced Programming', 'Programming', 3, 1, 2]
                    ];
                    
                    const insertModule = db.prepare('INSERT OR IGNORE INTO program_modules (module_code, module_name, program, credits, semester, lecturer_id) VALUES (?, ?, ?, ?, ?, ?)');
                    modules.forEach(([code, name, program, credits, semester, lecturer]) => {
                        insertModule.run([code, name, program, credits, semester, lecturer], (err) => {
                            if (err) {
                                console.log(`Module ${code} already exists`);
                            }
                        });
                    });
                    insertModule.finalize();
                    console.log('✅ Sample program modules inserted');
                    
                    console.log('🎉 Database initialization completed successfully!');
                    resolve(db);
                });
            }
        });
    });
};

// Helper functions for database operations
const dbAll = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const dbRun = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

const dbGet = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// ==================== STUDENT ROUTES ====================

// Student registration
app.post('/api/students/register', async (req, res) => {
    console.log('📝 Registration attempt:', req.body);
    
    try {
        const { email, password, name } = req.body;
        
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ 
                success: false,
                error: 'All fields are required: email, password, name' 
            });
        }
        
        // Check if user already exists
        const existingUser = await dbAll(db, 'SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ 
                success: false,
                error: 'User with this email already exists' 
            });
        }
        
        // Insert new user
        const result = await dbRun(db, 'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)', [email, password, 'student', name]);
        
        console.log('✅ User registered with ID:', result.lastID);
        
        res.json({
            success: true,
            message: 'Student registered successfully!',
            userId: result.lastID,
            user: {
                id: result.lastID,
                email: email,
                name: name,
                role: 'student'
            }
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Registration failed: ' + error.message 
        });
    }
});

// Student login
app.post('/api/students/login', async (req, res) => {
    console.log('🔐 Login attempt:', req.body.email);
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and password are required' 
            });
        }
        
        const users = await dbAll(db, 'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?', [email, password, 'student']);
        
        if (users.length === 0) {
            console.log('❌ Login failed: Invalid credentials');
            return res.status(401).json({ 
                success: false,
                error: 'Invalid email or password' 
            });
        }
        
        const user = users[0];
        console.log('✅ Login successful for:', user.email);
        
        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Login failed: ' + error.message 
        });
    }
});

// Get all reports for student monitoring
app.get('/api/students/reports', async (req, res) => {
    try {
        const reports = await dbAll(db, 'SELECT * FROM reports ORDER BY created_at DESC');
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Get reports by course
app.get('/api/students/reports/course/:courseCode', async (req, res) => {
    try {
        const { courseCode } = req.params;
        const reports = await dbAll(db, 'SELECT * FROM reports WHERE course_code = ? ORDER BY created_at DESC', [courseCode]);
        res.json(reports);
    } catch (error) {
        console.error('Error fetching course reports:', error);
        res.status(500).json({ error: 'Failed to fetch course reports' });
    }
});

// Submit a rating for a report
app.post('/api/students/ratings', async (req, res) => {
    try {
        const { report_id, student_id, rating_value, comments } = req.body;
        
        // Check if student already rated this report
        const existingRating = await dbAll(db, 'SELECT * FROM ratings WHERE report_id = ? AND student_id = ?', [report_id, student_id]);
        
        if (existingRating.length > 0) {
            return res.status(400).json({ error: 'You have already rated this report' });
        }
        
        const result = await dbRun(db, 'INSERT INTO ratings (report_id, student_id, rating_value, comments) VALUES (?, ?, ?, ?)', [report_id, student_id, rating_value, comments]);
        
        res.json({
            success: true,
            message: 'Rating submitted successfully!',
            ratingId: result.lastID
        });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ error: 'Failed to submit rating' });
    }
});

// ==================== LECTURER ROUTES ====================

// GET all courses for dropdown
app.get('/api/reports/courses', async (req, res) => {
    try {
        const courses = await dbAll(db, 'SELECT * FROM courses');
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// POST create new report
app.post('/api/reports', async (req, res) => {
    try {
        const {
            facultyName,
            className,
            weekOfReporting,
            dateOfLecture,
            courseName,
            courseCode,
            actualStudentsPresent,
            totalRegisteredStudents,
            venue,
            scheduledTime,
            topicTaught,
            learningOutcomes,
            recommendations
        } = req.body;

        console.log('📝 Received report submission:', {
            courseCode,
            className,
            weekOfReporting
        });

        const result = await dbRun(db, 
            `INSERT INTO reports (
                faculty_name, class_name, week_of_reporting, date_of_lecture,
                course_name, course_code, actual_students_present,
                total_registered_students, venue, scheduled_time, topic_taught,
                learning_outcomes, recommendations
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                facultyName, className, weekOfReporting, dateOfLecture,
                courseName, courseCode, actualStudentsPresent,
                totalRegisteredStudents, venue, scheduledTime, topicTaught,
                learningOutcomes, recommendations
            ]
        );

        console.log('✅ Report saved with ID:', result.lastID);
        
        res.json({
            success: true,
            message: 'Report submitted successfully!',
            reportId: result.lastID
        });
    } catch (error) {
        console.error('❌ Error creating report:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to submit report: ' + error.message 
        });
    }
});

// GET all reports (for testing)
app.get('/api/reports', async (req, res) => {
    try {
        const reports = await dbAll(db, 'SELECT * FROM reports ORDER BY created_at DESC');
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// ==================== PRL (PRINCIPAL LECTURER) ROUTES ====================

// PRL Login
app.post('/api/prl/login', async (req, res) => {
    console.log('🔐 PRL Login attempt:', req.body.email);
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Email and password are required' 
            });
        }
        
        const users = await dbAll(db, 'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?', [email, password, 'prl']);
        
        if (users.length === 0) {
            console.log('❌ PRL Login failed: Invalid credentials');
            return res.status(401).json({ 
                success: false,
                error: 'Invalid email or password' 
            });
        }
        
        const user = users[0];
        console.log('✅ PRL Login successful for:', user.email);
        
        res.json({
            success: true,
            message: 'PRL Login successful!',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ PRL Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Login failed: ' + error.message 
        });
    }
});

// PRL COURSES: View all courses & lectures under PRL stream
app.get('/api/prl/courses', async (req, res) => {
    try {
        const courses = await dbAll(db, `
            SELECT c.*, 
                   COUNT(DISTINCT r.id) as total_reports,
                   COUNT(DISTINCT cls.id) as total_classes,
                   u.name as main_lecturer
            FROM courses c
            LEFT JOIN reports r ON c.course_code = r.course_code
            LEFT JOIN classes cls ON c.course_code = cls.course_code
            LEFT JOIN users u ON cls.lecturer_id = u.id
            GROUP BY c.course_code
            ORDER BY c.course_code
        `);
        res.json(courses);
    } catch (error) {
        console.error('Error fetching PRL courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// PRL COURSES: Get detailed course information with lectures
app.get('/api/prl/courses/:courseCode/lectures', async (req, res) => {
    try {
        const { courseCode } = req.params;
        
        const lectures = await dbAll(db, `
            SELECT r.*, u.name as lecturer_name, 
                   (SELECT AVG(rating_value) FROM ratings WHERE report_id = r.id) as avg_rating,
                   (SELECT COUNT(*) FROM ratings WHERE report_id = r.id) as total_ratings
            FROM reports r
            LEFT JOIN users u ON r.lecturer_name = u.name
            WHERE r.course_code = ?
            ORDER BY r.date_of_lecture DESC
        `, [courseCode]);
        
        res.json(lectures);
    } catch (error) {
        console.error('Error fetching course lectures:', error);
        res.status(500).json({ error: 'Failed to fetch course lectures' });
    }
});

// PRL REPORTS: View all lecture reports
app.get('/api/prl/reports', async (req, res) => {
    try {
        const reports = await dbAll(db, `
            SELECT r.*, u.name as lecturer_name,
                   (SELECT AVG(rating_value) FROM ratings WHERE report_id = r.id) as avg_rating,
                   (SELECT COUNT(*) FROM ratings WHERE report_id = r.id) as total_ratings
            FROM reports r 
            LEFT JOIN users u ON r.lecturer_name = u.name 
            ORDER BY r.created_at DESC
        `);
        res.json(reports);
    } catch (error) {
        console.error('Error fetching PRL reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// PRL REPORTS: Get reports by status
app.get('/api/prl/reports/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const reports = await dbAll(db, 
            `SELECT r.*, u.name as lecturer_name FROM reports r 
             LEFT JOIN users u ON r.lecturer_name = u.name 
             WHERE r.status = ? ORDER BY r.created_at DESC`, 
            [status]
        );
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports by status:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// PRL REPORTS: Add feedback to report
app.put('/api/prl/reports/:reportId/feedback', async (req, res) => {
    try {
        const { reportId } = req.params;
        const { feedback, status } = req.body;
        
        const result = await dbRun(db, 
            'UPDATE reports SET prl_feedback = ?, status = ? WHERE id = ?', 
            [feedback, status || 'reviewed', reportId]
        );
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        
        res.json({
            success: true,
            message: 'Feedback submitted successfully!',
            reportId: reportId
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// PRL MONITORING: Get monitoring dashboard data
app.get('/api/prl/monitoring', async (req, res) => {
    try {
        const monitoringData = await dbAll(db, `
            SELECT 
                COUNT(DISTINCT r.id) as total_reports,
                COUNT(DISTINCT CASE WHEN r.status = 'submitted' THEN r.id END) as pending_reports,
                COUNT(DISTINCT CASE WHEN r.status = 'reviewed' THEN r.id END) as reviewed_reports,
                COUNT(DISTINCT r.course_code) as active_courses,
                COUNT(DISTINCT r.lecturer_name) as active_lecturers,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as avg_attendance_rate,
                (SELECT AVG(rating_value) FROM ratings) as avg_system_rating
            FROM reports r
        `);
        
        const recentReports = await dbAll(db, `
            SELECT r.*, u.name as lecturer_name 
            FROM reports r 
            LEFT JOIN users u ON r.lecturer_name = u.name 
            ORDER BY r.created_at DESC 
            LIMIT 5
        `);
        
        const courseStats = await dbAll(db, `
            SELECT 
                c.course_code,
                c.course_name,
                COUNT(r.id) as report_count,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as avg_attendance,
                (SELECT AVG(rating_value) FROM ratings rt WHERE rt.report_id IN (SELECT id FROM reports WHERE course_code = c.course_code)) as avg_rating
            FROM courses c
            LEFT JOIN reports r ON c.course_code = r.course_code
            GROUP BY c.course_code
            ORDER BY report_count DESC
        `);
        
        res.json({
            summary: monitoringData[0] || {},
            recentReports,
            courseStats
        });
    } catch (error) {
        console.error('Error fetching monitoring data:', error);
        res.status(500).json({ error: 'Failed to fetch monitoring data' });
    }
});

// PRL RATING: Get rating statistics
app.get('/api/prl/ratings', async (req, res) => {
    try {
        const ratingStats = await dbAll(db, `
            SELECT 
                r.course_code,
                c.course_name,
                COUNT(rt.id) as total_ratings,
                AVG(rt.rating_value) as average_rating,
                MIN(rt.rating_value) as min_rating,
                MAX(rt.rating_value) as max_rating,
                COUNT(DISTINCT rt.student_id) as unique_students
            FROM ratings rt
            JOIN reports r ON rt.report_id = r.id
            JOIN courses c ON r.course_code = c.course_code
            GROUP BY r.course_code
            ORDER BY average_rating DESC
        `);
        
        const recentRatings = await dbAll(db, `
            SELECT 
                rt.*,
                r.course_code,
                r.class_name,
                r.topic_taught,
                u.name as student_name
            FROM ratings rt
            JOIN reports r ON rt.report_id = r.id
            JOIN users u ON rt.student_id = u.id
            ORDER BY rt.created_at DESC
            LIMIT 10
        `);
        
        res.json({
            ratingStats,
            recentRatings
        });
    } catch (error) {
        console.error('Error fetching rating statistics:', error);
        res.status(500).json({ error: 'Failed to fetch rating statistics' });
    }
});

// PRL CLASSES: Get all classes under PRL supervision
app.get('/api/prl/classes', async (req, res) => {
    try {
        const classes = await dbAll(db, `
            SELECT 
                cls.*,
                c.course_name,
                u.name as lecturer_name,
                COUNT(r.id) as total_reports,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as avg_attendance
            FROM classes cls
            JOIN courses c ON cls.course_code = c.course_code
            LEFT JOIN users u ON cls.lecturer_id = u.id
            LEFT JOIN reports r ON cls.class_name = r.class_name AND cls.course_code = r.course_code
            GROUP BY cls.id
            ORDER BY cls.class_name
        `);
        res.json(classes);
    } catch (error) {
        console.error('Error fetching PRL classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
});

// PRL CLASSES: Get class details with reports
app.get('/api/prl/classes/:className', async (req, res) => {
    try {
        const { className } = req.params;
        
        const classDetails = await dbAll(db, `
            SELECT 
                cls.*,
                c.course_name,
                u.name as lecturer_name
            FROM classes cls
            JOIN courses c ON cls.course_code = c.course_code
            LEFT JOIN users u ON cls.lecturer_id = u.id
            WHERE cls.class_name = ?
        `, [className]);
        
        const classReports = await dbAll(db, `
            SELECT 
                r.*,
                u.name as lecturer_name,
                (SELECT AVG(rating_value) FROM ratings WHERE report_id = r.id) as avg_rating
            FROM reports r
            LEFT JOIN users u ON r.lecturer_name = u.name
            WHERE r.class_name = ?
            ORDER BY r.date_of_lecture DESC
        `, [className]);
        
        if (classDetails.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }
        
        res.json({
            classInfo: classDetails[0],
            reports: classReports
        });
    } catch (error) {
        console.error('Error fetching class details:', error);
        res.status(500).json({ error: 'Failed to fetch class details' });
    }
});

// ==================== PROGRAM LEADER (PL) ROUTES ====================

// PL Dashboard Overview
app.get('/api/pl/dashboard', async (req, res) => {
    try {
        const dashboardData = await dbAll(db, `
            SELECT 
                COUNT(DISTINCT r.id) as total_reports,
                COUNT(DISTINCT c.id) as total_courses,
                COUNT(DISTINCT u.id) as total_lecturers,
                COUNT(DISTINCT r.class_name) as total_classes,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as avg_attendance,
                (SELECT AVG(rating_value) FROM ratings) as avg_rating,
                COUNT(DISTINCT CASE WHEN r.status = 'submitted' THEN r.id END) as pending_reviews,
                COUNT(DISTINCT CASE WHEN r.status = 'reviewed' THEN r.id END) as reviewed_reports
            FROM reports r, courses c, users u
            WHERE u.role = 'lecturer'
        `);
        
        const recentActivity = await dbAll(db, `
            SELECT 
                r.*, 
                u.name as lecturer_name,
                (SELECT AVG(rating_value) FROM ratings WHERE report_id = r.id) as avg_rating
            FROM reports r
            LEFT JOIN users u ON r.lecturer_name = u.name
            ORDER BY r.created_at DESC
            LIMIT 6
        `);
        
        const programStats = await dbAll(db, `
            SELECT 
                'Web Development' as program,
                COUNT(r.id) as reports_count,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as attendance_rate,
                (SELECT AVG(rating_value) FROM ratings rt WHERE rt.report_id IN (
                    SELECT id FROM reports WHERE course_code LIKE 'DIWA%'
                )) as avg_rating
            FROM reports r
            WHERE r.course_code LIKE 'DIWA%'
            UNION ALL
            SELECT 
                'Database Systems' as program,
                COUNT(r.id) as reports_count,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as attendance_rate,
                (SELECT AVG(rating_value) FROM ratings rt WHERE rt.report_id IN (
                    SELECT id FROM reports WHERE course_code LIKE 'DBS%'
                )) as avg_rating
            FROM reports r
            WHERE r.course_code LIKE 'DBS%'
            UNION ALL
            SELECT 
                'Networking' as program,
                COUNT(r.id) as reports_count,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as attendance_rate,
                (SELECT AVG(rating_value) FROM ratings rt WHERE rt.report_id IN (
                    SELECT id FROM reports WHERE course_code LIKE 'NET%'
                )) as avg_rating
            FROM reports r
            WHERE r.course_code LIKE 'NET%'
        `);

        res.json({
            summary: dashboardData[0] || {},
            recentActivity,
            programStats
        });
    } catch (error) {
        console.error('Error fetching PL dashboard:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// PL COURSES: Add new course/module
app.post('/api/pl/courses', async (req, res) => {
    try {
        const { module_code, module_name, program, credits, semester, lecturer_id } = req.body;
        
        const result = await dbRun(db, 
            'INSERT INTO program_modules (module_code, module_name, program, credits, semester, lecturer_id) VALUES (?, ?, ?, ?, ?, ?)',
            [module_code, module_name, program, credits, semester, lecturer_id]
        );
        
        res.json({
            success: true,
            message: 'Course module added successfully!',
            moduleId: result.lastID
        });
    } catch (error) {
        console.error('Error adding course module:', error);
        res.status(500).json({ error: 'Failed to add course module' });
    }
});

// PL COURSES: Get all program modules
app.get('/api/pl/courses', async (req, res) => {
    try {
        const courses = await dbAll(db, `
            SELECT 
                pm.*,
                u.name as lecturer_name,
                COUNT(r.id) as total_lectures,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as avg_attendance,
                (SELECT AVG(rating_value) FROM ratings rt WHERE rt.report_id IN (
                    SELECT id FROM reports WHERE course_code = pm.module_code
                )) as avg_rating
            FROM program_modules pm
            LEFT JOIN users u ON pm.lecturer_id = u.id
            LEFT JOIN reports r ON pm.module_code = r.course_code
            GROUP BY pm.id
            ORDER BY pm.program, pm.semester
        `);
        res.json(courses);
    } catch (error) {
        console.error('Error fetching PL courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// PL COURSES: Assign lecturer to module
app.put('/api/pl/courses/:moduleId/assign', async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { lecturer_id } = req.body;
        
        const result = await dbRun(db, 
            'UPDATE program_modules SET lecturer_id = ? WHERE id = ?',
            [lecturer_id, moduleId]
        );
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Module not found' });
        }
        
        res.json({
            success: true,
            message: 'Lecturer assigned successfully!'
        });
    } catch (error) {
        console.error('Error assigning lecturer:', error);
        res.status(500).json({ error: 'Failed to assign lecturer' });
    }
});

// PL REPORTS: View all reports from PRL
app.get('/api/pl/reports', async (req, res) => {
    try {
        const reports = await dbAll(db, `
            SELECT 
                r.*,
                u.name as lecturer_name,
                r.prl_feedback,
                (SELECT AVG(rating_value) FROM ratings WHERE report_id = r.id) as avg_rating,
                (SELECT COUNT(*) FROM ratings WHERE report_id = r.id) as total_ratings
            FROM reports r
            LEFT JOIN users u ON r.lecturer_name = u.name
            WHERE r.prl_feedback IS NOT NULL
            ORDER BY r.created_at DESC
        `);
        res.json(reports);
    } catch (error) {
        console.error('Error fetching PL reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// PL MONITORING: Comprehensive monitoring data
app.get('/api/pl/monitoring', async (req, res) => {
    try {
        const programPerformance = await dbAll(db, `
            SELECT 
                pm.program,
                COUNT(DISTINCT pm.id) as total_modules,
                COUNT(DISTINCT r.id) as total_reports,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as avg_attendance,
                (SELECT AVG(rating_value) FROM ratings rt WHERE rt.report_id IN (
                    SELECT id FROM reports WHERE course_code IN (
                        SELECT module_code FROM program_modules WHERE program = pm.program
                    )
                )) as avg_rating,
                COUNT(DISTINCT u.id) as lecturers_count
            FROM program_modules pm
            LEFT JOIN reports r ON pm.module_code = r.course_code
            LEFT JOIN users u ON pm.lecturer_id = u.id
            GROUP BY pm.program
        `);
        
        const lecturerPerformance = await dbAll(db, `
            SELECT 
                u.name as lecturer_name,
                COUNT(DISTINCT pm.id) as modules_assigned,
                COUNT(DISTINCT r.id) as reports_submitted,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as avg_attendance,
                (SELECT AVG(rating_value) FROM ratings rt WHERE rt.report_id IN (
                    SELECT id FROM reports WHERE lecturer_name = u.name
                )) as avg_rating
            FROM users u
            LEFT JOIN program_modules pm ON u.id = pm.lecturer_id
            LEFT JOIN reports r ON u.name = r.lecturer_name
            WHERE u.role = 'lecturer'
            GROUP BY u.id
            ORDER BY reports_submitted DESC
        `);
        
        const weeklyProgress = await dbAll(db, `
            SELECT 
                week_of_reporting,
                COUNT(*) as reports_count,
                AVG(actual_students_present * 100.0 / total_registered_students) as avg_attendance
            FROM reports
            GROUP BY week_of_reporting
            ORDER BY week_of_reporting
        `);

        res.json({
            programPerformance,
            lecturerPerformance,
            weeklyProgress
        });
    } catch (error) {
        console.error('Error fetching PL monitoring data:', error);
        res.status(500).json({ error: 'Failed to fetch monitoring data' });
    }
});

// PL CLASSES: Manage classes
app.get('/api/pl/classes', async (req, res) => {
    try {
        const classes = await dbAll(db, `
            SELECT 
                cls.*,
                c.course_name,
                u.name as lecturer_name,
                pm.program,
                COUNT(r.id) as total_reports,
                AVG(r.actual_students_present * 100.0 / r.total_registered_students) as avg_attendance
            FROM classes cls
            JOIN courses c ON cls.course_code = c.course_code
            LEFT JOIN program_modules pm ON c.course_code = pm.module_code
            LEFT JOIN users u ON cls.lecturer_id = u.id
            LEFT JOIN reports r ON cls.class_name = r.class_name AND cls.course_code = r.course_code
            GROUP BY cls.id
            ORDER BY pm.program, cls.class_name
        `);
        res.json(classes);
    } catch (error) {
        console.error('Error fetching PL classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
});

// PL LECTURES: View all lectures across programs
app.get('/api/pl/lectures', async (req, res) => {
    try {
        const lectures = await dbAll(db, `
            SELECT 
                r.*,
                u.name as lecturer_name,
                pm.program,
                (SELECT AVG(rating_value) FROM ratings WHERE report_id = r.id) as avg_rating,
                (SELECT COUNT(*) FROM ratings WHERE report_id = r.id) as total_ratings
            FROM reports r
            LEFT JOIN users u ON r.lecturer_name = u.name
            LEFT JOIN program_modules pm ON r.course_code = pm.module_code
            ORDER BY r.date_of_lecture DESC
        `);
        res.json(lectures);
    } catch (error) {
        console.error('Error fetching PL lectures:', error);
        res.status(500).json({ error: 'Failed to fetch lectures' });
    }
});

// PL RATING: Program-wide rating analytics
app.get('/api/pl/ratings', async (req, res) => {
    try {
        const programRatings = await dbAll(db, `
            SELECT 
                pm.program,
                COUNT(rt.id) as total_ratings,
                AVG(rt.rating_value) as average_rating,
                MIN(rt.rating_value) as min_rating,
                MAX(rt.rating_value) as max_rating,
                COUNT(DISTINCT rt.student_id) as unique_students,
                COUNT(DISTINCT r.course_code) as rated_courses
            FROM ratings rt
            JOIN reports r ON rt.report_id = r.id
            LEFT JOIN program_modules pm ON r.course_code = pm.module_code
            GROUP BY pm.program
            ORDER BY average_rating DESC
        `);
        
        const ratingDistribution = await dbAll(db, `
            SELECT 
                rating_value,
                COUNT(*) as count,
                (SELECT name FROM users u WHERE u.id = rt.student_id LIMIT 1) as sample_student,
                (SELECT course_code FROM reports r WHERE r.id = rt.report_id LIMIT 1) as sample_course
            FROM ratings rt
            GROUP BY rating_value
            ORDER BY rating_value DESC
        `);

        res.json({
            programRatings,
            ratingDistribution
        });
    } catch (error) {
        console.error('Error fetching PL rating analytics:', error);
        res.status(500).json({ error: 'Failed to fetch rating analytics' });
    }
});

// PL: Get all lecturers for assignment
app.get('/api/pl/lecturers', async (req, res) => {
    try {
        const lecturers = await dbAll(db, `
            SELECT id, name, email 
            FROM users 
            WHERE role = 'lecturer'
            ORDER BY name
        `);
        res.json(lecturers);
    } catch (error) {
        console.error('Error fetching lecturers:', error);
        res.status(500).json({ error: 'Failed to fetch lecturers' });
    }
});

// ==================== UTILITY ROUTES ====================

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend API is working!',
        timestamp: new Date().toISOString()
    });
});

// Health check route
app.get('/api/health', async (req, res) => {
    try {
        await dbGet(db, 'SELECT 1 as test');
        res.json({ 
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message 
        });
    }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
    try {
        const users = await dbAll(db, 'SELECT id, email, name, role FROM users');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Test database tables
app.get('/api/debug/tables', async (req, res) => {
    try {
        const tables = await dbAll(db, `SELECT name FROM sqlite_master WHERE type='table'`);
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ error: 'Failed to fetch tables' });
    }
});

// Initialize and start server
let db;
const startServer = async () => {
    try {
        db = await initializeDatabase();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Database file: ${dbPath}`);
            console.log(`🔗 API Test: http://localhost:${PORT}/api/test`);
            console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
            console.log(`🐛 Debug Tables: http://localhost:${PORT}/api/debug/tables`);
            console.log(`👥 Users: http://localhost:${PORT}/api/users`);
            console.log(`📋 PRL APIs: http://localhost:${PORT}/api/prl/reports`);
            console.log(`🎓 PL APIs: http://localhost:${PORT}/api/pl/dashboard`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();