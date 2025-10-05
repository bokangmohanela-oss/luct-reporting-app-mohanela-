const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');

// GET all courses for dropdown
router.get('/courses', async (req, res) => {
    try {
        const db = getDb();
        const courses = await db.all('SELECT * FROM courses');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new report
router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const {
            facultyName,
            className,
            weekOfReporting,
            dateOfLecture,
            courseName,
            courseCode,
            lecturerName,
            actualStudentsPresent,
            totalRegisteredStudents,
            venue,
            scheduledTime,
            topicTaught,
            learningOutcomes,
            recommendations
        } = req.body;

        const result = await db.run(
            `INSERT INTO reports (
                faculty_name, class_name, week_of_reporting, date_of_lecture,
                course_name, course_code, lecturer_name, actual_students_present,
                total_registered_students, venue, scheduled_time, topic_taught,
                learning_outcomes, recommendations, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                facultyName, className, weekOfReporting, dateOfLecture,
                courseName, courseCode, lecturerName, actualStudentsPresent,
                totalRegisteredStudents, venue, scheduledTime, topicTaught,
                learningOutcomes, recommendations, 'submitted'
            ]
        );

        res.json({
            message: 'Report submitted successfully!',
            reportId: result.lastID
        });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// GET all reports for a lecturer
router.get('/lecturer/:lecturerName', async (req, res) => {
    try {
        const db = getDb();
        const { lecturerName } = req.params;
        
        const reports = await db.all(
            'SELECT * FROM reports WHERE lecturer_name = ? ORDER BY created_at DESC',
            [lecturerName]
        );
        
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;