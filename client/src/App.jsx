// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import About from "./pages/About";


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />        
        <Route path="/blogs" element={<Blog />} />
      </Routes>
    </>
  );
}

export default App;
