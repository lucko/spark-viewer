import React from 'react';

export default function BannerNotice({ children, style = {} }) {
    return (
        <div className="banner-notice" style={style}>
            {children}
        </div>
    );
}
