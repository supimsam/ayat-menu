import React from 'react'
import ReactDOM from 'react-dom/client'
import AyatMenu from './AyatMenu.jsx'
import QRCard from './QRCard.jsx'
import CateringMenu from './CateringMenu.jsx'
import FaqPage from './FaqPage.jsx'

const path = window.location.pathname.replace(/\/$/, '')
const hash = window.location.hash
const isQR = path.endsWith('/qr') || hash === '#qr'
const isFaq = path.endsWith('/faq') || hash === '#faq'
const isCatering = path.endsWith('/catering') || hash === '#catering'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isQR ? <QRCard /> : isFaq ? <FaqPage /> : isCatering ? <CateringMenu /> : <AyatMenu />}
  </React.StrictMode>,
)
