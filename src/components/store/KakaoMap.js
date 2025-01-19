import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import StoreList from './StoreList';
import StoreDetail from './StoreDetail';
import api from '../../api/axios';
import '../../styles/Store.css';

const KakaoMap = () => {
    const [keyword, setKeyword] = useState('');
    const [stores, setStores] = useState([]);
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState({ latitude: 37.28295252865072, longitude: 127.04354383208234 });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('위치 정보를 가져오는 데 실패했습니다:', error);
                }
            );
        } else {
            console.error('이 브라우저에서는 Geolocation이 지원되지 않습니다.');
        }
    }, []);

    useEffect(() => {
        const initMap = () => {
            if (window.kakao && window.kakao.maps) {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude),
                    level: 3
                };
                const kakaoMap = new window.kakao.maps.Map(container, options);
                setMap(kakaoMap);
            }
        };

        if (window.kakao && window.kakao.maps) {
            initMap();
        } else {
            const script = document.createElement('script');
            script.onload = initMap;
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=845f34c8a1684bba09b89c37a71eb9ee&libraries=services`;
            document.head.appendChild(script);
        }
    }, [userLocation]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get('/store/search', {
                params: { keyword, latitude: userLocation.latitude, longitude: userLocation.longitude },
            });
            setStores(response.data);
            displayMarkers(response.data);
        } catch (error) {
            console.error('가게 정보를 가져오는 데 실패했습니다:', error);
        }
    };

    const displayMarkers = (stores) => {
        if (!map || !window.kakao || !window.kakao.maps) return;

        // 기존 마커들을 제거
        map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);  

        const bounds = new window.kakao.maps.LatLngBounds();
        const infowindow = new window.kakao.maps.InfoWindow({zIndex:1});

        stores.forEach((store) => {
            const markerPosition = new window.kakao.maps.LatLng(store.y, store.x);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                map: map,
            });

            bounds.extend(markerPosition);

            window.kakao.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(`
                    <div style="padding:5px;font-size:12px;">
                        ${store.placeName}<br>
                        ${store.addressName}
                    </div>
                `);
                infowindow.open(map, marker);
            });
        });

        // 모든 마커가 보이도록 지도 범위 재설정
        map.setBounds(bounds);
    };

    const handleFavoriteChange = (storeId, newStatus) => {
        setStores(prevStores => 
            prevStores.map(store => 
                store.id === storeId ? {...store, favorite: newStatus} : store
            )
        );
    };

    return (
        <div>
            <h1>음식점 검색</h1>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px' }}>검색</button>
            </form>

            <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>

            <Routes>
                <Route path="/" element={<StoreList stores={stores} onFavoriteChange={handleFavoriteChange} />} />
                <Route path="/store/:storeId" element={<StoreDetail />} />
            </Routes>
        </div>
    );
};

export default KakaoMap;