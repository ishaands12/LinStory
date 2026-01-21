import { Routes, Route } from 'react-router-dom';
import { CourseProvider } from './context/CourseContext';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';
import AIChatWidget from './components/AIChatWidget';
import BackendStatus from './components/BackendStatus';

function App() {
  return (
    <CourseProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:topicId" element={<StoryPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <AIChatWidget context="General" />
      <BackendStatus />
    </CourseProvider>
  );
}

export default App;
