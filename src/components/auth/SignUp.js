// src/components/auth/SignUp.js
import React, { useState } from 'react';
import api from '../../api/axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signup', formData);
      alert(response.data);
    } catch (error) {
      alert(error.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>사용자명</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            minLength={3}
            maxLength={50}
          />
        </div>
        <div>
          <label>이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            minLength={8}
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;
