// src/components/coupons/CouponTemplateCreate.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export const CouponTemplateCreate = () => {
  const { eventId, couponEventId } = useParams();
  const navigate = useNavigate();
  const [templateData, setTemplateData] = useState({
    name: '',
    weight: 1,
    totalQuantity: 0,
    discountAmount: 0,
    discountType: 'FIXED_AMOUNT'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/coupons/${couponEventId}/templates`, templateData);
      alert('쿠폰 템플릿이 생성되었습니다.');
      navigate(`/events/${eventId}/coupons/${couponEventId}/templates`);
    } catch (error) {
      alert('쿠폰 템플릿 생성 실패: ' + (error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>쿠폰 템플릿 생성</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>템플릿 이름</label>
          <input
            type="text"
            value={templateData.name}
            onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>가중치</label>
          <input
            type="number"
            min="1"
            value={templateData.weight}
            onChange={(e) => setTemplateData({...templateData, weight: parseInt(e.target.value)})}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>총 수량</label>
          <input
            type="number"
            min="1"
            value={templateData.totalQuantity}
            onChange={(e) => setTemplateData({...templateData, totalQuantity: parseInt(e.target.value)})}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>할인 유형</label>
          <select
            value={templateData.discountType}
            onChange={(e) => setTemplateData({...templateData, discountType: e.target.value})}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="FIXED_AMOUNT">정액</option>
            <option value="PERCENTAGE">정률</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>할인 {templateData.discountType === 'FIXED_AMOUNT' ? '금액' : '비율'}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="number"
              min="0"
              value={templateData.discountAmount}
              onChange={(e) => setTemplateData({...templateData, discountAmount: parseInt(e.target.value)})}
              required
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
            />
            <span>{templateData.discountType === 'FIXED_AMOUNT' ? '원' : '%'}</span>
          </div>
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          쿠폰 템플릿 생성
        </button>
      </form>
    </div>
  );
};

export default CouponTemplateCreate;
