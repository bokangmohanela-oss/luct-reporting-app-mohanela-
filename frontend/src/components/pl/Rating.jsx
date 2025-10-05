import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PLRating = () => {
    const [ratingData, setRatingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRatingData();
    }, []);

    const fetchRatingData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/pl/ratings');
            setRatingData(response.data);
        } catch (error) {
            console.error('Error fetching rating data:', error);
            setError('Failed to load rating analytics.');
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
                    <p className="mt-2">Loading rating analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchRatingData}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { programRatings, ratingDistribution } = ratingData;

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">⭐ Rating Analytics</h2>
                            <p className="text-muted mb-0">Student feedback and rating analysis across programs</p>
                        </div>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={fetchRatingData}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Program Ratings */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">📊 Program Rating Summary</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Program</th>
                                            <th>Average Rating</th>
                                            <th>Total Ratings</th>
                                            <th>Unique Students</th>
                                            <th>Rated Courses</th>
                                            <th>Rating Range</th>
                                            <th>Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programRatings.map(program => (
                                            <tr key={program.program}>
                                                <td>
                                                    <strong>{program.program}</strong>
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        program.average_rating >= 4 ? 'bg-success' : 
                                                        program.average_rating >= 3 ? 'bg-warning' : 'bg-danger'
                                                    }`}>
                                                        {program.average_rating ? program.average_rating.toFixed(1) : 'N/A'} ⭐
                                                    </span>
                                                </td>
                                                <td>{program.total_ratings}</td>
                                                <td>{program.unique_students}</td>
                                                <td>{program.rated_courses}</td>
                                                <td>
                                                    {program.min_rating} - {program.max_rating} ⭐
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        program.average_rating >= 4 ? 'bg-success' : 
                                                        program.average_rating >= 3.5 ? 'bg-info' :
                                                        program.average_rating >= 3 ? 'bg-warning' : 'bg-danger'
                                                    }`}>
                                                        {program.average_rating >= 4 ? 'Excellent' : 
                                                         program.average_rating >= 3.5 ? 'Good' :
                                                         program.average_rating >= 3 ? 'Fair' : 'Needs Improvement'
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

            {/* Rating Distribution */}
            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">📈 Rating Distribution</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {ratingDistribution.map(dist => (
                                    <div key={dist.rating_value} className="col-md-2 mb-3">
                                        <div className="card text-center">
                                            <div className="card-body">
                                                <h3 className={`${
                                                    dist.rating_value >= 4 ? 'text-success' : 
                                                    dist.rating_value >= 3 ? 'text-warning' : 'text-danger'
                                                }`}>
                                                    {dist.rating_value} ⭐
                                                </h3>
                                                <div className="h5">{dist.count}</div>
                                                <small className="text-muted">ratings</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">📋 Rating Statistics</h5>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <div className="h2 text-primary">
                                    {programRatings.reduce((sum, program) => sum + program.total_ratings, 0)}
                                </div>
                                <small className="text-muted">Total Ratings</small>
                            </div>
                            <div className="text-center mb-4">
                                <div className="h4 text-success">
                                    {programRatings.reduce((sum, program) => sum + program.unique_students, 0)}
                                </div>
                                <small className="text-muted">Unique Students</small>
                            </div>
                            <div className="text-center">
                                <div className="h4 text-warning">
                                    {programRatings.reduce((sum, program) => sum + program.rated_courses, 0)}
                                </div>
                                <small className="text-muted">Rated Courses</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PLRating;