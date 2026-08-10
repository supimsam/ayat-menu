import React from 'react'
import ReactDOM from 'react-dom/client'
import AyatMenu from './AyatMenu.jsx'
import QRCard from './QRCard.jsx'

const isQR = window.location.pathname.replace(/\/$/, '').endsWith('/qr') ||
  window.location.hash === '#qr'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isQR ? <QRCard /> : <AyatMenu />}
  </React.StrictMode>,
)
