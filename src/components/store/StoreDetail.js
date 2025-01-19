import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import ReviewForm from '../review/ReviewForm';
import ReviewItem from '../review/ReviewItem';
import FavoriteButton from '../favorite/FavoriteButton';

const StoreDetail = () => {
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/review/store/${storeId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('리뷰 로딩 실패:', error);
            setReviews([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const storeResponse = await api.get(`/store/${storeId}`);
                setStore(storeResponse.data);
                await fetchReviews();
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
                setError('데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [storeId]);

    const handleFavoriteChange = (newStatus) => {
        setStore(prevStore => ({...prevStore, favorite: newStatus}));
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!store) return <div>가게 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="store-detail">
            <h2>{store.placeName}</h2>
            <div className="store-info">
                <p>주소: {store.addressName}</p>
                <a 
                    href={store.placeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="kakao-button"
                >
                    카카오맵에서 보기
                </a>
                <FavoriteButton 
                    storeId={storeId} 
                    initialIsFavorite={store.favorite} 
                    onFavoriteChange={handleFavoriteChange}
                />
            </div>

            <div className="reviews-section">
                <h3>리뷰</h3>
                <ReviewForm 
                    storeId={storeId} 
                    onReviewSubmitted={fetchReviews}
                />
                
                {reviews.length === 0 ? (
                    <p>아직 리뷰가 없습니다.</p>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <ReviewItem
                                key={review.id}
                                review={review}
                                onReviewUpdated={fetchReviews}
                                isOwner={false}  // 인증 기능 구현 전까지는 false로 설정
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreDetail;
