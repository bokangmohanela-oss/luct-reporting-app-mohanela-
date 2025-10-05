import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportForm = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        facultyName: 'Faculty of Information Communication Technology',
        className: '',
        weekOfReporting: '',
        dateOfLecture: '',
        courseCode: '',
        courseName: '',
        lecturerName: '',
        actualStudentsPresent: '',
        totalRegisteredStudents: '',
        venue: '',
        scheduledTime: '',
        topicTaught: '',
        learningOutcomes: '',
        recommendations: ''
    });

    const [message, setMessage] = useState('');

    // Fetch courses for dropdown
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reports/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    // Handle course selection
    const handleCourseChange = (e) => {
        const selectedCourseCode = e.target.value;
        const selectedCourse = courses.find(course => course.course_code === selectedCourseCode);
        
        setFormData({
            ...formData,
            courseCode: selectedCourseCode,
            courseName: selectedCourse ? selectedCourse.course_name : ''
        });
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        try {
            // Add lecturer name (you can get this from authentication later)
            const dataToSubmit = {
                ...formData,
                lecturerName: 'Dr. John Smith' // Temporary - will be dynamic later
            };

            const response = await axios.post('http://localhost:5000/api/reports', dataToSubmit);
            setMessage('✅ Report submitted successfully!');
            
            // Reset form
            setFormData({
                facultyName: 'Faculty of Information Communication Technology',
                className: '',
                weekOfReporting: '',
                dateOfLecture: '',
                courseCode: '',
                courseName: '',
                lecturerName: '',
                actualStudentsPresent: '',
                totalRegisteredStudents: '',
                venue: '',
                scheduledTime: '',
                topicTaught: '',
                learningOutcomes: '',
                recommendations: ''
            });
        } catch (error) {
            console.error('Error submitting report:', error);
            setMessage('❌ Error submitting report. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Lecturer Reporting Form</h3>
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Faculty Name */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Faculty Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="facultyName"
                                            value={formData.facultyName}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </div>

                                    {/* Class Name */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Class Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="className"
                                            value={formData.className}
                                            onChange={handleChange}
                                            placeholder="e.g., IT2A, BIT1B"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Week of Reporting */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Week of Reporting *</label>
                                        <select
                                            className="form-control"
                                            name="weekOfReporting"
                                            value={formData.weekOfReporting}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Week</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(week => (
                                                <option key={week} value={week}>Week {week}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date of Lecture */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Date of Lecture *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="dateOfLecture"
                                            value={formData.dateOfLecture}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Course Selection */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Course *</label>
                                        <select
                                            className="form-control"
                                            name="courseCode"
                                            value={formData.courseCode}
                                            onChange={handleCourseChange}
                                            required
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(course => (
                                                <option key={course.course_code} value={course.course_code}>
                                                    {course.course_code} - {course.course_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Course Name (auto-filled) */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Course Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.courseName}
                                            readOnly
                                            style={{backgroundColor: '#f8f9fa'}}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Students Present */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Actual Students Present *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="actualStudentsPresent"
                                            value={formData.actualStudentsPresent}
                                            onChange={handleChange}
                                            min="1"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    {/* Total Registered Students */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Total Registered Students *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="totalRegisteredStudents"
                                            value={formData.totalRegisteredStudents}
                                            onChange={handleChange}
                                            min="1"
                                            max="100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Venue */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Venue *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="venue"
                                            value={formData.venue}
                                            onChange={handleChange}
                                            placeholder="e.g., Lab 301, Room 205"
                                            required
                                        />
                                    </div>

                                    {/* Scheduled Time */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Scheduled Time *</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="scheduledTime"
                                            value={formData.scheduledTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Topic Taught */}
                                <div className="mb-3">
                                    <label className="form-label">Topic Taught *</label>
                                    <textarea
                                        className="form-control"
                                        name="topicTaught"
                                        value={formData.topicTaught}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Describe the topic covered in this lecture..."
                                        required
                                    ></textarea>
                                </div>

                                {/* Learning Outcomes */}
                                <div className="mb-3">
                                    <label className="form-label">Learning Outcomes *</label>
                                    <textarea
                                        className="form-control"
                                        name="learningOutcomes"
                                        value={formData.learningOutcomes}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="What were the key learning objectives achieved?"
                                        required
                                    ></textarea>
                                </div>

                                {/* Recommendations */}
                                <div className="mb-3">
                                    <label className="form-label">Lecturer's Recommendations *</label>
                                    <textarea
                                        className="form-control"
                                        name="recommendations"
                                        value={formData.recommendations}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Any recommendations for improvement or follow-up actions..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg">
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportForm;