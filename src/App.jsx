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
import { fetchCloudKnowledgeBase } from './services/geminiService';

import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Tự động kéo kho tri thức đám mây (Google Docs) khi mở web trên mọi thiết bị
  useEffect(() => {
    fetchCloudKnowledgeBase();
  }, []);

  // Đồng bộ hóa với hash trên thanh địa chỉ
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['home', 'timeline', 'battle-map', 'museum', 'ai-station', 'quiz', 'survey'];
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
      default:
        return <HomeTab onSelectTab={handleSelectTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Hiệu ứng tàn tro lửa lơ lửng 60fps */}
      <AmbientEmbersCanvas />

      {/* Lớp nền đa tầng: Đốm sáng Crimson & Gold mờ ảo tạo chiều sâu 3D */}
      <div className="ambient-radial-glow glow-crimson" aria-hidden="true" />
      <div className="ambient-radial-glow glow-gold" aria-hidden="true" />
      <div className="heritage-pattern-overlay" aria-hidden="true" />

      {/* Thanh điều hướng chính */}
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={handleSelectTab} 
        onOpenAdmin={() => setIsAdminOpen(true)}
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
    </div>
  );
}
