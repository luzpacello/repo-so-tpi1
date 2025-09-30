// 
import { Routes, Router, Route } from 'react-router-dom'
//components
import Header from './components/Header'
import Footer from './components/Footer'
//Pages
import Carga from './pages/carga'
import Resultado from './pages/Resultado'

function App() {
  return (
    <>
      <div className=" flex flex-col min-h-screen w-screen bg-sky-50">        
        <Header />
        <div className="flex-1 ">
          <Routes>
            <Route path="/" element={<Carga />} />
            <Route path="/Resultado" element={<Resultado />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
