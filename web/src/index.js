import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import { DataProviderAdmin } from './context/DataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <DataProviderAdmin>
    <App />
  </DataProviderAdmin>
  // </React.StrictMode>
);

reportWebVitals();
