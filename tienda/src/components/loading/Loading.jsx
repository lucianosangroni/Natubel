import React, { useEffect } from "react";
import './loading.css'

const Loading = () => {
    useEffect(() => {
        // Añadir clase al body para deshabilitar scroll
        document.body.classList.add('loading');

        return () => {
            // Eliminar clase al desmontar el componente
            document.body.classList.remove('loading');
        };
    }, []);

    return (
        <div className="loading-overlay">
            <div className="loading-blocker"></div>
            <div className="loading-content">
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
};

export default Loading;