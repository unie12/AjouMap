import React, { useState, useEffect } from 'react';
import { FaHeart, FaStar, FaStore, FaUsers, FaUserFriends } from 'react-icons/fa';
import api from '../../api/axios';
import MyRecruitmentsList from '../recruitment/MyRecruitmentList';
import JoinedRecruitmentsList from '../recruitment/JoinRecruitmentList';
import '../../styles/UserActivity.css';

const UserActivity = () => {
    const [activity, setActivity] = useState(null);
    const [activeTab, setActiveTab] = useState('reviews');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (activeTab === 'reviews' || activeTab === 'favorites' || activeTab === 'hearts') {
            fetchActivity();
        }
    }, [activeTab]);

    const fetchActivity = async () => {
        try {
            const response = await api.get('/user-activity/summary');
            setActivity(response.data);
        } catch (err) {
            setError('활동 내역을 불러오는데 실패했습니다.');
            console.error('활동 내역 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderReviewsTab = () => (
        <div className="reviews-section">
            {activity.reviews.map(review => (
                <div key={review.id} className="activity-card">
                    <div className="card-header">
                        <h3>{review.storeName}</h3>
                        <div className="rating">
                            {'★'.repeat(review.rating)}
                            <span className="rating-gray">
                                {'★'.repeat(5 - review.rating)}
                            </span>
                        </div>
                    </div>
                    <p className="review-content">{review.content}</p>
                    {review.imageUrls?.length > 0 && (
                        <div className="review-images">
                            {review.imageUrls.map((url, index) => (
                                <img 
                                    key={index} 
                                    src={url} 
                                    alt={`리뷰 이미지 ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                    <div className="card-footer">
                        <span className="date">{formatDate(review.createdAt)}</span>
                        <span className="likes">
                            <FaHeart /> {review.heartCount}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderFavoritesTab = () => (
        <div className="favorites-section">
            {activity.favorites.map(favorite => (
                <div key={favorite.id} className="activity-card">
                    <h3>{favorite.placeName}</h3>
                    <div className="card-footer">
                        <span className="date">
                            찜한 날짜: {formatDate(favorite.createdAt)}
                        </span>
                        <span className="favorite-count">
                            <FaHeart /> {favorite.favoriteCount}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderHeartsTab = () => (
        <div className="hearts-section">
            {activity.hearts.map(heart => (
                <div key={heart.id} className="activity-card">
                    <h3>{heart.placeName}</h3>
                    <div className="rating">
                        {'★'.repeat(heart.rating)}
                        <span className="rating-gray">
                            {'★'.repeat(5 - heart.rating)}
                        </span>
                    </div>
                    <div className="card-footer">
                        <span>작성자: {heart.username}</span>
                        <span className="date">
                            좋아요 날짜: {formatDate(heart.createdAt)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading && (activeTab === 'reviews' || activeTab === 'favorites' || activeTab === 'hearts')) {
        return <div className="loading">로딩 중...</div>;
    }
    if (error && (activeTab === 'reviews' || activeTab === 'favorites' || activeTab === 'hearts')) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="user-activity-container">
            <h2 className="activity-title">내 활동 내역</h2>
            
            <div className="activity-tabs">
                <button 
                    className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    <FaStar /> 리뷰 {activity?.reviews?.length ? `(${activity.reviews.length})` : ''}
                </button>
                <button 
                    className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    <FaStore /> 찜한 가게 {activity?.favorites?.length ? `(${activity.favorites.length})` : ''}
                </button>
                <button 
                    className={`tab ${activeTab === 'hearts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hearts')}
                >
                    <FaHeart /> 좋아요한 리뷰 {activity?.hearts?.length ? `(${activity.hearts.length})` : ''}
                </button>
                <button 
                    className={`tab ${activeTab === 'myRecruitments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('myRecruitments')}
                >
                    <FaUsers /> 내 구인글
                </button>
                <button 
                    className={`tab ${activeTab === 'joinedRecruitments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('joinedRecruitments')}
                >
                    <FaUserFriends /> 참여한 구인글
                </button>
            </div>

            <div className="activity-content">
                {activeTab === 'reviews' && activity && renderReviewsTab()}
                {activeTab === 'favorites' && activity && renderFavoritesTab()}
                {activeTab === 'hearts' && activity && renderHeartsTab()}
                {activeTab === 'myRecruitments' && <MyRecruitmentsList />}
                {activeTab === 'joinedRecruitments' && <JoinedRecruitmentsList />}
            </div>
        </div>
    );
};

export default UserActivity;