import React from 'react'
import ReactDOM from 'react-dom/client'
import AyatMenu from './AyatMenu.jsx'
import QRCard from './QRCard.jsx'
import CateringMenu from './CateringMenu.jsx'

const path = window.location.pathname.replace(/\/$/, '')
const isQR = path.endsWith('/qr') || window.location.hash === '#qr'
const isCatering = path.endsWith('/catering') || window.location.hash === '#catering'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isQR ? <QRCard /> : isCatering ? <CateringMenu /> : <AyatMenu />}
  </React.StrictMode>,
)
