// StoreDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaPhone, FaMapMarkerAlt, FaTag, FaHeart, FaComment } from 'react-icons/fa';
import api from '../../api/axios';
import ReviewForm from '../review/ReviewForm';
import ReviewItem from '../review/ReviewItem';
import FavoriteButton from '../favorite/FavoriteButton';
import RecruitmentList from '../recruitment/RecruitmentList';
// import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/StoreDetail.css';

const StoreDetail = () => {
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            try {
                setLoading(true);
                const [storeResponse, reviewResponse] = await Promise.all([
                    api.get(`/store/${storeId}`),
                    api.get(`/review/store/${storeId}`)
                ]);
                
                if (isMounted) {
                    setStore(storeResponse.data);
                    setReviews(reviewResponse.data);
                    calculateAverageRating(reviewResponse.data);
                }
            } catch (error) {
                if (isMounted) {
                    setError('데이터를 불러오는데 실패했습니다.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [storeId]);

    const calculateAverageRating = (reviewData) => {
        if (reviewData.length === 0) return;
        const total = reviewData.reduce((acc, review) => acc + review.rating, 0);
        setAverageRating(total / reviewData.length);
    };

    // if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-container">{error}</div>;
    if (!store) return <div className="not-found-container">가게 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="store-detail-container">
            <div className="store-header">
                <div className="store-title-section">
                    <h1>{store.placeName}</h1>
                    <div className="store-rating">
                        <FaStar className="star-icon" />
                        <span>{averageRating.toFixed(1)}</span>
                        <span className="review-count">({reviews.length})</span>
                    </div>
                </div>
                
                <div className="store-actions">
                    <FavoriteButton 
                        storeId={storeId} 
                        initialIsFavorite={store.favorite} 
                        onFavoriteChange={(newStatus) => 
                            setStore(prev => ({...prev, favorite: newStatus}))
                        }
                    />
                    <a 
                        href={store.placeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="kakao-button"
                    >
                        카카오맵에서 보기
                    </a>
                </div>
            </div>

            <div className="store-content">
                <div className="tab-navigation">
                    {['info', 'recruitments', 'reviews'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'info' && '정보'}
                            {tab === 'recruitments' && '밥친구 구인'}
                            {tab === 'reviews' && `리뷰 (${reviews.length})`}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    {activeTab === 'info' && (
                        <div className="info-section">
                            <div className="info-card">
                                <div className="info-item">
                                    <FaMapMarkerAlt />
                                    <span>{store.addressName}</span>
                                </div>
                                {store.phone && (
                                    <div className="info-item">
                                        <FaPhone />
                                        <span>{store.phone}</span>
                                    </div>
                                )}
                                {store.categoryName && (
                                    <div className="info-item">
                                        <FaTag />
                                        <span>{store.categoryName}</span>
                                    </div>
                                )}
                            </div>

                            <div className="stats-card">
                                <div className="stat-item">
                                    <FaComment />
                                    <span>{store.reviewCount || 0}</span>
                                    <label>리뷰</label>
                                </div>
                                <div className="stat-item">
                                    <FaHeart />
                                    <span>{store.favoriteCount || 0}</span>
                                    <label>찜</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'recruitments' && (
                        <RecruitmentList storeId={storeId} />
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-section">
                            <ReviewForm 
                                storeId={storeId} 
                                onReviewSubmitted={(newReview) => {
                                    setReviews(prev => [newReview, ...prev]);
                                    calculateAverageRating([newReview, ...reviews]);
                                }}
                            />
                            
                            {reviews.length === 0 ? (
                                <div className="no-reviews">
                                    <p>아직 리뷰가 없습니다.</p>
                                    <p>첫 리뷰를 작성해보세요!</p>
                                </div>
                            ) : (
                                <div className="reviews-list">
                                    {reviews.map(review => (
                                        <ReviewItem
                                            key={review.id}
                                            review={review}
                                            onReviewUpdated={(updatedReview) => {
                                                setReviews(prev => 
                                                    prev.map(r => 
                                                        r.id === updatedReview.id ? updatedReview : r
                                                    )
                                                );
                                                calculateAverageRating([...reviews]);
                                            }}
                                            isOwner={review.isOwner}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreDetail;
