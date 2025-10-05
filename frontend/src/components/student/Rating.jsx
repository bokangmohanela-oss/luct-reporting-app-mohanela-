import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentRating = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/students/reports');
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleSubmitRating = async (e) => {
        e.preventDefault();
        setMessage('');
        
        if (!selectedReport) {
            setMessage('❌ Please select a report to rate');
            return;
        }

        const studentUser = JSON.parse(localStorage.getItem('studentUser'));
        if (!studentUser) {
            setMessage('❌ Please login first');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/students/ratings', {
                report_id: selectedReport.id,
                student_id: studentUser.id,
                rating_value: rating,
                comments: comments
            });
            
            if (response.data.success) {
                setMessage('✅ Rating submitted successfully!');
                setSelectedReport(null);
                setRating(5);
                setComments('');
                // Refresh reports to show the rated one
                fetchReports();
            }
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.error || 'Failed to submit rating'));
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-warning text-dark">
                            <h3 className="mb-0">⭐ Rate Lecture Reports</h3>
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}

                            {/* Reports List for Rating */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h5>Select a Report to Rate:</h5>
                                    <div className="row">
                                        {reports.map(report => (
                                            <div key={report.id} className="col-md-4 mb-3">
                                                <div 
                                                    className={`card cursor-pointer ${selectedReport?.id === report.id ? 'border-primary' : ''}`}
                                                    onClick={() => setSelectedReport(report)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="card-body">
                                                        <h6 className="card-title">
                                                            {report.course_code} - {report.class_name}
                                                        </h6>
                                                        <p className="card-text small">
                                                            <strong>Week:</strong> {report.week_of_reporting}<br/>
                                                            <strong>Topic:</strong> {report.topic_taught.substring(0, 50)}...
                                                        </p>
                                                        {selectedReport?.id === report.id && (
                                                            <span className="badge bg-primary">Selected</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Rating Form */}
                            {selectedReport && (
                                <div className="row">
                                    <div className="col-md-8 offset-md-2">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0">
                                                    Rating for: {selectedReport.course_code} - Week {selectedReport.week_of_reporting}
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={handleSubmitRating}>
                                                    <div className="mb-3">
                                                        <label className="form-label">Rating (1-5 Stars)</label>
                                                        <div>
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    className={`btn btn-lg ${rating >= star ? 'btn-warning' : 'btn-outline-warning'} me-2`}
                                                                    onClick={() => setRating(star)}
                                                                >
                                                                    ⭐
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <small className="text-muted">
                                                            Selected: {rating} star(s)
                                                        </small>
                                                    </div>
                                                    
                                                    <div className="mb-3">
                                                        <label className="form-label">Comments (Optional)</label>
                                                        <textarea
                                                            className="form-control"
                                                            rows="3"
                                                            value={comments}
                                                            onChange={(e) => setComments(e.target.value)}
                                                            placeholder="Share your feedback about this lecture..."
                                                        ></textarea>
                                                    </div>
                                                    
                                                    <div className="d-grid">
                                                        <button type="submit" className="btn btn-warning btn-lg">
                                                            Submit Rating
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRating;