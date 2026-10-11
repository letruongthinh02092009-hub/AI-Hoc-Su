import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminKnowledgeModal from './components/AdminKnowledgeModal';

import HomeTab from './tabs/HomeTab';
import TimelineTab from './tabs/TimelineTab';
import BattleMapTab from './tabs/BattleMapTab';
import MuseumTab from './tabs/MuseumTab';
import AiStationTab from './tabs/AiStationTab';
import QuizArenaTab from './tabs/QuizArenaTab';
import SurveyTab from './tabs/SurveyTab';

import AmbientEmbersCanvas from './components/AmbientEmbersCanvas';
import FloatingAiWidget from './components/FloatingAiWidget';
import AdminPinModal from './components/AdminPinModal';
import CinematicIntro from './components/CinematicIntro';
import DesignSystemPreview from './components/DesignSystemPreview';
import { AdminProvider } from './context/AdminContext';
import { fetchCloudKnowledgeBase } from './services/geminiService';

import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Tự động kéo kho tri thức đám mây (Google Docs) khi mở web trên mọi thiết bị
  useEffect(() => {
    fetchCloudKnowledgeBase();
  }, []);

  // Đồng bộ hóa với hash trên thanh địa chỉ
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['home', 'timeline', 'battle-map', 'museum', 'ai-station', 'quiz', 'survey', 'design-system'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onSelectTab={handleSelectTab} />;
      case 'timeline':
        return <TimelineTab />;
      case 'battle-map':
        return <BattleMapTab />;
      case 'museum':
        return <MuseumTab />;
      case 'ai-station':
        return <AiStationTab onOpenAdmin={() => setIsAdminOpen(true)} />;
      case 'quiz':
        return <QuizArenaTab />;
      case 'survey':
        return <SurveyTab />;
      case 'design-system':
        return <DesignSystemPreview onSelectTab={handleSelectTab} />;
      default:
        return <HomeTab onSelectTab={handleSelectTab} />;
    }
  };

  return (
    <AdminProvider>
      <div className="app-container">
        {/* Hiệu ứng tàn tro lửa lơ lửng 60fps */}
        <AmbientEmbersCanvas />

        {/* Lớp nền đa tầng: Đốm sáng Crimson & Gold mờ ảo tạo chiều sâu 3D */}
        <div className="ambient-radial-glow glow-crimson" aria-hidden="true" />
        <div className="ambient-radial-glow glow-gold" aria-hidden="true" />
        <div className="heritage-pattern-overlay" aria-hidden="true" />

        {/* Màn mở đầu Điện ảnh 3D Parallax & Tượng Quang Trung lắc lư */}
        <AnimatePresence>
          {showIntro && (
            <CinematicIntro onEnter={() => setShowIntro(false)} />
          )}
        </AnimatePresence>

        {/* Thanh điều hướng chính */}
        <Navbar 
          activeTab={activeTab} 
          onSelectTab={handleSelectTab} 
          onOpenAdmin={() => setIsAdminOpen(true)}
          onReplayIntro={() => setShowIntro(true)}
        />

        {/* Nội dung tab hiện tại */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            {renderActiveTab()}
          </AnimatePresence>
        </main>

        {/* Footer ghi nhận bản quyền chính thức */}
        <Footer onSelectTab={handleSelectTab} />

        {/* Quả cầu Sử Quan AI trôi nổi góc dưới */}
        <FloatingAiWidget 
          activeTab={activeTab} 
          onSelectTab={handleSelectTab} 
        />

        {/* Bảng điều khiển Quản trị RAG (Admin) */}
        <AdminKnowledgeModal 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
        />

        {/* Modal nhập mã PIN Chế độ Admin */}
        <AdminPinModal />
      </div>
    </AdminProvider>
  );
}
