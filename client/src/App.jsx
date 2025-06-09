// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import About from "./pages/About";


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
