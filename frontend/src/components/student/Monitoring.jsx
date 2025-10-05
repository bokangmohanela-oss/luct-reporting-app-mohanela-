import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentMonitoring = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
        fetchCourses();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students/reports');
            setReports(response.data);
            setFilteredReports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reports/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCourseFilter = (courseCode) => {
        setSelectedCourse(courseCode);
        if (courseCode === 'all') {
            setFilteredReports(reports);
        } else {
            const filtered = reports.filter(report => report.course_code === courseCode);
            setFilteredReports(filtered);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">📊 Lecture Reports Monitoring</h3>
                        </div>
                        <div className="card-body">
                            {/* Course Filter */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Filter by Course:</label>
                                    <select 
                                        className="form-select"
                                        value={selectedCourse}
                                        onChange={(e) => handleCourseFilter(e.target.value)}
                                    >
                                        <option value="all">All Courses</option>
                                        {courses.map(course => (
                                            <option key={course.course_code} value={course.course_code}>
                                                {course.course_code} - {course.course_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 d-flex align-items-end">
                                    <p className="mb-0 text-muted">
                                        Showing {filteredReports.length} of {reports.length} reports
                                    </p>
                                </div>
                            </div>

                            {/* Reports List */}
                            <div className="row">
                                {filteredReports.map(report => (
                                    <div key={report.id} className="col-md-6 mb-3">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <h5 className="card-title mb-0">
                                                    {report.course_code} - {report.class_name}
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                <p className="card-text">
                                                    <strong>Lecturer:</strong> {report.lecturer_name || 'Dr. John Smith'}<br/>
                                                    <strong>Week:</strong> {report.week_of_reporting}<br/>
                                                    <strong>Date:</strong> {new Date(report.date_of_lecture).toLocaleDateString()}<br/>
                                                    <strong>Students Present:</strong> {report.actual_students_present}/{report.total_registered_students}<br/>
                                                    <strong>Venue:</strong> {report.venue}<br/>
                                                    <strong>Topic:</strong> {report.topic_taught}
                                                </p>
                                                <div className="mt-2">
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            const details = document.getElementById(`details-${report.id}`);
                                                            details.classList.toggle('d-none');
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                                <div id={`details-${report.id}`} className="d-none mt-2">
                                                    <p><strong>Learning Outcomes:</strong> {report.learning_outcomes}</p>
                                                    <p><strong>Recommendations:</strong> {report.recommendations}</p>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <small className="text-muted">
                                                    Submitted: {new Date(report.created_at).toLocaleString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredReports.length === 0 && (
                                <div className="text-center py-4">
                                    <p className="text-muted">No reports found for the selected filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentMonitoring;