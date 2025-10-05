import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PLMonitoring = () => {
    const [monitoringData, setMonitoringData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMonitoringData();
    }, []);

    const fetchMonitoringData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/pl/monitoring');
            setMonitoringData(response.data);
        } catch (error) {
            console.error('Error fetching monitoring data:', error);
            setError('Failed to load monitoring data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading program monitoring data...</p>
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

    const { programPerformance, lecturerPerformance, weeklyProgress } = monitoringData;

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">📈 Program Monitoring</h2>
                            <p className="text-muted mb-0">Comprehensive overview of all academic programs</p>
                        </div>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={fetchMonitoringData}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Program Performance */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">🎯 Program Performance</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Program</th>
                                            <th>Modules</th>
                                            <th>Reports</th>
                                            <th>Avg Attendance</th>
                                            <th>Avg Rating</th>
                                            <th>Lecturers</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programPerformance.map(program => (
                                            <tr key={program.program}>
                                                <td>
                                                    <strong>{program.program}</strong>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">{program.total_modules}</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-primary">{program.total_reports}</span>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="progress flex-grow-1 me-2" style={{height: '8px'}}>
                                                            <div 
                                                                className={`progress-bar ${
                                                                    program.avg_attendance >= 80 ? 'bg-success' : 
                                                                    program.avg_attendance >= 60 ? 'bg-warning' : 'bg-danger'
                                                                }`}
                                                                style={{width: `${program.avg_attendance || 0}%`}}
                                                            ></div>
                                                        </div>
                                                        <span>{Math.round(program.avg_attendance || 0)}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        program.avg_rating >= 4 ? 'bg-success' : 
                                                        program.avg_rating >= 3 ? 'bg-warning' : 'bg-danger'
                                                    }`}>
                                                        {program.avg_rating ? program.avg_rating.toFixed(1) : 'N/A'} ⭐
                                                    </span>
                                                </td>
                                                <td>{program.lecturers_count}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        (program.avg_attendance || 0) >= 70 && (program.avg_rating || 0) >= 3.5 
                                                            ? 'bg-success' : 'bg-warning'
                                                    }`}>
                                                        {(program.avg_attendance || 0) >= 70 && (program.avg_rating || 0) >= 3.5 
                                                            ? 'On Track' : 'Needs Attention'
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Lecturer Performance */}
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">👥 Lecturer Performance</h5>
                        </div>
                        <div className="card-body">
                            {lecturerPerformance.slice(0, 6).map(lecturer => (
                                <div key={lecturer.lecturer_name} className="border-bottom pb-2 mb-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{lecturer.lecturer_name}</h6>
                                            <small className="text-muted">
                                                {lecturer.modules_assigned} modules • {lecturer.reports_submitted} reports
                                            </small>
                                        </div>
                                        <div className="text-end">
                                            <span className={`badge ${
                                                lecturer.avg_rating >= 4 ? 'bg-success' : 
                                                lecturer.avg_rating >= 3 ? 'bg-warning' : 'bg-danger'
                                            }`}>
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
                    </div>
                </div>

                {/* Weekly Progress */}
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">📅 Weekly Progress</h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                {weeklyProgress.map(week => (
                                    <div key={week.week_of_reporting} className="col-4 mb-3">
                                        <div className="border rounded p-2">
                                            <small className="text-muted">Week {week.week_of_reporting}</small>
                                            <div className="mt-1">
                                                <strong>{week.reports_count}</strong>
                                            </div>
                                            <small className="text-muted">reports</small>
                                            <br />
                                            <small className="text-muted">
                                                {Math.round(week.avg_attendance || 0)}% attendance
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PLMonitoring;