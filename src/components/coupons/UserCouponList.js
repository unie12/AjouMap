// src/components/coupons/UserCouponList.js
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export const UserCouponList = () => {
  const [userCoupons, setUserCoupons] = useState([]);

  useEffect(() => {
    const fetchUserCoupons = async () => {
      try {
        const response = await api.get('/userCoupons');
        setUserCoupons(response.data);
      } catch (error) {
        alert('보유 쿠폰 조회 실패');
      }
    };
    fetchUserCoupons();
  }, []);

  const handleUseCoupon = async (userCouponId) => {
    try {
      await api.post(`/userCoupons/${userCouponId}/use`);
      alert('쿠폰이 사용되었습니다.');
      // 쿠폰 목록 새로고침
      const response = await api.get('/userCoupons');
      setUserCoupons(response.data);
    } catch (error) {
      alert('쿠폰 사용 실패');
    }
  };

  return (
    <div>
      <h2>보유 쿠폰 목록</h2>
      {userCoupons.map(coupon => (
        <div key={coupon.id}>
          <h3>{coupon.couponTemplate.name}</h3>
          <p>발급일: {new Date(coupon.issuedAt).toLocaleString()}</p>
          <p>상태: {coupon.status}</p>
          {coupon.usedAt && <p>사용일: {new Date(coupon.usedAt).toLocaleString()}</p>}
          <p>할인: {coupon.couponTemplate.discountAmount}
            {coupon.couponTemplate.discountType === 'PERCENTAGE' ? '%' : '원'}
          </p>
          {coupon.status === 'AVAILABLE' && (
            <button onClick={() => handleUseCoupon(coupon.id)}>
              쿠폰 사용하기
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserCouponList;
