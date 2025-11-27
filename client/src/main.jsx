import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // <-- Essential: For global user state and authentication
import { ToastContainer } from 'react-toastify';    // <-- Essential: For showing success/error messages
import 'react-toastify/dist/ReactToastify.css';       // <-- Import toastify styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. BrowserRouter enables client-side routing */}
    <BrowserRouter>
      {/* 2. AuthProvider wraps the whole app to manage user state */}
      <AuthProvider> 
        <App />
      </AuthProvider>
      {/* 3. ToastContainer is placed outside the app/router to handle notifications */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </BrowserRouter>
  </React.StrictMode>,
);