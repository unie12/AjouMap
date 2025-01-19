// components/review/ReviewForm.js
import React, { useState } from 'react';
import api from '../../api/axios';

const ReviewForm = ({ storeId, onReviewSubmitted }) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (content.length < 10) {
                setError('리뷰는 10자 이상 작성해주세요.');
                return;
            }

            await api.post(`/review/store/${storeId}`, {
                content,
                rating
            });
            
            setContent('');
            setRating(5);
            setError('');
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (error) {
            setError(error.response?.data?.message || '리뷰 작성에 실패했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <div className="rating-input">
                <label>평점:</label>
                <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                >
                    {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num}점</option>
                    ))}
                </select>
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="리뷰를 작성해주세요 (10자 이상)"
                rows="4"
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">리뷰 작성</button>
        </form>
    );
};

export default ReviewForm;
