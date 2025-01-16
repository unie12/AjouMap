// src/components/auth/EmailVerification.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('진행중...');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/email-verification?token=${token}`);
        setVerificationStatus(response.data);
      } catch (error) {
        if (error.response?.status === 410) {
          setVerificationStatus('인증 링크가 만료되었습니다.');
        } else {
          setVerificationStatus('인증 실패');
        }
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const handleResendEmail = async () => {
    try {
      const email = prompt('이메일을 입력해주세요:');
      if (email) {
        await api.post('/auth/email-verification/resend', email);
        alert('새로운 인증 이메일이 발송되었습니다.');
      }
    } catch (error) {
      alert('이메일 재발송 실패');
    }
  };

  return (
    <div>
      <h2>이메일 인증</h2>
      <p>{verificationStatus}</p>
      {verificationStatus.includes('만료') && (
        <button onClick={handleResendEmail}>인증 메일 재발송</button>
      )}
    </div>
  );
};
