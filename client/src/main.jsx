import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/auth.css';
import '../css/inputWithButton.css';
import '../css/dashboard.css';
import '../css/room.css';
import '../css/chat.css';
import '../css/button.css';
import '../css/player.css';
import '../css/mainpage.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    // </React.StrictMode>
);
