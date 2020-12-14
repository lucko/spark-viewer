import React from 'react';
import ReactDOM from 'react-dom';
import './spark-base.css';
import './themes/spark.css';
import SparkRoot from './SparkRoot';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <SparkRoot />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
