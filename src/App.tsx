import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LandingPage from '@/pages/LandingPage';
import Chat from '@/pages/Chat';
import useAppStore from '@/lib/store/appStore';

const App = () => {
  const { isOnboarded } = useAppStore();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isOnboarded ? <Navigate to="/chat" /> : <LandingPage />} 
        />
        <Route 
          path="/chat" 
          element={isOnboarded ? <Chat /> : <Navigate to="/" />} 
        />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;