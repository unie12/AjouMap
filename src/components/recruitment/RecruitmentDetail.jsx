// components/recruitment/RecruitmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { formatDate } from '../../utils/dateUtils';
// import '../../styles/RecruitmentDetail.css';

const RecruitmentDetail = () => {
    const { storeId, recruitmentId } = useParams();
    const [recruitment, setRecruitment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecruitmentDetail();
    }, [recruitmentId]);

    const fetchRecruitmentDetail = async () => {
        try {
            const response = await api.get(`/store/${storeId}/recruitments/${recruitmentId}`);
            setRecruitment(response.data);
        } catch (err) {
            setError('구인글을 불러오는데 실패했습니다.');
            console.error('구인글 상세 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            await api.post(`/store/${storeId}/recruitments/${recruitmentId}/join`);
            fetchRecruitmentDetail();
        } catch (err) {
            console.error('참여 신청 실패:', err);
        }
    };

    const handleClose = async () => {
        if (window.confirm('구인글을 마감하시겠습니까?')) {
            try {
                await api.post(`/api/store/${storeId}/recruitments/${recruitmentId}/close`);
                fetchRecruitmentDetail();
            } catch (err) {
                console.error('구인글 마감 실패:', err);
            }
        }
    };

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!recruitment) return <div className="not-found">구인글을 찾을 수 없습니다.</div>;

    return (
        <div className="recruitment-detail">
            <div className="detail-header">
                <h2>{recruitment.title}</h2>
                <span className={`status ${recruitment.status.toLowerCase()}`}>
                    {recruitment.status === 'OPEN' ? '모집중' : '마감'}
                </span>
            </div>

            <div className="detail-content">
                <div className="info-section">
                    <p><strong>작성자:</strong> {recruitment.author.username}</p>
                    <p><strong>모집 인원:</strong> {recruitment.currentParticipants}/{recruitment.maxParticipants}명</p>
                    <p><strong>약속 시간:</strong> {formatDate(recruitment.meetingTime)}</p>
                </div>

                <div className="content-section">
                    <h3>상세 내용</h3>
                    <p>{recruitment.content}</p>
                </div>

                <div className="participants-section">
                    <h3>참여자 목록</h3>
                    <ul>
                        {recruitment.participants.map(participant => (
                            <li key={participant.id}>{participant.username}</li>
                        ))}
                    </ul>
                </div>

                <div className="action-buttons">
                    {recruitment.status === 'OPEN' && (
                        <>
                            <button 
                                className="join-button"
                                onClick={handleJoin}
                                disabled={recruitment.currentParticipants >= recruitment.maxParticipants}
                            >
                                참여하기
                            </button>
                            {recruitment.isAuthor && (
                                <button 
                                    className="close-button"
                                    onClick={handleClose}
                                >
                                    마감하기
                                </button>
                            )}
                        </>
                    )}
                    <button 
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentDetail;
