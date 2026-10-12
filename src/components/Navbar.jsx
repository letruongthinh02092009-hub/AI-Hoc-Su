import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { playChime, getSoundEnabled, setSoundEnabled } from '../utils/audio';

const NAV_ITEMS = [
  { id: 'home', label: 'Trang Chủ' },
  { id: 'timeline', label: 'Dòng Thời Gian' },
  { id: 'battle-map', label: 'Sa Bàn' },
  { id: 'museum', label: 'Bảo Tàng' },
  { id: 'ai-station', label: 'Sử Quan AI' },
  { id: 'quiz', label: 'Đố Vui' },
  { id: 'survey', label: 'Đánh Giá' }
];

export default function Navbar({ activeTab, onSelectTab, onOpenAdmin }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => getSoundEnabled());

  // Khóa cuộn trang khi menu mobile mở
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

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
      <header className="navbar">
        {/* Logo text-only Fraunces 900 */}
        <button
          type="button"
          className="navbar-logo"
          onClick={() => handleTabClick('home')}
          aria-label="Trang chủ Hào Khí Tây Sơn"
        >
          HÀO KHÍ TÂY SƠN
        </button>

        {/* 6 Menu items trên 1 dòng duy nhất */}
        <nav className="navbar-nav" aria-label="Điều hướng chính">
          <ul className="navbar-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.id)}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Khu vực Actions bên phải: Nút text Admin + Icon Sound + Hamburger Mobile */}
        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-admin-btn"
            onClick={onOpenAdmin}
            aria-label="Mở quản trị"
          >
            Admin
          </button>

          <button
            type="button"
            className="btn-icon"
            onClick={toggleSound}
            aria-label={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Mở menu"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-overlay"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-nav-overlay"
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-menu-header">
              <span className="navbar-logo">HÀO KHÍ TÂY SƠN</span>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Đóng menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav aria-label="Điều hướng trên di động">
              <ul className="mobile-nav-list">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => handleTabClick(item.id)}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mobile-menu-footer">
              <button
                type="button"
                className="navbar-admin-btn"
                onClick={() => {
                  setIsMobileOpen(false);
                  onOpenAdmin?.();
                }}
                aria-label="Mở quản trị"
              >
                Admin
              </button>

              <button
                type="button"
                className="btn-icon"
                onClick={toggleSound}
                aria-label={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
