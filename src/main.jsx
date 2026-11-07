import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
if(import.meta.env.DEV&&new URLSearchParams(location.search).has('perf'))import('./dev/performance-lab');
import './studio.css';
import './kinetic.css';
import './interaction.css';
import './photography.css';
import './cinema-covers.css';

createRoot(document.getElementById('root')).render(<App />);
