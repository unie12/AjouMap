
// components/recruitment/MyRecruitmentsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { formatDate } from '../../utils/dateUtils';
import '../../styles/RecruitmentList.css';

const MyRecruitmentsList = () => {
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyRecruitments();
    }, [currentPage]);

    const fetchMyRecruitments = async () => {
        try {
            const response = await api.get('/user-activity/recruitment/my', {
                params: {
                    page: currentPage,
                    size: 10
                }
            });
            setRecruitments(response.data.content);
        } catch (error) {
            setError('내 구인글을 불러오는데 실패했습니다.');
            console.error('내 구인글 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecruitmentClick = (storeId, recruitmentId) => {
        navigate(`/store/${storeId}/recruitments/${recruitmentId}`);
    };

    const handleClose = async (recruitment) => {
        try {
            await api.post(`/store/${recruitment.storeId}/recruitments/${recruitment.id}/close`);
            fetchMyRecruitments();
        } catch (error) {
            console.error('구인글 마감 실패:', error);
        }
    };
    
    const handleDelete = async (recruitment) => {
        if (window.confirm('정말로 이 구인글을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/store/${recruitment.storeId}/recruitments/${recruitment.id}`);
                fetchMyRecruitments();
            } catch (error) {
                console.error('구인글 삭제 실패:', error);
            }
        }
    };

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!recruitments.length) return <div className="no-data">작성한 구인글이 없습니다.</div>;

    return (
        <div className="recruitments-list">
            {recruitments.map(recruitment => (
                <div key={recruitment.id} className="recruitment-card">
                    <div 
                        className="recruitment-content"
                        onClick={() => handleRecruitmentClick(recruitment.storeId, recruitment.id)}
                    >
                        <h3>{recruitment.title}</h3>
                        <div className="recruitment-info">
                            <span>가게: {recruitment.placeName}</span>
                            <span>모집 인원: {recruitment.currentParticipants}/{recruitment.maxParticipants}</span>
                            <span>약속 시간: {formatDate(recruitment.meetingTime)}</span>
                            <span className={`status ${recruitment.status.toLowerCase()}`}>
                                {recruitment.status}
                            </span>
                        </div>
                    </div>
                    <div className="recruitment-actions">
                        {recruitment.status === 'OPEN' && (
                            <>
                                <button 
                                    onClick={() => handleClose(recruitment)}
                                    className="close-button"
                                >
                                    마감하기
                                </button>
                                <button 
                                    onClick={() => handleDelete(recruitment)}
                                    className="delete-button"
                                >
                                    삭제하기
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyRecruitmentsList;