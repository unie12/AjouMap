// src/components/events/EventCreate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DateTimePicker from 'react-datetime-picker';

const EventCreate = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: '',
    totalSeats: 0,
    startTime: new Date(),
    endTime: new Date()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...eventData,
        startTime: eventData.startTime.toISOString(),
        endTime: eventData.endTime.toISOString()
      };
      await api.post('/events', formattedData);
      alert('이벤트가 생성되었습니다.');
      navigate('/events');
    } catch (error) {
      alert('이벤트 생성 실패');
    }
  };

  return (
    <div>
      <h2>이벤트 생성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이벤트 이름</label>
          <input
            type="text"
            value={eventData.name}
            onChange={(e) => setEventData({...eventData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <label>총 좌석 수</label>
          <input
            type="number"
            min="1"
            value={eventData.totalSeats}
            onChange={(e) => setEventData({...eventData, totalSeats: parseInt(e.target.value)})}
            required
          />
        </div>
        <div>
          <label>시작 시간</label>
          <DateTimePicker
            value={eventData.startTime}
            onChange={(date) => setEventData({...eventData, startTime: date})}
            required
          />
        </div>
        <div>
          <label>종료 시간</label>
          <DateTimePicker
            value={eventData.endTime}
            onChange={(date) => setEventData({...eventData, endTime: date})}
            required
          />
        </div>
        <button type="submit">이벤트 생성</button>
      </form>
    </div>
  );
};

export default EventCreate;
