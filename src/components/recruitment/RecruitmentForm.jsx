import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import api from '../../api/axios';
// import '../../styles/RecruitmentForm.css';

const RecruitmentForm = ({ storeId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        maxParticipants: 2,
        meetingTime: new Date(Date.now() + 3600000)
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post(`/store/${storeId}/recruitments`, formData);
            onSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.message || '구인글 작성에 실패했습니다.');
            console.error('구인글 작성 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="recruitment-form">
            <div className="form-group">
                <label htmlFor="title">제목</label>
                <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="제목을 입력하세요"
                    required
                    maxLength={50}
                />
            </div>

            <div className="form-group">
                <label htmlFor="content">내용</label>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="내용을 입력하세요"
                    required
                    maxLength={500}
                />
            </div>

            <div className="form-group">
                <label htmlFor="maxParticipants">모집 인원</label>
                <input
                    id="maxParticipants"
                    type="number"
                    min="2"
                    max="10"
                    value={formData.maxParticipants}
                    onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                    required
                />
            </div>

            <div className="form-group">
                <label>약속 시간</label>
                <DateTimePicker
                    onChange={date => setFormData({...formData, meetingTime: date})}
                    value={formData.meetingTime}
                    minDate={new Date()}
                    format="y-MM-dd HH:mm"
                    className="datetime-picker"
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-buttons">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="submit-button"
                >
                    {loading ? '작성 중...' : '작성하기'}
                </button>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="cancel-button"
                    disabled={loading}
                >
                    취소
                </button>
            </div>
        </form>
    );
};

export default RecruitmentForm;
