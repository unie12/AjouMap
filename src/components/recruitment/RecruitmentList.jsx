import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import RecruitmentForm from './RecruitmentForm';
import { formatDate } from '../../utils/dateUtils';
import '../../styles/RecruitmentList.css';

const RecruitmentList = () => {
    const { storeId } = useParams();
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecruitments();
    }, [storeId, page]);

    const fetchRecruitments = async () => {
        try {
            const response = await api.get(`/store/${storeId}/recruitments`, {
                params: {
                    page,
                    size: 10
                }
            });
            setRecruitments(prev => 
                page === 0 ? response.data.content : [...prev, ...response.data.content]
            );
        } catch (err) {
            setError('구인글을 불러오는데 실패했습니다.');
            console.error('구인글 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (recruitmentId) => {
        try {
            await api.post(`/store/${storeId}/recruitments/${recruitmentId}/join`);
            fetchRecruitments();
        } catch (err) {
            console.error('참여 신청 실패:', err);
        }
    };

    return (
        <div className="recruitment-container">
            <div className="recruitment-header">
                <h2>밥친구 구인글</h2>
                <button 
                    className="create-button"
                    onClick={() => setShowForm(true)}
                >
                    구인글 작성
                </button>
            </div>

            {showForm && (
                <RecruitmentForm 
                    storeId={storeId}
                    onSuccess={(newRecruitment) => {
                        setRecruitments(prev => [newRecruitment, ...prev]);
                        setShowForm(false);
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div className="recruitment-list">
                {recruitments.map(recruitment => (
                    <div key={recruitment.id} className="recruitment-card">
                        <div className="card-header">
                            <h3>{recruitment.title}</h3>
                            <span className={`status ${recruitment.status.toLowerCase()}`}>
                                {recruitment.status === 'OPEN' ? '모집중' : '마감'}
                            </span>
                        </div>
                        
                        <div className="card-content">
                            <p>{recruitment.content}</p>
                            <div className="recruitment-info">
                                <span>
                                    <i className="fas fa-users"></i>
                                    {recruitment.currentParticipants}/{recruitment.maxParticipants}명
                                </span>
                                <span>
                                    <i className="far fa-clock"></i>
                                    {formatDate(recruitment.meetingTime)}
                                </span>
                            </div>
                        </div>

                        <div className="card-footer">
                            {recruitment.status === 'OPEN' && (
                                <button 
                                    className="join-button"
                                    onClick={() => handleJoin(recruitment.id)}
                                >
                                    참여하기
                                </button>
                            )}
                            <button 
                                className="detail-button"
                                onClick={() => navigate(`/store/${storeId}/recruitments/${recruitment.id}`)}
                            >
                                상세보기
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && recruitments.length > 0 && (
                <button 
                    className="load-more"
                    onClick={() => setPage(prev => prev + 1)}
                >
                    더 보기
                </button>
            )}
        </div>
    );
};

export default RecruitmentList;
