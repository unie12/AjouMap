// src/components/events/EventList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
//              const response = await api.get('/api/events');  // '/api' 추가
        setEvents(response.data);
      } catch (error) {
        alert('이벤트 목록 조회 실패');
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>이벤트 목록</h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {events.map(event => (
          <div key={event.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>{event.name}</h3>
            <p>총 좌석: {event.totalSeats}</p>
            <p>남은 좌석: {event.remainingSeats}</p>
            <p>시작: {new Date(event.startTime).toLocaleString()}</p>
            <p>종료: {new Date(event.endTime).toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/events/${event.id}/coupons`}>쿠폰 이벤트 목록</Link>
              <Link to={`/events/${event.id}/coupons/create`}>쿠폰 이벤트 생성</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
