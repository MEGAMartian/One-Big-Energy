import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HoldOrSell from './pages/HoldOrSell.jsx'
import CutSheet from './pages/CutSheet.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HoldOrSell />} />
        <Route path="/cutsheet" element={<CutSheet />} />
      </Routes>
    </BrowserRouter>
  )
}
