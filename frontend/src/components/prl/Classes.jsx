import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRLClasses = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classDetails, setClassDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/prl/classes');
            setClasses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setLoading(false);
        }
    };

    const fetchClassDetails = async (className) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/prl/classes/${className}`);
            setClassDetails(response.data);
            setSelectedClass(className);
        } catch (error) {
            console.error('Error fetching class details:', error);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading classes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-warning text-dark">
                            <h3 className="mb-0">🏫 Class Management</h3>
                        </div>
                        <div className="card-body">
                            {/* Classes List */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h5>All Classes Under Supervision</h5>
                                    <div className="row">
                                        {classes.map(cls => (
                                            <div key={cls.id} className="col-md-6 mb-3">
                                                <div 
                                                    className={`card cursor-pointer ${selectedClass === cls.class_name ? 'border-warning' : ''}`}
                                                    onClick={() => fetchClassDetails(cls.class_name)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="card-body">
                                                        <h6 className="card-title">{cls.class_name}</h6>
                                                        <p className="card-text small mb-1">
                                                            <strong>Course:</strong> {cls.course_code} - {cls.course_name}
                                                        </p>
                                                        <p className="card-text small mb-1">
                                                            <strong>Lecturer:</strong> {cls.lecturer_name || 'Not assigned'}
                                                        </p>
                                                        <p className="card-text small mb-1">
                                                            <strong>Schedule:</strong> {cls.schedule_day} at {cls.schedule_time}
                                                        </p>
                                                        <p className="card-text small mb-2">
                                                            <strong>Venue:</strong> {cls.venue}
                                                        </p>
                                                        <div className="d-flex justify-content-between">
                                                            <span className="badge bg-primary">
                                                                {cls.total_reports} Reports
                                                            </span>
                                                            <span className="badge bg-success">
                                                                Avg: {cls.avg_attendance ? Math.round(cls.avg_attendance) : 0}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Class Details */}
                            {classDetails && (
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="mb-0">
                                                    Class Details: {classDetails.classInfo.class_name}
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <p><strong>Course:</strong> {classDetails.classInfo.course_code} - {classDetails.classInfo.course_name}</p>
                                                        <p><strong>Lecturer:</strong> {classDetails.classInfo.lecturer_name || 'Not assigned'}</p>
                                                        <p><strong>Schedule:</strong> {classDetails.classInfo.schedule_day} at {classDetails.classInfo.schedule_time}</p>
                                                        <p><strong>Venue:</strong> {classDetails.classInfo.venue}</p>
                                                    </div>
                                                </div>

                                                <h6>Recent Reports</h6>
                                                {classDetails.reports.length > 0 ? (
                                                    <div className="table-responsive">
                                                        <table className="table table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th>Week</th>
                                                                    <th>Date</th>
                                                                    <th>Topic</th>
                                                                    <th>Attendance</th>
                                                                    <th>Rating</th>
                                                                    <th>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {classDetails.reports.map(report => (
                                                                    <tr key={report.id}>
                                                                        <td>{report.week_of_reporting}</td>
                                                                        <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                                                                        <td>{report.topic_taught.substring(0, 50)}...</td>
                                                                        <td>{report.actual_students_present}/{report.total_registered_students}</td>
                                                                        <td>
                                                                            {report.avg_rating ? report.avg_rating.toFixed(1) + ' ⭐' : 'No ratings'}
                                                                        </td>
                                                                        <td>
                                                                            <span className={`badge ${
                                                                                report.status === 'submitted' ? 'bg-warning' : 
                                                                                report.status === 'reviewed' ? 'bg-success' : 'bg-secondary'
                                                                            }`}>
                                                                                {report.status}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted">No reports available for this class.</p>
                                                )}
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

export default PRLClasses;