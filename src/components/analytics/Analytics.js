import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../styles/Analytics.css';

const Analytics = () => {
    const [trendingSearches, setTrendingSearches] = useState([]);
    const [trendingStores, setTrendingStores] = useState([]);
    const [trendingReviews, setTrendingReviews] = useState([]);
    const [categoryStores, setCategoryStores] = useState({});
    const [error, setError] = useState(null);

    // 카테고리 목록 (필요 시 확장 가능)
    const categories = ['FD6', 'CE7', 'CS2']; // 예: FD6 - 음식점, CE7 - 카페, CS2 - 편의점

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // 모든 데이터를 병렬로 가져오기
                const [searchesRes, storesRes, reviewsRes] = await Promise.all([
                    api.get('/analytics/trending/searches'),
                    api.get('/analytics/trending/stores'),
                    api.get('/analytics/trending/reviews')
                ]);

                setTrendingSearches(searchesRes.data);
                setTrendingStores(storesRes.data);
                setTrendingReviews(reviewsRes.data);

                // 카테고리별 인기 가게 조회
                const categoryPromises = categories.map(category =>
                    api.get(`/analytics/trending/stores/category/${category}`)
                        .then(res => ({ category, data: res.data }))
                );

                const categoryResults = await Promise.all(categoryPromises);
                const categoryData = categoryResults.reduce((acc, curr) => {
                    acc[curr.category] = curr.data;
                    return acc;
                }, {});
                setCategoryStores(categoryData);

            } catch (error) {
                console.error('Analytics 데이터 로딩 실패:', error);
                setError('데이터를 불러오는 중 문제가 발생했습니다.');
            }
        };

        fetchAnalytics();
        // 5분마다 데이터 갱신
        const interval = setInterval(fetchAnalytics, 300000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="analytics-container">
            {/* 실시간 인기 검색어 */}
            <div className="analytics-section">
                <h2>실시간 인기 검색어</h2>
                <div className="analytics-list">
                    {trendingSearches.map((item, index) => (
                        <div key={item.query} className="analytics-item">
                            <span className="rank">{index + 1}</span>
                            <span className="name">{item.query}</span>
                            <span className="count">{item.searchCount}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 실시간 인기 맛집 */}
            <div className="analytics-section">
                <h2>실시간 인기 맛집</h2>
                <div className="analytics-list">
                    {trendingStores.map((store, index) => (
                        <div key={store.storeId} className="analytics-item">
                            <span className="rank">{index + 1}</span>
                            <span className="name">{store.placeName}</span>
                            <div className="store-info">
                                <span className="category">{store.categoryGroupName}</span>
                                <span className="view-count">조회 {store.viewScore}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 실시간 리뷰 트렌드 */}
            <div className="analytics-section">
                <h2>실시간 리뷰 트렌드</h2>
                <div className="analytics-list">
                    {trendingReviews.map((store, index) => (
                        <div key={store.storeId} className="analytics-item">
                            <span className="rank">{index + 1}</span>
                            <span className="name">{store.placeName}</span>
                            <div className="review-info">
                                <span className="rating">★ {store.averageRating}</span>
                                <span className="review-count">리뷰 {store.reviewCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 카테고리별 인기 가게 */}
            {Object.keys(categoryStores).map(category => (
                <div key={category} className="analytics-section">
                    <h2>카테고리별 인기 가게 ({category})</h2>
                    <div className="analytics-list">
                        {categoryStores[category].map((store, index) => (
                            <div key={store.storeId} className="analytics-item">
                                <span className="rank">{index + 1}</span>
                                <span className="name">{store.placeName}</span>
                                <div className="store-info">
                                    <span className="category">{store.categoryGroupName}</span>
                                    <span className="view-count">조회 {store.viewScore}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Analytics;
