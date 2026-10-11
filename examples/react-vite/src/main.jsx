import React from 'react';
import {createRoot} from 'react-dom/client';
import Reader from './Reader.jsx';
import './styles.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><Reader /></React.StrictMode>);
