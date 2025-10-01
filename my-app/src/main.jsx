import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
 
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
) 
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("✅ Service Worker registered:", reg);
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  });
}


 