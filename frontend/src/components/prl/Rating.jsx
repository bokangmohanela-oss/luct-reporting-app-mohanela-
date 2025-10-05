import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRLRating = () => {
    const [ratingData, setRatingData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRatingData();
    }, []);

    const fetchRatingData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/prl/ratings');
            setRatingData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching rating data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading rating data...</p>
                </div>
            </div>
        );
    }

    const { ratingStats, recentRatings } = ratingData;

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-warning text-dark">
                            <h3 className="mb-0">⭐ Rating Analytics</h3>
                        </div>
                        <div className="card-body">
                            {/* Rating Statistics */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h5>Course Rating Summary</h5>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Course</th>
                                                    <th>Avg Rating</th>
                                                    <th>Total Ratings</th>
                                                    <th>Unique Students</th>
                                                    <th>Rating Range</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ratingStats.map(stat => (
                                                    <tr key={stat.course_code}>
                                                        <td>
                                                            <strong>{stat.course_code}</strong><br/>
                                                            <small>{stat.course_name}</small>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-primary fs-6">
                                                                {stat.average_rating ? stat.average_rating.toFixed(1) : 'N/A'} ⭐
                                                            </span>
                                                        </td>
                                                        <td>{stat.total_ratings}</td>
                                                        <td>{stat.unique_students}</td>
                                                        <td>
                                                            {stat.min_rating} - {stat.max_rating} ⭐
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Ratings */}
                            <div className="row">
                                <div className="col-12">
                                    <h5>Recent Student Ratings</h5>
                                    <div className="row">
                                        {recentRatings.map(rating => (
                                            <div key={rating.id} className="col-md-6 mb-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <h6 className="card-title">
                                                                    {rating.course_code} - {rating.class_name}
                                                                </h6>
                                                                <p className="card-text small mb-1">
                                                                    <strong>Topic:</strong> {rating.topic_taught?.substring(0, 50)}...
                                                                </p>
                                                                <p className="card-text small mb-1">
                                                                    <strong>Student:</strong> {rating.student_name}
                                                                </p>
                                                                {rating.comments && (
                                                                    <p className="card-text small mb-0">
                                                                        <strong>Comment:</strong> {rating.comments}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="text-end">
                                                                <span className="badge bg-warning fs-6">
                                                                    {rating.rating_value} ⭐
                                                                </span>
                                                                <br/>
                                                                <small className="text-muted">
                                                                    {new Date(rating.created_at).toLocaleDateString()}
                                                                </small>
                                                            </div>
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
                </div>
            </div>
        </div>
    );
};

export default PRLRating;