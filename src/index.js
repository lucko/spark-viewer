import './style/base.scss';
import './style/page.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import SparkRoot from './SparkRoot';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <SparkRoot />
    </React.StrictMode>
);
