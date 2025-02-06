// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import { EmailVerification } from './components/auth/EmailVerification';
import { EventList } from './components/events/EventList';
import EventCreate from './components/events/EventCreate';
import { CouponEventList } from './components/coupons/CouponEventList';
import { CouponEventCreate } from './components/coupons/CouponEventCreate';
import { CouponTemplateList } from './components/coupons/CouponTemplateList';
import { CouponTemplateCreate } from './components/coupons/CouponTemplateCreate';
import { UserCouponList } from './components/coupons/UserCouponList';
import KakaoMap from './components/store/KakaoMap';
import StoreDetail from './components/store/StoreDetail';
import UserActivity from './components/user/UserActivity';
import Analytics from './components/analytics/Analytics';
import RecruitmentList from './components/recruitment/RecruitmentList';
import RecruitmentDetail from './components/recruitment/RecruitmentDetail';


import 'react-datetime-picker/dist/DateTimePicker.css';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <nav style={{
            background: '#333',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              gap: '2rem',
              margin: 0,
              padding: 0
            }}>
              <li>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                  홈
                </Link>
              </li>
              <li>
                <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>
                  이벤트 목록
                </Link>
              </li>
              <li>
                <Link to="/events/create" style={{ color: 'white', textDecoration: 'none' }}>
                  이벤트 생성
                </Link>
              </li>
              <li>
                <Link to="/my-coupons" style={{ color: 'white', textDecoration: 'none' }}>
                  내 쿠폰
                </Link>
              </li>
              <li>
                <Link to="/my-activity" style={{ color: 'white', textDecoration: 'none' }}>
                  내 활동
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                  로그인
                </Link>
              </li>
              <li>
                <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>
                  회원가입
                </Link>
              </li>
              <li>
                <Link to="/map" style={{ color: 'white', textDecoration: 'none' }}>
                  지도 검색
                </Link>
              </li>

              <li>
                <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>
                    실시간 인기
                </Link>
            </li>
            </ul>
          </nav>

          <main style={{ padding: '20px' }}>
            <Routes>
              {/* 인증 관련 라우트 */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/email-verification" element={<EmailVerification />} />

              {/* 이벤트 관련 라우트 */}
              <Route path="/events" element={<EventList />} />
              <Route path="/events/create" element={<EventCreate />} />

              {/* 쿠폰 이벤트 관련 라우트 */}
              <Route path="/events/:eventId/coupons" element={<CouponEventList />} />
              <Route path="/events/:eventId/coupons/create" element={<CouponEventCreate />} />

              {/* 쿠폰 템플릿 관련 라우트 */}
              <Route
                path="/events/:eventId/coupons/:couponEventId/templates"
                element={<CouponTemplateList />}
              />
              <Route
                path="/events/:eventId/coupons/:couponEventId/templates/create"
                element={<CouponTemplateCreate />}
              />

              {/* 사용자 쿠폰 관련 라우트 */}
              <Route path="/my-coupons" element={<UserCouponList />} />
              <Route path="/my-activity" element={<UserActivity />} />

              {/* 카카오맵 라우트 */}
              <Route path="/map/*" element={<KakaoMap />} />
              <Route path="/store/:storeId" element={<StoreDetail />} />

              <Route path="/analytics" element={<Analytics />} />

               {/* 밥친구 구인 관련 라우트 */}
              <Route path="/store/:storeId/recruitments" element={<RecruitmentList />} />
              <Route path="/store/:storeId/recruitments/:recruitmentId" element={<RecruitmentDetail />} />


              {/* 홈 페이지와 404 페이지 */}
              <Route path="/" element={<EventList />} />
              <Route
                path="*"
                element={
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>페이지를 찾을 수 없습니다.</h2>
                    <Link
                      to="/"
                      style={{
                        color: '#007bff',
                        textDecoration: 'none'
                      }}
                    >
                      홈으로 돌아가기
                    </Link>
                  </div>
                }
              />
            </Routes>
          </main>

          <footer style={{
            marginTop: '2rem',
            padding: '1rem',
            textAlign: 'center',
            borderTop: '1px solid #eee'
          }}>
            <p>&copy; 2024 티켓팅 시스템. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
