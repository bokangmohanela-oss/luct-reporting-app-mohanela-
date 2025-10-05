import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRLCourses = () => {
    const [coursesData, setCoursesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // grid, list, detailed
    const [filter, setFilter] = useState('all'); // all, active, high-performance, needs-attention
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCoursesData();
    }, []);

    const fetchCoursesData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('http://localhost:5000/api/prl/courses');
            setCoursesData(response.data);
        } catch (error) {
            console.error('Error fetching courses data:', error);
            setError('Failed to load courses data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseDetails = async (courseCode) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/prl/courses/${courseCode}/lectures`);
            setSelectedCourse({
                ...coursesData.find(course => course.course_code === courseCode),
                lectures: response.data
            });
        } catch (error) {
            console.error('Error fetching course details:', error);
            setError('Failed to load course details.');
        }
    };

    const getPerformanceStatus = (course) => {
        const attendance = course.avg_attendance || 0;
        const rating = course.avg_rating || 0;
        
        if (attendance >= 80 && rating >= 4) return { status: 'excellent', color: 'success', label: 'Excellent' };
        if (attendance >= 70 && rating >= 3) return { status: 'good', color: 'info', label: 'Good' };
        if (attendance >= 60) return { status: 'fair', color: 'warning', label: 'Fair' };
        return { status: 'needs-attention', color: 'danger', label: 'Needs Attention' };
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'warning';
        return 'danger';
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'success';
        if (rating >= 3) return 'warning';
        return 'danger';
    };

    // Filter courses based on search and filter criteria
    const filteredCourses = coursesData ? coursesData.filter(course => {
        const matchesSearch = course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.course_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const performance = getPerformanceStatus(course);
        
        switch (filter) {
            case 'active':
                return matchesSearch && (course.total_reports > 0);
            case 'high-performance':
                return matchesSearch && performance.status === 'excellent';
            case 'needs-attention':
                return matchesSearch && performance.status === 'needs-attention';
            default:
                return matchesSearch;
        }
    }) : [];

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading courses data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchCoursesData}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">📚 Courses Management</h2>
                            <p className="text-muted mb-0">Overview of all courses under your supervision</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-outline-warning btn-sm"
                                onClick={fetchCoursesData}
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="d-flex gap-2 flex-wrap">
                        {/* Search Box */}
                        <div className="flex-grow-1">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">🔍</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search courses by code or name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="btn-group btn-group-sm">
                            <button
                                className={`btn ${filter === 'all' ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => setFilter('all')}
                            >
                                All Courses
                            </button>
                            <button
                                className={`btn ${filter === 'active' ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => setFilter('active')}
                            >
                                Active
                            </button>
                            <button
                                className={`btn ${filter === 'high-performance' ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => setFilter('high-performance')}
                            >
                                High Performance
                            </button>
                            <button
                                className={`btn ${filter === 'needs-attention' ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => setFilter('needs-attention')}
                            >
                                Needs Attention
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="btn-group btn-group-sm">
                            <button
                                className={`btn ${viewMode === 'grid' ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => setViewMode('grid')}
                            >
                                🏠 Grid
                            </button>
                            <button
                                className={`btn ${viewMode === 'list' ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => setViewMode('list')}
                            >
                                📋 List
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 text-md-end">
                    <small className="text-muted">
                        Showing {filteredCourses.length} of {coursesData?.length || 0} courses
                    </small>
                </div>
            </div>

            {/* Courses Grid/List View */}
            {viewMode === 'grid' ? (
                <div className="row">
                    {filteredCourses.map(course => {
                        const performance = getPerformanceStatus(course);
                        return (
                            <div key={course.course_code} className="col-xl-4 col-lg-6 mb-4">
                                <div className={`card h-100 border-${performance.color} course-card`}>
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0 text-truncate">{course.course_code}</h6>
                                        <span className={`badge bg-${performance.color}`}>
                                            {performance.label}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <h6 className="card-title text-primary">{course.course_name}</h6>
                                        
                                        {/* Main Lecturer */}
                                        {course.main_lecturer && (
                                            <p className="small text-muted mb-2">
                                                <strong>Lecturer:</strong> {course.main_lecturer}
                                            </p>
                                        )}

                                        {/* Statistics */}
                                        <div className="row text-center mb-3">
                                            <div className="col-4">
                                                <div className="border rounded p-2">
                                                    <div className="text-primary fw-bold">{course.total_reports || 0}</div>
                                                    <small className="text-muted">Reports</small>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="border rounded p-2">
                                                    <div className="text-success fw-bold">{course.total_classes || 0}</div>
                                                    <small className="text-muted">Classes</small>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="border rounded p-2">
                                                    <div className="text-info fw-bold">
                                                        {course.avg_rating ? course.avg_rating.toFixed(1) : 'N/A'}
                                                    </div>
                                                    <small className="text-muted">Rating</small>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bars */}
                                        <div className="mb-2">
                                            <small className="text-muted">Attendance Rate</small>
                                            <div className="progress" style={{height: '6px'}}>
                                                <div 
                                                    className={`progress-bar bg-${getAttendanceColor(course.avg_attendance || 0)}`}
                                                    style={{width: `${course.avg_attendance || 0}%`}}
                                                ></div>
                                            </div>
                                            <small className="float-end">{Math.round(course.avg_attendance || 0)}%</small>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-grid gap-2 mt-3">
                                            <button 
                                                className="btn btn-outline-warning btn-sm"
                                                onClick={() => fetchCourseDetails(course.course_code)}
                                            >
                                                📊 View Lectures
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* List View */
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Lecturer</th>
                                        <th>Reports</th>
                                        <th>Classes</th>
                                        <th>Attendance</th>
                                        <th>Rating</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map(course => {
                                        const performance = getPerformanceStatus(course);
                                        return (
                                            <tr key={course.course_code}>
                                                <td>
                                                    <strong>{course.course_code}</strong>
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{maxWidth: '200px'}}>
                                                        {course.course_name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <small>{course.main_lecturer || 'Not assigned'}</small>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary">{course.total_reports || 0}</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary">{course.total_classes || 0}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="progress flex-grow-1 me-2" style={{height: '6px', width: '80px'}}>
                                                            <div 
                                                                className={`progress-bar bg-${getAttendanceColor(course.avg_attendance || 0)}`}
                                                                style={{width: `${course.avg_attendance || 0}%`}}
                                                            ></div>
                                                        </div>
                                                        <small>{Math.round(course.avg_attendance || 0)}%</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${getRatingColor(course.avg_rating || 0)}`}>
                                                        {course.avg_rating ? course.avg_rating.toFixed(1) : 'N/A'} ⭐
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${performance.color}`}>
                                                        {performance.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn btn-outline-warning btn-sm"
                                                        onClick={() => fetchCourseDetails(course.course_code)}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted mb-3">
                        <i className="fas fa-book fa-3x"></i>
                    </div>
                    <h5>No courses found</h5>
                    <p className="text-muted">
                        {searchTerm ? 'Try adjusting your search terms' : 'No courses match the selected filter'}
                    </p>
                    {(searchTerm || filter !== 'all') && (
                        <button 
                            className="btn btn-warning"
                            onClick={() => {
                                setSearchTerm('');
                                setFilter('all');
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {/* Course Details Modal */}
            {selectedCourse && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    📚 {selectedCourse.course_code} - {selectedCourse.course_name}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setSelectedCourse(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Course Overview */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <h6>Course Information</h6>
                                        <table className="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Course Code:</strong></td>
                                                    <td>{selectedCourse.course_code}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Course Name:</strong></td>
                                                    <td>{selectedCourse.course_name}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Main Lecturer:</strong></td>
                                                    <td>{selectedCourse.main_lecturer || 'Not assigned'}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Total Reports:</strong></td>
                                                    <td>{selectedCourse.total_reports || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Total Classes:</strong></td>
                                                    <td>{selectedCourse.total_classes || 0}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Performance Metrics</h6>
                                        <div className="row text-center">
                                            <div className="col-6 mb-3">
                                                <div className="border rounded p-3">
                                                    <div className={`h4 text-${getAttendanceColor(selectedCourse.avg_attendance || 0)}`}>
                                                        {Math.round(selectedCourse.avg_attendance || 0)}%
                                                    </div>
                                                    <small className="text-muted">Avg Attendance</small>
                                                </div>
                                            </div>
                                            <div className="col-6 mb-3">
                                                <div className="border rounded p-3">
                                                    <div className={`h4 text-${getRatingColor(selectedCourse.avg_rating || 0)}`}>
                                                        {selectedCourse.avg_rating ? selectedCourse.avg_rating.toFixed(1) : 'N/A'}
                                                    </div>
                                                    <small className="text-muted">Avg Rating</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lectures Table */}
                                <h6>Recent Lectures</h6>
                                {selectedCourse.lectures && selectedCourse.lectures.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Week</th>
                                                    <th>Date</th>
                                                    <th>Class</th>
                                                    <th>Lecturer</th>
                                                    <th>Attendance</th>
                                                    <th>Rating</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedCourse.lectures.slice(0, 10).map(lecture => (
                                                    <tr key={lecture.id}>
                                                        <td>Week {lecture.week_of_reporting}</td>
                                                        <td>{new Date(lecture.date_of_lecture).toLocaleDateString()}</td>
                                                        <td>{lecture.class_name}</td>
                                                        <td>{lecture.lecturer_name}</td>
                                                        <td>
                                                            {lecture.actual_students_present}/{lecture.total_registered_students}
                                                        </td>
                                                        <td>
                                                            {lecture.avg_rating ? (
                                                                <span className={`badge bg-${getRatingColor(lecture.avg_rating)}`}>
                                                                    {lecture.avg_rating.toFixed(1)} ⭐
                                                                </span>
                                                            ) : 'No ratings'}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${
                                                                lecture.status === 'submitted' ? 'bg-warning' : 
                                                                lecture.status === 'reviewed' ? 'bg-success' : 'bg-secondary'
                                                            }`}>
                                                                {lecture.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-3">
                                        <p className="text-muted">No lectures available for this course.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedCourse(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PRLCourses;