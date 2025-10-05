import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PLReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/pl/reports');
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setError('Failed to load reports data.');
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = filter === 'all' 
        ? reports 
        : reports.filter(report => report.status === filter);

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
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">📋 Reports with PRL Feedback</h2>
                            <p className="text-muted mb-0">Review reports that have been evaluated by PRL</p>
                        </div>
                        <div className="d-flex gap-2">
                            <select 
                                className="form-select form-select-sm"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Reports</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="submitted">Pending</option>
                            </select>
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={fetchReports}
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="row">
                {filteredReports.map(report => (
                    <div key={report.id} className="col-lg-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">{report.course_code}</h6>
                                    <small className="text-muted">{report.class_name}</small>
                                </div>
                                <span className={`badge ${
                                    report.status === 'reviewed' ? 'bg-success' : 'bg-warning'
                                }`}>
                                    {report.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <h6 className="card-title">{report.course_name}</h6>
                                
                                <div className="mb-3">
                                    <p className="small mb-2">
                                        <strong>Lecturer:</strong> {report.lecturer_name}
                                    </p>
                                    <p className="small mb-2">
                                        <strong>Week:</strong> {report.week_of_reporting} • 
                                        <strong> Date:</strong> {new Date(report.date_of_lecture).toLocaleDateString()}
                                    </p>
                                    <p className="small mb-2">
                                        <strong>Attendance:</strong> {report.actual_students_present}/{report.total_registered_students} 
                                        ({Math.round((report.actual_students_present/report.total_registered_students)*100)}%)
                                    </p>
                                </div>

                                {/* PRL Feedback */}
                                {report.prl_feedback && (
                                    <div className="alert alert-info">
                                        <strong>📝 PRL Feedback:</strong>
                                        <p className="mb-0 small">{report.prl_feedback}</p>
                                    </div>
                                )}

                                {/* Topic & Rating */}
                                <div className="mb-3">
                                    <strong>Topic:</strong>
                                    <p className="small text-muted mb-2">
                                        {report.topic_taught.length > 100 
                                            ? `${report.topic_taught.substring(0, 100)}...` 
                                            : report.topic_taught
                                        }
                                    </p>
                                </div>

                                {report.avg_rating && (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className={`badge ${
                                            report.avg_rating >= 4 ? 'bg-success' : 
                                            report.avg_rating >= 3 ? 'bg-warning' : 'bg-danger'
                                        }`}>
                                            {report.avg_rating.toFixed(1)} ⭐ ({report.total_ratings} ratings)
                                        </span>
                                        <button 
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setSelectedReport(report)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer text-muted">
                                <small>
                                    Submitted: {new Date(report.created_at).toLocaleString()}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredReports.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted mb-3">
                        <i className="fas fa-file-alt fa-3x"></i>
                    </div>
                    <h5>No reports found</h5>
                    <p className="text-muted">
                        {filter !== 'all' 
                            ? 'No reports match the selected filter' 
                            : 'No reports with PRL feedback available'
                        }
                    </p>
                </div>
            )}

            {/* Report Details Modal */}
            {selectedReport && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Report Details - {selectedReport.course_code}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setSelectedReport(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Basic Information</h6>
                                        <table className="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Course:</strong></td>
                                                    <td>{selectedReport.course_code} - {selectedReport.course_name}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Class:</strong></td>
                                                    <td>{selectedReport.class_name}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Lecturer:</strong></td>
                                                    <td>{selectedReport.lecturer_name}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Week:</strong></td>
                                                    <td>{selectedReport.week_of_reporting}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Date:</strong></td>
                                                    <td>{new Date(selectedReport.date_of_lecture).toLocaleDateString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Attendance & Rating</h6>
                                        <table className="table table-sm">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Attendance:</strong></td>
                                                    <td>
                                                        {selectedReport.actual_students_present}/{selectedReport.total_registered_students} 
                                                        ({Math.round((selectedReport.actual_students_present/selectedReport.total_registered_students)*100)}%)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Venue:</strong></td>
                                                    <td>{selectedReport.venue}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Time:</strong></td>
                                                    <td>{selectedReport.scheduled_time}</td>
                                                </tr>
                                                {selectedReport.avg_rating && (
                                                    <tr>
                                                        <td><strong>Rating:</strong></td>
                                                        <td>
                                                            <span className={`badge ${
                                                                selectedReport.avg_rating >= 4 ? 'bg-success' : 
                                                                selectedReport.avg_rating >= 3 ? 'bg-warning' : 'bg-danger'
                                                            }`}>
                                                                {selectedReport.avg_rating.toFixed(1)} ⭐ ({selectedReport.total_ratings} ratings)
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <h6>Topic Taught</h6>
                                    <p className="border rounded p-3 bg-light">
                                        {selectedReport.topic_taught}
                                    </p>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <h6>Learning Outcomes</h6>
                                        <p className="border rounded p-3 bg-light">
                                            {selectedReport.learning_outcomes}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Recommendations</h6>
                                        <p className="border rounded p-3 bg-light">
                                            {selectedReport.recommendations}
                                        </p>
                                    </div>
                                </div>

                                {selectedReport.prl_feedback && (
                                    <div className="mt-3">
                                        <h6>PRL Feedback</h6>
                                        <div className="alert alert-info">
                                            {selectedReport.prl_feedback}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedReport(null)}
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

export default PLReports;