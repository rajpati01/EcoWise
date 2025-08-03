
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext';
// import { ThemeProvider } from './context/ThemeContext';
// import { NotificationProvider } from './context/NotificationContext';

//Components
import Footer from './components/Footer'
import Header from './components/Header'
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home  from './pages/Home'
import About from './pages/About'
// import WasteClassification from './pages/WasteClassification';
import Blogs from './pages/Blogs'
import Campaigns from './pages/Campaigns'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Admin
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ManageUsers from './pages/admin/ManageUsers';
// import ManageBlogs from './pages/admin/ManageBlogs';
// import ManageCampaigns from './pages/admin/ManageCampaigns';


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
              <Route path="/signup" element={<Register />} />
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