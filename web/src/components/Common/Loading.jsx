import React from 'react';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-blocker"></div>
            <div className="loading-content">
                <div className="loading-spinner"></div>
                <div className="loading-text">Cargando...</div>
            </div>
        </div>
    );
};

export default Loading;