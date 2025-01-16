// src/components/coupons/CouponEventCreate.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DateTimePicker from 'react-datetime-picker';

export const CouponEventCreate = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [couponEventData, setCouponEventData] = useState({
    eventName: '',
    startTime: new Date(),
    endTime: new Date(),
    validityEndTime: new Date()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...couponEventData,
        startTime: couponEventData.startTime.toISOString(),
        endTime: couponEventData.endTime.toISOString(),
        validityEndTime: couponEventData.validityEndTime.toISOString()
      };

      await api.post(`/events/${eventId}/coupons`, formattedData);
      alert('쿠폰 이벤트가 생성되었습니다.');
      navigate(`/events/${eventId}/coupons`);
    } catch (error) {
      alert('쿠폰 이벤트 생성 실패: ' + (error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'));
    }
  };

  return (
    <div>
      <h2>쿠폰 이벤트 생성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이벤트 이름</label>
          <input
            type="text"
            value={couponEventData.eventName}
            onChange={(e) => setCouponEventData({...couponEventData, eventName: e.target.value})}
            required
          />
        </div>
        <div>
          <label>시작 시간</label>
          <DateTimePicker
            value={couponEventData.startTime}
            onChange={(date) => setCouponEventData({...couponEventData, startTime: date})}
            required
          />
        </div>
        <div>
          <label>종료 시간</label>
          <DateTimePicker
            value={couponEventData.endTime}
            onChange={(date) => setCouponEventData({...couponEventData, endTime: date})}
            required
          />
        </div>
        <div>
          <label>쿠폰 유효 기간</label>
          <DateTimePicker
            value={couponEventData.validityEndTime}
            onChange={(date) => setCouponEventData({...couponEventData, validityEndTime: date})}
            required
          />
        </div>
        <button type="submit">쿠폰 이벤트 생성</button>
      </form>
    </div>
  );
};

export default CouponEventCreate;