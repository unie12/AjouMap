import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const UserActivity = () => {
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await api.get('/user-activity/summary');
                setActivity(response.data);
            } catch (err) {
                setError('활동 내역을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!activity) return <div>활동 내역이 없습니다.</div>;

    return (
        <div className="user-activity">
            <h2>내 활동 내역</h2>
            <h3>내 리뷰</h3>
            <ul>
                {activity.reviews.map(review => (
                    <li key={review.id}>
                        {review.storeName} - 평점: {review.rating}
                    </li>
                ))}
            </ul>
            <h3>찜한 가게</h3>
            <ul>
                {activity.favorites.map(favorite => (
                    <li key={favorite.id}>{favorite.placeName}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserActivity;
