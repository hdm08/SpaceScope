import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'
import App from './App.jsx'
import ToasterOption from './components/ToasterOption.jsx';
import { CacheProvider } from './components/CacheProvider.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
    <CacheProvider>
     <BrowserRouter>
     <ToasterOption/>
        <App />
       
    </BrowserRouter>
    </CacheProvider>
    </AuthProvider>

  </StrictMode>,
)
