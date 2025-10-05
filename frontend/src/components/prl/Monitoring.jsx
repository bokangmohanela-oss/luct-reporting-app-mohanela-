import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRLMonitoring = () => {
    const [monitoringData, setMonitoringData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('week'); // week, month, semester
    const [selectedCourse, setSelectedCourse] = useState('all');

    useEffect(() => {
        fetchMonitoringData();
    }, [timeRange]);

    const fetchMonitoringData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`http://localhost:5000/api/prl/monitoring?range=${timeRange}`);
            setMonitoringData(response.data);
        } catch (error) {
            console.error('Error fetching monitoring data:', error);
            setError('Failed to load monitoring data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getAttendancePercentage = (present, total) => {
        return total > 0 ? Math.round((present / total) * 100) : 0;
    };

    const getStatusColor = (percentage) => {
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'warning';
        return 'danger';
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'success';
        if (rating >= 3) return 'warning';
        return 'danger';
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading monitoring dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchMonitoringData}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { summary, recentReports, courseStats, lecturerPerformance, weeklyTrends } = monitoringData;

    // Filter course stats if a specific course is selected
    const filteredCourseStats = selectedCourse === 'all' 
        ? courseStats 
        : courseStats.filter(course => course.course_code === selectedCourse);

    return (
        <div className="container mt-4">
            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">📊 Monitoring Dashboard</h2>
                            <p className="text-muted mb-0">Real-time overview of academic performance and attendance</p>
                        </div>
                        <div className="d-flex gap-2">
                            <select 
                                className="form-select form-select-sm"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="semester">This Semester</option>
                            </select>
                            <button 
                                className="btn btn-outline-warning btn-sm"
                                onClick={fetchMonitoringData}
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-3">
                    <div className="card border-primary">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title text-primary">Total Reports</h6>
                                    <h2 className="text-primary">{summary.total_reports || 0}</h2>
                                </div>
                                <div className="align-self-center">
                                    <span className="text-primary fs-1">📋</span>
                                </div>
                            </div>
                            <small className="text-muted">
                                {summary.pending_reviews || 0} pending review
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                    <div className="card border-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title text-warning">Active Courses</h6>
                                    <h2 className="text-warning">{summary.active_courses || 0}</h2>
                                </div>
                                <div className="align-self-center">
                                    <span className="text-warning fs-1">📚</span>
                                </div>
                            </div>
                            <small className="text-muted">
                                Across all programs
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                    <div className="card border-success">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title text-success">Avg Attendance</h6>
                                    <h2 className="text-success">
                                        {summary.avg_attendance_rate ? Math.round(summary.avg_attendance_rate) : 0}%
                                    </h2>
                                </div>
                                <div className="align-self-center">
                                    <span className="text-success fs-1">👥</span>
                                </div>
                            </div>
                            <small className="text-muted">
                                Overall attendance rate
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                    <div className="card border-info">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title text-info">Avg Rating</h6>
                                    <h2 className="text-info">
                                        {summary.avg_system_rating ? summary.avg_system_rating.toFixed(1) : '0.0'}/5
                                    </h2>
                                </div>
                                <div className="align-self-center">
                                    <span className="text-info fs-1">⭐</span>
                                </div>
                            </div>
                            <small className="text-muted">
                                Student satisfaction
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Performance Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">📈 Course Performance</h5>
                            <select 
                                className="form-select form-select-sm w-auto"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="all">All Courses</option>
                                {courseStats.map(course => (
                                    <option key={course.course_code} value={course.course_code}>
                                        {course.course_code}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Course</th>
                                            <th>Reports</th>
                                            <th>Attendance Rate</th>
                                            <th>Avg Rating</th>
                                            <th>Performance</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCourseStats.map(course => (
                                            <tr key={course.course_code}>
                                                <td>
                                                    <div>
                                                        <strong>{course.course_code}</strong>
                                                        <br />
                                                        <small className="text-muted">{course.course_name}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary">{course.report_count}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="progress flex-grow-1 me-2" style={{height: '8px'}}>
                                                            <div 
                                                                className={`progress-bar bg-${getStatusColor(course.avg_attendance || 0)}`}
                                                                style={{width: `${course.avg_attendance || 0}%`}}
                                                            ></div>
                                                        </div>
                                                        <span>{Math.round(course.avg_attendance || 0)}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${getRatingColor(course.avg_rating || 0)}`}>
                                                        {course.avg_rating ? course.avg_rating.toFixed(1) : 'N/A'} ⭐
                                                    </span>
                                                </td>
                                                <td>
                                                    {(() => {
                                                        const attendance = course.avg_attendance || 0;
                                                        const rating = course.avg_rating || 0;
                                                        if (attendance >= 80 && rating >= 4) return 'Excellent';
                                                        if (attendance >= 70 && rating >= 3) return 'Good';
                                                        if (attendance >= 60) return 'Fair';
                                                        return 'Needs Attention';
                                                    })()}
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        (course.avg_attendance || 0) >= 70 ? 'bg-success' : 'bg-warning'
                                                    }`}>
                                                        {(course.avg_attendance || 0) >= 70 ? 'On Track' : 'Review Needed'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredCourseStats.length === 0 && (
                                <div className="text-center py-4">
                                    <p className="text-muted">No course data available for the selected filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Reports & Lecturer Performance */}
            <div className="row">
                {/* Recent Reports */}
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">🕒 Recent Reports</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group list-group-flush">
                                {recentReports.slice(0, 6).map(report => (
                                    <div key={report.id} className="list-group-item px-0">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{report.course_code} - {report.class_name}</h6>
                                                <p className="mb-1 small text-muted">
                                                    by {report.lecturer_name} • Week {report.week_of_reporting}
                                                </p>
                                                <div className="d-flex gap-2 mt-1">
                                                    <small className="text-muted">
                                                        👥 {report.actual_students_present}/{report.total_registered_students}
                                                    </small>
                                                    <small className="text-muted">
                                                        📍 {report.venue}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <span className={`badge ${
                                                    report.status === 'submitted' ? 'bg-warning' : 
                                                    report.status === 'reviewed' ? 'bg-success' : 'bg-secondary'
                                                }`}>
                                                    {report.status}
                                                </span>
                                                <br />
                                                <small className="text-muted">
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {recentReports.length === 0 && (
                                <div className="text-center py-4">
                                    <p className="text-muted">No recent reports available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lecturer Performance */}
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">👨‍🏫 Lecturer Performance</h5>
                        </div>
                        <div className="card-body">
                            {lecturerPerformance && lecturerPerformance.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {lecturerPerformance.slice(0, 5).map(lecturer => (
                                        <div key={lecturer.lecturer_id} className="list-group-item px-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{lecturer.lecturer_name}</h6>
                                                    <small className="text-muted">
                                                        {lecturer.courses_taught} courses • {lecturer.total_reports} reports
                                                    </small>
                                                </div>
                                                <div className="text-end">
                                                    <span className={`badge bg-${getRatingColor(lecturer.avg_rating || 0)}`}>
                                                        {lecturer.avg_rating ? lecturer.avg_rating.toFixed(1) : 'N/A'} ⭐
                                                    </span>
                                                    <br />
                                                    <small className="text-muted">
                                                        {Math.round(lecturer.avg_attendance || 0)}% attendance
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No lecturer performance data available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Trends (if available) */}
            {weeklyTrends && weeklyTrends.length > 0 && (
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header bg-info text-white">
                                <h5 className="mb-0">📅 Weekly Trends</h5>
                            </div>
                            <div className="card-body">
                                <div className="row text-center">
                                    {weeklyTrends.map(week => (
                                        <div key={week.week_number} className="col">
                                            <div className="border rounded p-2">
                                                <small className="text-muted">Week {week.week_number}</small>
                                                <div className="mt-1">
                                                    <strong>{week.report_count}</strong>
                                                </div>
                                                <small className="text-muted">reports</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PRLMonitoring;