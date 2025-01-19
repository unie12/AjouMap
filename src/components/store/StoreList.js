import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../favorite/FavoriteButton';

const StoreList = ({ stores, onFavoriteChange }) => {
    return (
        <div className="store-list">
            {stores.map((store) => (
                <div key={store.id} className="store-item">
                    <div className="store-info">
                        <h3>{store.placeName}</h3>
                        <p>{store.addressName}</p>
                        <div className="store-actions">
                            <Link
                                to={`/store/${store.id}`}
                                className="view-details"
                            >
                                상세 정보 보기
                            </Link>
                            <a
                                href={store.placeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="kakao-link"
                            >
                                카카오맵에서 보기
                            </a>
                            <FavoriteButton 
                                storeId={store.id} 
                                initialIsFavorite={store.favorite} 
                                onFavoriteChange={(newStatus) => onFavoriteChange(store.id, newStatus)}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StoreList;
