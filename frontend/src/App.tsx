import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BuilderPage from './pages/BuilderPage';
import Chatmode from './pages/ChatMode';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import ExamplesPage from './pages/ExamplesPage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path='/chatmode' element={<Chatmode/>} />
          <Route path='/features' element={<FeaturesPage/>} />
          <Route path='/examples' element={<ExamplesPage/>} />
          <Route path='/pricing' element={<PricingPage/>} />
          <Route path='/about' element={<AboutPage/>} />
        </Routes>
      </BrowserRouter>

  );
}

export default App;