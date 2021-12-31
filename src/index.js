import './style/base.scss';
import './style/page.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import SparkRoot from './SparkRoot';

ReactDOM.render(
    <React.StrictMode>
        <SparkRoot />
    </React.StrictMode>,
    document.getElementById('root')
);
