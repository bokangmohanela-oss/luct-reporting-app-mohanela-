import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRLReportsReview = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [expandedReports, setExpandedReports] = useState(new Set());

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        filterAndSortReports();
    }, [reports, selectedStatus, searchTerm, sortBy]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/prl/reports');
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setMessage('❌ Failed to load reports. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortReports = () => {
        let filtered = [...reports];

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(report => report.status === selectedStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(report =>
                report.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.lecturer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.topic_taught.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort reports
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'oldest':
                    return new Date(a.created_at) - new Date(b.created_at);
                case 'course':
                    return a.course_code.localeCompare(b.course_code);
                case 'lecturer':
                    return a.lecturer_name.localeCompare(b.lecturer_name);
                case 'week':
                    return b.week_of_reporting - a.week_of_reporting;
                case 'rating':
                    return (b.avg_rating || 0) - (a.avg_rating || 0);
                default:
                    return 0;
            }
        });

        setFilteredReports(filtered);
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        setMessage('');
        
        if (!feedback.trim()) {
            setMessage('❌ Please provide feedback');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/prl/reports/${selectedReport.id}/feedback`,
                { 
                    feedback: feedback.trim(),
                    status: 'reviewed'
                }
            );
            
            if (response.data.success) {
                setMessage('✅ Feedback submitted successfully!');
                setSelectedReport(null);
                setFeedback('');
                fetchReports(); // Refresh the list
            }
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.error || 'Failed to submit feedback'));
        }
    };

    const toggleReportExpansion = (reportId) => {
        const newExpanded = new Set(expandedReports);
        if (newExpanded.has(reportId)) {
            newExpanded.delete(reportId);
        } else {
            newExpanded.add(reportId);
        }
        setExpandedReports(newExpanded);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { class: 'secondary', label: 'Draft' },
            submitted: { class: 'warning', label: 'Pending Review' },
            reviewed: { class: 'success', label: 'Reviewed' },
            approved: { class: 'info', label: 'Approved' }
        };
        const config = statusConfig[status] || { class: 'secondary', label: status };
        return `badge bg-${config.class}`;
    };

    const getRatingBadge = (rating) => {
        if (!rating) return 'badge bg-secondary';
        if (rating >= 4) return 'badge bg-success';
        if (rating >= 3) return 'badge bg-warning';
        return 'badge bg-danger';
    };

    const getAttendancePercentage = (present, total) => {
        return total > 0 ? Math.round((present / total) * 100) : 0;
    };

    const getAttendanceBadge = (percentage) => {
        if (percentage >= 80) return 'badge bg-success';
        if (percentage >= 60) return 'badge bg-warning';
        return 'badge bg-danger';
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading reports...</p>
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
                            <h2 className="mb-1">📊 Reports Review</h2>
                            <p className="text-muted mb-0">Review and provide feedback on submitted lecture reports</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-outline-warning btn-sm"
                                onClick={fetchReports}
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
                                    placeholder="Search reports by course, lecturer, class, or topic..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <select 
                            className="form-select form-select-sm"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="submitted">Pending Review</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="approved">Approved</option>
                            <option value="draft">Draft</option>
                        </select>

                        {/* Sort Options */}
                        <select 
                            className="form-select form-select-sm"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="course">Course Code</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="week">Week</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-4 text-md-end">
                    <small className="text-muted">
                        Showing {filteredReports.length} of {reports.length} reports
                    </small>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="row">
                {filteredReports.map(report => {
                    const attendancePercentage = getAttendancePercentage(
                        report.actual_students_present, 
                        report.total_registered_students
                    );
                    const isExpanded = expandedReports.has(report.id);

                    return (
                        <div key={report.id} className="col-lg-6 mb-4">
                            <div className="card h-100 report-card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">{report.course_code}</h6>
                                        <small className="text-muted">{report.class_name}</small>
                                    </div>
                                    <div className="d-flex gap-1">
                                        <span className={getStatusBadge(report.status)}>
                                            {report.status === 'submitted' ? 'Pending Review' : report.status}
                                        </span>
                                        {report.avg_rating && (
                                            <span className={getRatingBadge(report.avg_rating)}>
                                                {report.avg_rating.toFixed(1)} ⭐
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="card-body">
                                    {/* Basic Info */}
                                    <div className="mb-3">
                                        <h6 className="text-primary">{report.course_name}</h6>
                                        <p className="mb-2 small">
                                            <strong>Lecturer:</strong> {report.lecturer_name}
                                        </p>
                                        <p className="mb-2 small">
                                            <strong>Week:</strong> {report.week_of_reporting} • 
                                            <strong> Date:</strong> {new Date(report.date_of_lecture).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Statistics */}
                                    <div className="row text-center mb-3">
                                        <div className="col-4">
                                            <div className="border rounded p-2">
                                                <div className="fw-bold text-primary">
                                                    {report.actual_students_present}/{report.total_registered_students}
                                                </div>
                                                <small className="text-muted">Attendance</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="border rounded p-2">
                                                <div className={`fw-bold text-${attendancePercentage >= 80 ? 'success' : attendancePercentage >= 60 ? 'warning' : 'danger'}`}>
                                                    {attendancePercentage}%
                                                </div>
                                                <small className="text-muted">Rate</small>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="border rounded p-2">
                                                <div className="fw-bold text-info">
                                                    {report.total_ratings || 0}
                                                </div>
                                                <small className="text-muted">Ratings</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Topic */}
                                    <div className="mb-3">
                                        <strong>Topic:</strong>
                                        <p className="small text-muted mb-2">
                                            {report.topic_taught.length > 100 && !isExpanded 
                                                ? `${report.topic_taught.substring(0, 100)}...` 
                                                : report.topic_taught
                                            }
                                        </p>
                                    </div>

                                    {/* Expandable Details */}
                                    {isExpanded && (
                                        <div className="expanded-details">
                                            <div className="mb-3">
                                                <strong>Learning Outcomes:</strong>
                                                <p className="small text-muted">{report.learning_outcomes}</p>
                                            </div>
                                            <div className="mb-3">
                                                <strong>Recommendations:</strong>
                                                <p className="small text-muted">{report.recommendations}</p>
                                            </div>
                                            <div className="row small text-muted">
                                                <div className="col-6">
                                                    <strong>Venue:</strong> {report.venue}
                                                </div>
                                                <div className="col-6">
                                                    <strong>Time:</strong> {report.scheduled_time}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* PRL Feedback */}
                                    {report.prl_feedback && (
                                        <div className="alert alert-info py-2 mt-2">
                                            <strong>📝 Your Feedback:</strong> {report.prl_feedback}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-2 mt-3">
                                        <button 
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => toggleReportExpansion(report.id)}
                                        >
                                            {isExpanded ? '▲ Less' : '▼ More'} Details
                                        </button>
                                        
                                        {report.status === 'submitted' && (
                                            <button 
                                                className="btn btn-warning btn-sm"
                                                onClick={() => setSelectedReport(report)}
                                            >
                                                💬 Add Feedback
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="card-footer text-muted">
                                    <small>
                                        Submitted: {new Date(report.created_at).toLocaleString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted mb-3">
                        <i className="fas fa-file-alt fa-3x"></i>
                    </div>
                    <h5>No reports found</h5>
                    <p className="text-muted">
                        {searchTerm || selectedStatus !== 'all' 
                            ? 'Try adjusting your search terms or filters' 
                            : 'No reports have been submitted yet'
                        }
                    </p>
                    {(searchTerm || selectedStatus !== 'all') && (
                        <button 
                            className="btn btn-warning"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedStatus('all');
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {/* Feedback Modal */}
            {selectedReport && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Feedback</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => {
                                        setSelectedReport(null);
                                        setFeedback('');
                                        setMessage('');
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {message && (
                                    <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                        {message}
                                    </div>
                                )}
                                
                                {/* Report Summary */}
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h6>Report Summary</h6>
                                        <div className="row small">
                                            <div className="col-md-6">
                                                <p><strong>Course:</strong> {selectedReport.course_code} - {selectedReport.course_name}</p>
                                                <p><strong>Class:</strong> {selectedReport.class_name}</p>
                                                <p><strong>Week:</strong> {selectedReport.week_of_reporting}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>Lecturer:</strong> {selectedReport.lecturer_name}</p>
                                                <p><strong>Date:</strong> {new Date(selectedReport.date_of_lecture).toLocaleDateString()}</p>
                                                <p><strong>Attendance:</strong> {selectedReport.actual_students_present}/{selectedReport.total_registered_students}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <strong>Topic:</strong>
                                            <p className="small text-muted mb-0">{selectedReport.topic_taught}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmitFeedback}>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            <strong>Your Feedback</strong>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="6"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Provide constructive feedback, suggestions, or approval comments..."
                                            required
                                        ></textarea>
                                        <div className="form-text">
                                            Your feedback will be visible to the lecturer and will help improve teaching quality.
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-warning">
                                            ✅ Submit Feedback
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setSelectedReport(null);
                                                setFeedback('');
                                                setMessage('');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PRLReportsReview;