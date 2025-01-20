// components/review/ReviewItem.js
import React, { useState } from 'react';
import api from '../../api/axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // 하트 아이콘
import '../../styles/ReviewItem.css';


const ReviewItem = ({ review, onReviewUpdated, isOwner }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(review.content);
    const [rating, setRating] = useState(review.rating);
    const [visitDateTime, setVisitDateTime] = useState(review.visitDateTime);
    const [crowdedness, setCrowdedness] = useState(review.crowdedness);
    const [heartCount, setHeartCount] = useState(review.heartCount || 0);
    const [isLiked, setIsLiked] = useState(review.isLiked);
    const [isLoading, setIsLoading] = useState(false);

    const handleHeartToggle = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await api.post(`/hearts/reviews/${review.id}`);
            
            if (response.status === 204) {
                setHeartCount(prev => Math.max(0, prev - 1));
                setIsLiked(false);
            } else if (response.data) {
                const heartData = response.data;
                if (typeof heartData.heartCount === 'number') {
                    setHeartCount(heartData.heartCount);
                    setIsLiked(true);
                } else {
                    console.error('Invalid heart count received:', heartData);
                }
            }
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const handleUpdate = async () => {
        try {
            await api.put(`/review/${review.id}`, {
                content,
                rating,
                visitDateTime,
                crowdedness
            });
            setIsEditing(false);
            if (onReviewUpdated) {
                onReviewUpdated();
            }
        } catch (error) {
            console.error('리뷰 수정 실패:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('리뷰를 삭제하시겠습니까?')) {
            try {
                await api.delete(`/review/${review.id}`);
                if (onReviewUpdated) {
                    onReviewUpdated();
                }
            } catch (error) {
                console.error('리뷰 삭제 실패:', error);
            }
        }
    };

    return (
        <div className="review-item">
            {isEditing ? (
                <div className="review-edit-form">
                    <select 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>{num}점</option>
                        ))}
                    </select>
                    <input
                        type="datetime-local"
                        value={visitDateTime}
                        onChange={(e) => setVisitDateTime(e.target.value)}
                    />
                    <select
                        value={crowdedness}
                        onChange={(e) => setCrowdedness(e.target.value)}
                    >
                        <option value="VERY_CROWDED">매우 혼잡</option>
                        <option value="CROWDED">혼잡</option>
                        <option value="NORMAL">보통</option>
                        <option value="UNCROWDED">여유</option>
                        <option value="VERY_UNCROWDED">매우 여유</option>
                    </select>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                    />
                    <div className="button-group">
                        <button onClick={handleUpdate}>저장</button>
                        <button onClick={() => setIsEditing(false)}>취소</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="review-header">
                        <div className="review-info">
                            <span className="rating">{'★'.repeat(review.rating)}</span>
                            <span className="author">{review.userName}</span>
                            <span className="date">
                                {new Date(review.visitDateTime).toLocaleString()}
                            </span>
                            <span className="crowdedness">{review.crowdedness}</span>
                        </div>
                        <div className="review-actions">
                            <button 
                                className={`heart-button ${isLiked ? 'liked' : ''}`}
                                onClick={handleHeartToggle}
                                disabled={isLoading}
                            >
                                {isLiked ? <FaHeart /> : <FaRegHeart />}
                                <span className="heart-count">{heartCount}</span>
                            </button>
                            {isOwner && (
                                <div className="owner-actions">
                                    <button onClick={() => setIsEditing(true)}>수정</button>
                                    <button onClick={handleDelete}>삭제</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="content">{review.content}</p>
                    {review.imageUrls?.length > 0 && (
                        <div className="review-images">
                            {review.imageUrls.map((url, index) => (
                                <img 
                                    key={index} 
                                    src={url} 
                                    alt={`리뷰 ${index + 1}`}  
                                    // onClick={() => handleImageClick(url)} // 이미지 확대 보기
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


export default ReviewItem;
