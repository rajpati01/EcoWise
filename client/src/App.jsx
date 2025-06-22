import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Header from './components/Header'
import About from './pages/About'
import Home  from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Blogs from './pages/Blogs'
import Campaigns from './pages/Campaigns'


function App() {

  return (
    <>
      <Header />

        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/Leaderboard" element={<Leaderboard/>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/campaigns" element={<Campaigns />} />
            </Routes>
          </main>
        </div>

       <Footer />
    </>
  )
}

export default App;