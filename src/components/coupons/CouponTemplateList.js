import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios';

export const CouponTemplateList = () => {
  const { eventId, couponEventId } = useParams();
  const [templates, setTemplates] = useState([]);
  const [issuingStatus, setIssuingStatus] = useState({});

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get(`/coupons/${couponEventId}/templates`);
        setTemplates(response.data);
      } catch (error) {
        alert('쿠폰 템플릿 목록 조회 실패');
      }
    };
    fetchTemplates();
  }, [couponEventId]);

  const handleIssueCoupon = async (templateId) => {
    setIssuingStatus(prev => ({ ...prev, [templateId]: true }));
    try {
      await api.post(`/userCoupons/${templateId}/issue`);
      alert('쿠폰이 발급되었습니다');
      // 쿠폰 발급 후 목록 새로고침
      const response = await api.get(`/coupons/${couponEventId}/templates`);
      setTemplates(response.data);
    } catch (error) {
      if (error.response?.status === 409) {
        alert('이미 발급받은 쿠폰입니다');
      } else if (error.response?.status === 404) {
        alert('존재하지 않는 쿠폰입니다');
      } else if (error.response?.status === 400) {
        alert('쿠폰이 모두 소진되었습니다');
      } else {
        alert('쿠폰 발급 중 오류가 발생했습니다');
      }
    } finally {
      setIssuingStatus(prev => ({ ...prev, [templateId]: false }));
    }
  };

  return (
    <div>
      <h2>쿠폰 템플릿 목록</h2>
      <div style={{ marginBottom: '20px' }}>
        <Link
          to={`/events/${eventId}/coupons/${couponEventId}/templates/create`}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          새 쿠폰 템플릿 생성
        </Link>
      </div>
      <div style={{ display: 'grid', gap: '20px' }}>
        {templates.map(template => (
          <div
            key={template.id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: template.owned ? '#f0f8ff' : 'white', // 보유한 쿠폰은 다른 배경색
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3>{template.name}</h3>
            <p>할인: {template.discountAmount}{template.discountType === 'PERCENTAGE' ? '%' : '원'}</p>
            <p>총 수량: {template.totalQuantity}</p>
            <p>남은 수량: {template.remaining}</p>
            <p>가중치: {template.weight}</p>
            <p>유효기간 종료일: {new Date(template.validityEndTime).toLocaleString()}</p>
            {template.owned ? ( // 여기서 owned를 사용
              <p style={{ color: '#28a745', fontWeight: 'bold' }}>이미 보유한 쿠폰</p>
            ) : (
              <button
                onClick={() => handleIssueCoupon(template.id)}
                disabled={issuingStatus[template.id] || template.remaining === 0}
                style={{
                  padding: '8px 16px',
                  backgroundColor:
                    template.remaining === 0 ? '#ccc' :
                    issuingStatus[template.id] ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor:
                    issuingStatus[template.id] || template.remaining === 0 ?
                    'not-allowed' :
                    'pointer'
                }}
              >
                {template.remaining === 0 ? '소진됨' :
                 issuingStatus[template.id] ? '발급 중...' :
                 '쿠폰 발급받기'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponTemplateList;
