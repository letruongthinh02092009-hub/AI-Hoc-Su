import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Clock, 
  MapPin, 
  Landmark, 
  Bot, 
  Trophy, 
  FileText, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Shield,
  ShieldCheck,
  Crown,
  Swords,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { playChime, getSoundEnabled, setSoundEnabled } from '../utils/audio';

const NAV_TABS = [
  { id: 'home', label: 'Trang Chủ', icon: Home },
  { id: 'timeline', label: 'Dòng Thời Gian', icon: Clock },
  { id: 'battle-map', label: 'Sa Bàn Chiến Trận', icon: MapPin },
  { id: 'museum', label: 'Bảo Tàng Số', icon: Landmark },
  { id: 'ai-station', label: 'Sử Quan AI', icon: Bot },
  { id: 'quiz', label: 'Đố Vui Lịch Sử', icon: Trophy },
  { id: 'survey', label: 'Khảo Sát', icon: FileText }
];

export default function Navbar({ activeTab, onSelectTab, onOpenAdmin, onReplayIntro }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(getSoundEnabled());
  const { isAdmin, toggleAdminModal } = useAdmin();

  const handleTabClick = (tabId) => {
    playChime(600, 'sine', 0.1);
    onSelectTab(tabId);
    setIsMobileOpen(false);
  };

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) playChime(680, 'triangle', 0.15);
  };

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-inner">
          {/* Logo & Brand */}
          <div className="brand-box" onClick={() => handleTabClick('home')}>
            <div className="brand-logo-icon imperial-emblem">
              <Swords size={20} className="emblem-sword" />
            </div>
            <div className="brand-titles">
              <span className="brand-tag">DỰ ÁN SỐ HÓA LỊCH SỬ THPT</span>
              <h1 className="brand-name">HÀO KHÍ TÂY SƠN</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <Icon size={16} className="nav-icon" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="nav-active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="nav-actions">
            {/* Nút Chế độ Admin */}
            {isAdmin ? (
              <>
                <button 
                  className="action-icon-btn admin-active-badge" 
                  title="Chế độ Quản trị đang BẬT. Bấm để thoát"
                  onClick={toggleAdminModal}
                >
                  <Crown size={15} className="admin-crown-icon" />
                  <span className="admin-btn-text">Admin</span>
                  <LogOut size={13} className="admin-logout-icon" />
                </button>
                <button 
                  className="action-icon-btn admin-btn" 
                  title="Nạp sử liệu vào AI"
                  onClick={() => {
                    playChime(500, 'sine', 0.1);
                    onOpenAdmin();
                  }}
                >
                  <ShieldCheck size={16} />
                  <span className="admin-btn-text">Nạp Sử Liệu</span>
                </button>
              </>
            ) : (
              <button 
                className="action-icon-btn admin-btn-guest" 
                title="Kích hoạt Chế độ Quản trị viên (Dành cho tác giả)"
                onClick={toggleAdminModal}
              >
                <Shield size={15} />
                <span className="admin-btn-text">Admin</span>
              </button>
            )}

            {/* Nút Xem lại Intro 3D Tượng đài */}
            <button 
              className="action-icon-btn intro-replay-btn"
              onClick={() => {
                playChime(700, 'triangle', 0.1);
                onReplayIntro && onReplayIntro();
              }}
              title="Chiêm ngưỡng Tượng đài 3D & Màn mở đầu"
            >
              <Sparkles size={15} />
              <span className="intro-btn-label">Intro 3D</span>
            </button>

            <button 
              className={`action-icon-btn ${soundOn ? 'sound-on' : 'sound-off'}`}
              onClick={toggleSound}
              title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>

            <button 
              className="mobile-toggle-btn"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Mở menu"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div 
              className="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mobile-links">
                {NAV_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                <button
                  className="mobile-nav-item"
                  onClick={() => {
                    setIsMobileOpen(false);
                    onReplayIntro && onReplayIntro();
                  }}
                >
                  <Sparkles size={18} className="text-gold" />
                  <span>Chiêm Ngưỡng Tượng Đài 3D</span>
                </button>

                <div className="mobile-drawer-admin-divider" />
                <button 
                  className={`mobile-nav-item mobile-admin-toggle ${isAdmin ? 'admin-on' : ''}`}
                  onClick={() => {
                    toggleAdminModal();
                    setIsMobileOpen(false);
                  }}
                >
                  {isAdmin ? <Crown size={18} className="text-gold" /> : <Shield size={18} />}
                  <span>{isAdmin ? 'Quản Trị Viên (Thoát)' : 'Chế độ Quản Trị Viên'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modern Mobile Bottom Navigation Bar (Dành riêng cho màn hình điện thoại) */}
      <nav className="mobile-bottom-nav" aria-label="Thanh điều hướng di động">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <Icon size={19} />
              <span>{tab.label}</span>
              {isActive && <span className="mobile-active-dot" />}
            </button>
          );
        })}
      </nav>
    </>
  );
}
