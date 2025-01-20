import React, { useState } from 'react';
import api from '../../api/axios';
import '../../styles/ReviewForm.css'; 

const ReviewForm = ({ storeId, onReviewSubmitted }) => {
    const [formData, setFormData] = useState({
        content: '',
        rating: 5,
        visitDateTime: '',
        crowdedness: 'NORMAL'
    });
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? Number(value) : value
        }));
    };

    const validateForm = () => {
        if (!formData.content.trim()) {
            throw new Error('리뷰 내용을 입력해주세요.');
        }
        if (formData.rating < 1 || formData.rating > 5) {
            throw new Error('평점은 1-5 사이여야 합니다.');
        }
        if (!formData.visitDateTime) {
            throw new Error('방문 일시를 선택해주세요.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        try {
            validateForm();
    
            // ReviewRequest 객체를 직접 생성
            const reviewRequest = {
                content: formData.content,
                rating: formData.rating,
                visitDateTime: formData.visitDateTime,
                crowdedness: formData.crowdedness
            };
    
            const formDataToSend = new FormData();
            // JSON 문자열이 아닌 일반 문자열로 각 필드를 추가
            Object.entries(reviewRequest).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
    
            images.forEach(image => {
                formDataToSend.append('images', image);
            });
    
            await api.post(`/review/store/${storeId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFormData({
                content: '',
                rating: 5,
                visitDateTime: '',
                crowdedness: 'NORMAL'
            });
            setImages([]);
            onReviewSubmitted?.();

        } catch (error) {
            setError(error.message || '리뷰 작성에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const compressImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 400;
                    canvas.height = 400;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 400, 400);
                    
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        }));
                    }, 'image/jpeg', 0.9);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };
    
    
    
    
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            setError('이미지는 최대 5개까지만 업로드 가능합니다.');
            return;
        }
    
        setIsLoading(true);
        try {
            const compressedImages = await Promise.all(
                files.map(async (file) => {
                    if (!file.type.startsWith('image/')) {
                        throw new Error('이미지 파일만 업로드 가능합니다.');
                    }
                    return await compressImage(file);
                })
            );
            setImages(compressedImages);
            setError('');
        } catch (err) {
            setError(err.message || '이미지 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="review-form-container">
            <h2 className="form-title">리뷰 작성</h2>
            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">평점</label>
                        <div className="rating-select">
                            {[5, 4, 3, 2, 1].map(num => (
                                <label key={num} className="rating-option">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={num}
                                        checked={formData.rating === num}
                                        onChange={handleInputChange}
                                    />
                                    <span className="rating-star">{'★'.repeat(num)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">방문 일시</label>
                        <input 
                            type="datetime-local" 
                            name="visitDateTime"
                            value={formData.visitDateTime} 
                            onChange={handleInputChange} 
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">혼잡도</label>
                        <select 
                            name="crowdedness"
                            value={formData.crowdedness} 
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="VERY_CROWDED">매우 혼잡</option>
                            <option value="CROWDED">혼잡</option>
                            <option value="NORMAL">보통</option>
                            <option value="UNCROWDED">여유</option>
                            <option value="VERY_UNCROWDED">매우 여유</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">리뷰 내용</label>
                    <textarea 
                        name="content"
                        value={formData.content} 
                        onChange={handleInputChange} 
                        placeholder="매장에 대한 솔직한 리뷰를 작성해주세요."
                        rows="4" 
                        className="form-textarea"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">이미지 첨부</label>
                    <div className="file-input-wrapper">
                        <input 
                            type="file" 
                            multiple 
                            onChange={handleImageChange} 
                            accept="image/*"
                            className="form-file-input"
                            id="file-input"
                        />
                        <label htmlFor="file-input" className="file-input-label">
                            이미지 선택하기 (최대 5개)
                        </label>
                    </div>
                    {images.length > 0 && (
                        <div className="selected-files">
                            선택된 파일: {images.length}개
                        </div>
                    )}
                </div>

                {error && <p className="error-message">{error}</p>}
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="submit-button"
                >
                    {isLoading ? (
                        <span className="loading-spinner">처리중...</span>
                    ) : (
                        '리뷰 작성'
                    )}
                </button>
            </form>
        </div>
    );
};


export default ReviewForm;
