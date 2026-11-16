import React from 'react'
import ReactDOM from 'react-dom/client'
import AyatMenu from './AyatMenu.jsx'
import QRCard from './QRCard.jsx'
import FaqPage from './FaqPage.jsx'
import CateringDemo from './CateringDemo.jsx'
import DessertPrint from './DessertPrint.jsx'
import FullMenuPrint from './FullMenuPrint.jsx'

const CATERING_URL = 'https://www.ayatnyc.com/menu/catering-menu/'

const path = window.location.pathname.replace(/\/$/, '')
const hash = window.location.hash
const isQR = path.endsWith('/qr') || hash === '#qr'
const isFaq = path.endsWith('/faq') || hash === '#faq'
const isDessertPrint = path.endsWith('/dessert-menu') || hash === '#dessert-menu'
const isMenuPrint = path.endsWith('/print-menu') || hash === '#print-menu'
// Work-in-progress concept, reachable on the dev server only. On the live site
// /catering-demo falls through to the main menu.
const isCateringDemo = import.meta.env.DEV &&
  (path.endsWith('/catering-demo') || hash === '#catering-demo')
const isCatering = path.endsWith('/catering') || hash === '#catering'

// The in-app catering menu is off for now. /catering forwards to the ayatnyc
// catering page so links and QR codes already out in the world still land somewhere.
if (isCatering) {
  window.location.replace(CATERING_URL)
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      {isQR ? <QRCard /> : isFaq ? <FaqPage /> : isDessertPrint ? <DessertPrint />
        : isMenuPrint ? <FullMenuPrint />
        : isCateringDemo ? <CateringDemo /> : <AyatMenu />}
    </React.StrictMode>,
  )
}
