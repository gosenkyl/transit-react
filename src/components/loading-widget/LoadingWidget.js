import React from 'react';

import './LoadingWidget.css';

export default function LoadingWidget(props) {
    return (
        <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
    )
}