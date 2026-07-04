import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlatformHome from './pages/PlatformHome';
import CandidatePage from './pages/CandidatePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformHome />} />
        <Route path="/:slug" element={<CandidatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

