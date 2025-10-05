import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PLClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/pl/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setError('Failed to load classes data.');
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
                    <p className="mt-2">Loading classes data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">🏫 Program Classes</h2>
                            <p className="text-muted mb-0">Manage classes across all academic programs</p>
                        </div>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={fetchClasses}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="row">
                {classes.map(cls => (
                    <div key={cls.id} className="col-lg-4 mb-4">
                        <div className="card h-100">
                            <div className="card-header">
                                <h6 className="mb-0">{cls.class_name}</h6>
                                <small className="text-muted">{cls.program}</small>
                            </div>
                            <div className="card-body">
                                <h6 className="card-title text-primary">{cls.course_name}</h6>
                                
                                <div className="mb-3">
                                    <p className="small mb-1">
                                        <strong>Course Code:</strong> {cls.course_code}
                                    </p>
                                    <p className="small mb-1">
                                        <strong>Lecturer:</strong> {cls.lecturer_name || 'Not assigned'}
                                    </p>
                                    <p className="small mb-1">
                                        <strong>Schedule:</strong> {cls.schedule_day} at {cls.schedule_time}
                                    </p>
                                    <p className="small mb-2">
                                        <strong>Venue:</strong> {cls.venue}
                                    </p>
                                </div>

                                {/* Statistics */}
                                <div className="row text-center small">
                                    <div className="col-6">
                                        <div className="border rounded p-2">
                                            <div className="fw-bold text-primary">{cls.total_reports || 0}</div>
                                            <small className="text-muted">Reports</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border rounded p-2">
                                            <div className={`fw-bold ${
                                                cls.avg_attendance >= 80 ? 'text-success' : 
                                                cls.avg_attendance >= 60 ? 'text-warning' : 'text-danger'
                                            }`}>
                                                {Math.round(cls.avg_attendance || 0)}%
                                            </div>
                                            <small className="text-muted">Attendance</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <small className="text-muted">
                                    Last updated: {new Date(cls.created_at).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {classes.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted mb-3">
                        <i className="fas fa-chalkboard-teacher fa-3x"></i>
                    </div>
                    <h5>No classes found</h5>
                    <p className="text-muted">No class data available for the current programs.</p>
                </div>
            )}
        </div>
    );
};

export default PLClasses;