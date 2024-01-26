import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { StoreProvider } from 'easy-peasy';
// import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        {/* <StoreProvider store={store}> */}
            <BrowserRouter>
                <Routes>
                    <Route path='/*' element={<App />} />
                </Routes>
            </BrowserRouter>
        {/* </StoreProvider> */}
    </React.StrictMode>
);