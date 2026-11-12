import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
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
import ContactBubbleWidget from './components/ContactBubbleWidget';
import AdminPinModal from './components/AdminPinModal';
import CinematicIntro from './components/CinematicIntro';
import DesignSystemPreview from './components/DesignSystemPreview';
import { AdminProvider } from './context/AdminContext';
import { fetchCloudKnowledgeBase } from './services/geminiService';

import './App.css';

/**
 * Multi-dimensional mobile device detection:
 * Evaluates viewport width (<= 768px), landscape height (<= 500px on touch),
 * touch capabilities (navigator.maxTouchPoints > 0, ontouchstart),
 * CSS coarse pointer media query, and mobile User-Agent.
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;

  // 1. Portrait mobile & small tablet width
  if (window.innerWidth <= 768) return true;

  // 2. Touch capability
  const isTouchCapable = 
    ('ontouchstart' in window) ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
    (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches);

  // 3. Landscape phone (short viewport height with touch capability)
  if (isTouchCapable && window.innerHeight <= 500) {
    return true;
  }

  // 4. Mobile User-Agent regex
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (isMobileUA && (isTouchCapable || window.innerWidth <= 1024)) {
    return true;
  }

  // 5. Coarse pointer with no hover on tablet / mobile devices
  if (typeof window.matchMedia === 'function' && 
      window.matchMedia('(hover: none) and (pointer: coarse) and (max-width: 1024px)').matches) {
    return true;
  }

  return false;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    try {
      // Synchronously bypass intro on mobile with zero flash or delay
      return !isMobileDevice() && !sessionStorage.getItem('su_intro_seen_session');
    } catch (e) {
      return false;
    }
  });

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('su_intro_seen_session', 'v1');
    } catch (e) {}
    setShowIntro(false);
  };

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
        return <TimelineTab onSelectTab={handleSelectTab} />;
      case 'battle-map':
        return <BattleMapTab />;
      case 'museum':
        return <MuseumTab />;
      case 'ai-station':
        return <AiStationTab />;
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
    <AdminProvider onOpenAdmin={() => setIsAdminOpen(true)}>
      <Toaster position="top-right" richColors theme="dark" />
      <div className="app-container">
        {/* Hiệu ứng tàn tro lửa lơ lửng 60fps */}
        <AmbientEmbersCanvas />

        {/* Lớp nền đa tầng: Đốm sáng Crimson & Gold mờ ảo tạo chiều sâu 3D */}
        <div className="ambient-radial-glow ambient-radial-crimson" aria-hidden="true" />
        <div className="ambient-radial-glow ambient-radial-gold" aria-hidden="true" />
        <div className="heritage-pattern-overlay" aria-hidden="true" />

        {/* Màn mở đầu Điện ảnh 3D Parallax & Tượng Quang Trung lắc lư */}
        <AnimatePresence>
          {showIntro && (
            <CinematicIntro onComplete={handleIntroComplete} />
          )}
        </AnimatePresence>

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
        {!['battle-map', 'ai-station'].includes(activeTab) && (
          <Footer 
            onSelectTab={handleSelectTab} 
            onReplayIntro={() => {
              if (isMobileDevice()) return;
              setShowIntro(true);
            }} 
          />
        )}

        {/* Quả cầu Sử Quan AI trôi nổi góc dưới (ẩn khi ở tab AI hoặc Sa Bàn) */}
        {!['ai-station', 'battle-map'].includes(activeTab) && (
          <FloatingAiWidget 
            activeTab={activeTab} 
            onSelectTab={handleSelectTab} 
          />
        )}

        {/* Bong bóng liên hệ Facebook & Gmail nổi cạnh phải màn hình (ẩn khi vào tab AI) */}
        {activeTab !== 'ai-station' && (
          <ContactBubbleWidget activeTab={activeTab} />
        )}

        {/* Bảng điều khiển Quản trị Toàn diện (Admin Control Center) */}
        <AdminKnowledgeModal 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
        />
      </div>
    </AdminProvider>
  );
}
