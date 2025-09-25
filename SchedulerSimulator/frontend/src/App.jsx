// 
import { Router } from 'react-router'
import { Routes, Route } from 'react-router'
//components
import Header from './components/Header'
import Footer from './components/Footer'
//Pages
import Carga from './pages/carga'
import Resultado from './pages/Resultado'

function App() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-pink-50 relative">
        <div className="flex-1 overflow-auto relative z-10">
        <Header />
        <Routes>
          <Route path="/" element={<Carga />} />
          <Route path="/Resultado" element={<Resultado />} />
        </Routes>
        </div>
        <div className="flex-none relative z-10">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
