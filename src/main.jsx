import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import ModalProvider from './components/ModalProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ModalProvider>
            <App />
        </ModalProvider>
    </Provider>
);
