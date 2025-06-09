import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
// import AboutPage from './pages/AboutPage'
import Home  from './pages/Home'
// import NotFoundPage from './pages/NotFoundPage'
// import CampaignsPage from './pages/CampaignsPage'
// import BlogsPage from './pages/BlogsPage'


function App() {
  return (
    <>
      <Header/>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/about" element={<AboutPage />} /> */}
              {/* <Route path="*" element={<NotFoundPage />} /> */}
              {/* <Route path="/campaigns" element={<CampaignsPage />} /> */}
              {/* <Route path="/blogs" element={<BlogsPage />} /> */}
            </Routes>
          </main>
        </div>

       <Footer />
    </>
  )
}

export default App
