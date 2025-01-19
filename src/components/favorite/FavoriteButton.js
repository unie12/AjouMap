import React, { useState } from 'react';
import api from '../../api/axios';

const FavoriteButton = ({ storeId, initialIsFavorite, onFavoriteChange }) => {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    const toggleFavorite = async () => {
        try {
            const response = await api.post(`/favorite/${storeId}`);
            // 응답에 id가 있으면 찜한 상태, 없으면 찜하지 않은 상태
            const newFavoriteStatus = response.data.id != null;
            setIsFavorite(newFavoriteStatus);
            if (onFavoriteChange) {
                onFavoriteChange(newFavoriteStatus);
            }
        } catch (error) {
            console.error('Favorite toggle failed:', error);
        }
    };

    return (
        <button onClick={toggleFavorite}>
            {isFavorite ? '찜 취소' : '찜하기'}
        </button>
    );
};

export default FavoriteButton;
