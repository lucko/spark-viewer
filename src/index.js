import React from 'react';
import ReactDOM from 'react-dom';
import SparkRoot from './SparkRoot';

import './style/base.scss';
import './style/page.scss';

ReactDOM.render(
    <React.StrictMode>
        <SparkRoot />
    </React.StrictMode>,
    document.getElementById('root')
);
