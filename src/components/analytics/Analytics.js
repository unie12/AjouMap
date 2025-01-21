// src/components/analytics/Analytics.js
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../styles/Analytics.css';

const Analytics = () => {
    const [popularStores, setPopularStores] = useState([]);
    const [topReviewers, setTopReviewers] = useState([]);
    const [popularFavorites, setPopularFavorites] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [storesRes, reviewersRes, favoritesRes] = await Promise.all([
                    api.get('/analytics/popular-stores'),
                    api.get('/analytics/top-reviewers'),
                    api.get('/analytics/popular-favorites')
                ]);

                setPopularStores(storesRes.data);
                setTopReviewers(reviewersRes.data);
                setPopularFavorites(favoritesRes.data);
            } catch (error) {
                console.error('Analytics 데이터 로딩 실패:', error);
            }
        };

        fetchAnalytics();
        // 5분마다 데이터 갱신
        const interval = setInterval(fetchAnalytics, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="analytics-container">
            <div className="analytics-section">
                <h2>인기 맛집</h2>
                <div className="analytics-list">
                    {popularStores.map((store, index) => (
                        <div key={store} className="analytics-item">
                            <span className="rank">{index + 1}</span>
                            <span className="name">{store}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="analytics-section">
                <h2>활발한 리뷰어</h2>
                <div className="analytics-list">
                    {topReviewers.map((reviewer, index) => (
                        <div key={reviewer} className="analytics-item">
                            <span className="rank">{index + 1}</span>
                            <span className="name">{reviewer}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="analytics-section">
                <h2>인기 찜 맛집</h2>
                <div className="analytics-list">
                    {popularFavorites.map((store, index) => (
                        <div key={store} className="analytics-item">
                            <span className="rank">{index + 1}</span>
                            <span className="name">{store}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
