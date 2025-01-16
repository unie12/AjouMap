// src/components/coupons/CouponEventList.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios';

export const CouponEventList = () => {
  const { eventId } = useParams();
  const [couponEvents, setCouponEvents] = useState([]);

  useEffect(() => {
    const fetchCouponEvents = async () => {
      try {
        const response = await api.get(`/events/${eventId}/coupons`);
        setCouponEvents(response.data);
      } catch (error) {
        alert('쿠폰 이벤트 목록 조회 실패');
      }
    };
    fetchCouponEvents();
  }, [eventId]);

  return (
    <div>
      <h2>쿠폰 이벤트 목록</h2>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/events/${eventId}/coupons/create`}>
          새 쿠폰 이벤트 생성
        </Link>
      </div>
      <div style={{ display: 'grid', gap: '20px' }}>
        {couponEvents.map(couponEvent => (
          <div key={couponEvent.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>{couponEvent.eventName}</h3>
            <p>시작: {new Date(couponEvent.startTime).toLocaleString()}</p>
            <p>종료: {new Date(couponEvent.endTime).toLocaleString()}</p>
            <p>유효기간: {new Date(couponEvent.validityEndTime).toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/events/${eventId}/coupons/${couponEvent.id}/templates`}>
                쿠폰 템플릿 목록
              </Link>
              <Link to={`/events/${eventId}/coupons/${couponEvent.id}/templates/create`}>
                쿠폰 템플릿 생성
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponEventList;