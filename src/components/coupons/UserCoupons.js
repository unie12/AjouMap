// src/components/coupons/UserCoupons.js
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export const UserCoupons = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchUserCoupons = async () => {
      try {
        const response = await api.get('/userCoupons');
        setCoupons(response.data);
      } catch (error) {
        console.error('쿠폰 로딩 실패');
      }
    };
    fetchUserCoupons();
  }, []);

  const handleIssueCoupon = async (templateId) => {
    try {
      await api.post(`/userCoupons/${templateId}/issue`);
    } catch (error) {
      alert('쿠폰 발급 실패');
    }
  };

  const handleUseCoupon = async (userCouponId) => {
    try {
      await api.post(`/userCoupons/${userCouponId}/use`);
    } catch (error) {
      alert('쿠폰 사용 실패');
    }
  };

  return (
    <div>
      {coupons.map(coupon => (
        <div key={coupon.id}>
          <p>{coupon.name}</p>
          <button onClick={() => handleUseCoupon(coupon.id)}>
            쿠폰 사용하기
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserCoupons;
