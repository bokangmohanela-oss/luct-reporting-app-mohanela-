import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PLDashboardMain = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [apiResponse, setApiResponse] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Fetching PL dashboard data...');
            
            const response = await axios.get('http://localhost:5000/api/pl/dashboard');
            console.log('✅ API Response:', response.data);
            setApiResponse(response.data);
            
            if (response.data) {
                setDashboardData(response.data);
            } else {
                setError('No data received from server');
            }
        } catch (error) {
            console.error('❌ API Error:', error);
            console.error('Error details:', error.response?.data || error.message);
            setError(`Failed to load dashboard data: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Show API response for debugging
    if (apiResponse) {
        console.log('📊 Dashboard Data Structure:', apiResponse);
    }

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading program dashboard...</p>
                    <p className="text-muted small">Fetching data from: http://localhost:5000/api/pl/dashboard</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <h5>❌ Error Loading Dashboard</h5>
                    <p>{error}</p>
                    <div className="mt-3">
                        <h6>Troubleshooting Steps:</h6>
                        <ol className="small">
                            <li>Check if backend server is running on port 5000</li>
                            <li>Verify the API endpoint: http://localhost:5000/api/pl/dashboard</li>
                            <li>Check browser console for CORS errors</li>
                            <li>Ensure database is properly initialized</li>
                        </ol>
                    </div>
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchDashboardData}>
                        🔄 Retry
                    </button>
                    <button 
                        className="btn btn-sm btn-outline-info ms-2" 
                        onClick={() => window.open('http://localhost:5000/api/pl/dashboard', '_blank')}
                    >
                        🔗 Test API Directly
                    </button>
                </div>

                {/* Show sample data for testing */}
                <div className="alert alert-warning mt-3">
                    <h6>Using Sample Data for Testing</h6>
                    <p className="mb-2">The dashboard will show sample data for demonstration.</p>
                    <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                            setDashboardData({
                                summary: {
                                    total_reports: 15,
                                    total_courses: 4,
                                    total_lecturers: 3,
                                    total_classes: 4,
                                    avg_attendance: 78,
                                    avg_rating: 4.2,
                                    pending_reviews: 2,
                                    reviewed_reports: 13
                                },
                                recentActivity: [
                                    {
                                        id: 1,
                                        course_code: 'DIWA2110',
                                        lecturer_name: 'Dr. John Smith',
                                        week_of_reporting: 5,
                                        status: 'reviewed',
                                        created_at: new Date().toISOString()
                                    },
                                    {
                                        id: 2,
                                        course_code: 'DBS2110',
                                        lecturer_name: 'Prof. Mary Johnson',
                                        week_of_reporting: 5,
                                        status: 'submitted',
                                        created_at: new Date().toISOString()
                                    }
                                ],
                                programStats: [
                                    {
                                        program: 'Web Development',
                                        reports_count: 8,
                                        attendance_rate: 82,
                                        avg_rating: 4.3
                                    },
                                    {
                                        program: 'Database Systems',
                                        reports_count: 5,
                                        attendance_rate: 75,
                                        avg_rating: 4.1
                                    },
                                    {
                                        program: 'Networking',
                                        reports_count: 2,
                                        attendance_rate: 70,
                                        avg_rating: 3.9
                                    }
                                ]
                            });
                            setError('');
                        }}
                    >
                        Load Sample Data
                    </button>
                </div>
            </div>
        );
    }

    const { summary, recentActivity, programStats } = dashboardData || {};

    // Use sample data if no real data
    const displaySummary = summary || {
        total_reports: 0,
        total_courses: 0,
        total_lecturers: 0,
        total_classes: 0,
        avg_attendance: 0,
        avg_rating: 0,
        pending_reviews: 0,
        reviewed_reports: 0
    };

    const displayRecentActivity = recentActivity || [];
    const displayProgramStats = programStats || [];

    return (
        <div className="container mt-4">
            {/* Debug Header */}
            {apiResponse && (
                <div className="alert alert-info alert-dismissible fade show" role="alert">
                    <strong>🔧 Debug Mode:</strong> API is responding correctly.
                    <button type="button" className="btn-close" onClick={() => setApiResponse(null)}></button>
                </div>
            )}

            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">📊 Program Leader Dashboard</h2>
                            <p className="text-muted mb-0">Overview of all academic programs and performance</p>
                            {!summary && (
                                <small className="text-warning">⚠️ Using demonstration data</small>
                            )}
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={fetchDashboardData}
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
                                    <h2 className="text-primary">{displaySummary.total_reports}</h2>
                                </div>
                                <div className="align-self-center">
                                    <span className="text-primary fs-1">📋</span>
                                </div>
                            </div>
                            <small className="text-muted">
                                {displaySummary.pending_reviews} pending review
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                    <div className="card border-info">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title text-info">Program Modules</h6>
                                    <h2 className="text-info">{displaySummary.total_courses}</h2>
                                </div>
                                <div className="align-self-center">
                                    <span className="text-info fs-1">📚</span>
                                </div>
                            </div>
                            <small className="text-muted">
                                Active across all programs
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
                                        {Math.round(displaySummary.avg_attendance)}%
                                    </h2>
                                </div>
                                <div className="align-self-center">
                                    <span className="text-success fs-1">👥</span>
                                </div>
                            </div>
                            <small className="text-muted">
                                Overall program rate
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-3">
                    <div className="card border-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title text-warning">Avg Rating</h6>
                                    <h2 className="text-warning">
                                        {displaySummary.avg_rating ? displaySummary.avg_rating.toFixed(1) : '0.0'}/5
                                    </h2>
                                </div>
                                <div className="align-self-center">
                                    <span className="text-warning fs-1">⭐</span>
                                </div>
                            </div>
                            <small className="text-muted">
                                Student satisfaction
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Program Performance */}
            {displayProgramStats.length > 0 && (
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">🎯 Program Performance</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {displayProgramStats.map((program, index) => (
                                        <div key={index} className="col-md-4 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body text-center">
                                                    <h6 className="card-title text-primary">{program.program}</h6>
                                                    <div className="row mt-3">
                                                        <div className="col-6">
                                                            <div className="border rounded p-2">
                                                                <div className="fw-bold text-info">{program.reports_count}</div>
                                                                <small className="text-muted">Reports</small>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="border rounded p-2">
                                                                <div className={`fw-bold ${
                                                                    program.attendance_rate >= 80 ? 'text-success' : 
                                                                    program.attendance_rate >= 60 ? 'text-warning' : 'text-danger'
                                                                }`}>
                                                                    {Math.round(program.attendance_rate)}%
                                                                </div>
                                                                <small className="text-muted">Attendance</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className={`badge ${
                                                            program.avg_rating >= 4 ? 'bg-success' : 
                                                            program.avg_rating >= 3 ? 'bg-warning' : 'bg-danger'
                                                        }`}>
                                                            {program.avg_rating ? program.avg_rating.toFixed(1) : 'N/A'} ⭐
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                {/* Recent Activity */}
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">🕒 Recent Activity</h5>
                        </div>
                        <div className="card-body">
                            {displayRecentActivity.length > 0 ? (
                                displayRecentActivity.map(activity => (
                                    <div key={activity.id} className="border-bottom pb-2 mb-2">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>{activity.course_code}</strong>
                                                <br/>
                                                <small className="text-muted">
                                                    by {activity.lecturer_name} • Week {activity.week_of_reporting}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <span className={`badge ${
                                                    activity.status === 'submitted' ? 'bg-warning' : 
                                                    activity.status === 'reviewed' ? 'bg-success' : 'bg-secondary'
                                                }`}>
                                                    {activity.status}
                                                </span>
                                                <br/>
                                                <small className="text-muted">
                                                    {new Date(activity.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-3">
                                    <p className="text-muted">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">🚀 Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-2">
                                <div className="col-6">
                                    <Link to="/pl/courses" className="btn btn-outline-primary w-100 h-100 d-flex flex-column justify-content-center">
                                        <span className="fs-4">📚</span>
                                        <small>Manage Courses</small>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/pl/reports" className="btn btn-outline-success w-100 h-100 d-flex flex-column justify-content-center">
                                        <span className="fs-4">📋</span>
                                        <small>View Reports</small>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/pl/monitoring" className="btn btn-outline-warning w-100 h-100 d-flex flex-column justify-content-center">
                                        <span className="fs-4">📈</span>
                                        <small>Monitoring</small>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/pl/rating" className="btn btn-outline-danger w-100 h-100 d-flex flex-column justify-content-center">
                                        <span className="fs-4">⭐</span>
                                        <small>Ratings</small>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">📊 Program Statistics</h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-md-3 mb-3">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-primary">{displaySummary.total_lecturers}</div>
                                        <small className="text-muted">Lecturers</small>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-success">{displaySummary.total_classes}</div>
                                        <small className="text-muted">Classes</small>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-info">{displaySummary.reviewed_reports}</div>
                                        <small className="text-muted">Reviewed Reports</small>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="border rounded p-3">
                                        <div className="h4 text-warning">{displayProgramStats.length}</div>
                                        <small className="text-muted">Active Programs</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PLDashboardMain;