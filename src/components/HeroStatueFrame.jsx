import React from 'react';
import { Swords, Scroll } from 'lucide-react';

export default function HeroStatueFrame({ 
  children, 
  badgeTop = "3 Chiến Dịch Thần Tốc", 
  badgeBottom = "10 Mốc Sơn Lịch Sử" 
}) {
  return (
    <div className="hero-statue-frame">
      {/* Top Dragon Crown Arch & Imperial Sun Pearl (Chạm rồng lưỡng long chầu nguyệt) */}
      <div className="statue-dragon-crest-top" aria-hidden="true">
        <svg width="220" height="54" viewBox="0 0 220 54" fill="none">
          <defs>
            <linearGradient id="imperialDragonGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7A3E0D" />
              <stop offset="20%" stopColor="#D4AC0D" />
              <stop offset="50%" stopColor="#FFF5D0" />
              <stop offset="80%" stopColor="#D4AC0D" />
              <stop offset="100%" stopColor="#7A3E0D" />
            </linearGradient>
            <radialGradient id="sunPearl" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFF2B2" />
              <stop offset="80%" stopColor="#F5B041" />
              <stop offset="100%" stopColor="#8C4A14" />
            </radialGradient>
          </defs>

          {/* Left Dragon Head & Horn */}
          <path
            d="M30 38 C40 22 65 14 95 18 C85 24 72 26 55 24 C70 32 90 35 105 32 C85 40 55 42 30 38 Z"
            fill="url(#imperialDragonGold)"
            stroke="#FFEAA7"
            strokeWidth="0.8"
          />
          {/* Right Dragon Head & Horn */}
          <path
            d="M190 38 C180 22 155 14 125 18 C135 24 148 26 165 24 C150 32 130 35 115 32 C135 40 165 42 190 38 Z"
            fill="url(#imperialDragonGold)"
            stroke="#FFEAA7"
            strokeWidth="0.8"
          />
          {/* Central Sun Pearl (Minh Châu Ánh Kim) */}
          <circle cx="110" cy="18" r="9" fill="url(#sunPearl)" stroke="#FFF5D0" strokeWidth="1.5" />
          <circle cx="110" cy="18" r="14" fill="none" stroke="#F5B041" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
          {/* Flame aura surrounding the pearl */}
          <path
            d="M110 4 Q105 12 110 18 Q115 12 110 4 Z M96 18 Q103 14 110 18 Q103 22 96 18 Z M124 18 Q117 14 110 18 Q117 22 124 18 Z"
            fill="#FFEAA7"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Left Coiling Dragon Border Pillar */}
      <div className="dragon-border-side dragon-border-left" aria-hidden="true">
        <svg width="44" height="100%" viewBox="0 0 44 480" preserveAspectRatio="none" fill="none">
          <defs>
            <linearGradient id="dragonBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF5D0" />
              <stop offset="30%" stopColor="#F5B041" />
              <stop offset="70%" stopColor="#C68A20" />
              <stop offset="100%" stopColor="#6E3508" />
            </linearGradient>
          </defs>
          {/* Undulating Dragon Spine & Scales */}
          <path
            d="M22 0 C40 45 6 90 24 140 C42 190 8 240 26 290 C44 340 10 390 28 440 C36 460 30 475 22 480"
            stroke="url(#dragonBodyGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Overlapping golden scales */}
          <path
            d="M16 30 Q32 65 16 100 Q32 135 16 170 Q32 205 16 240 Q32 275 16 310 Q32 345 16 380 Q32 415 18 450"
            stroke="#FFEAA7"
            strokeWidth="1.8"
            opacity="0.75"
          />
          {/* Dragon Claws holding the frame */}
          <path
            d="M18 120 L32 116 M18 125 L34 125 M18 130 L32 134 M20 270 L34 266 M20 275 L36 275 M20 280 L34 284"
            stroke="#FFF5D0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Right Coiling Dragon Border Pillar */}
      <div className="dragon-border-side dragon-border-right" aria-hidden="true">
        <svg width="44" height="100%" viewBox="0 0 44 480" preserveAspectRatio="none" fill="none">
          <path
            d="M22 0 C40 45 6 90 24 140 C42 190 8 240 26 290 C44 340 10 390 28 440 C36 460 30 475 22 480"
            stroke="url(#dragonBodyGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M16 30 Q32 65 16 100 Q32 135 16 170 Q32 205 16 240 Q32 275 16 310 Q32 345 16 380 Q32 415 18 450"
            stroke="#FFEAA7"
            strokeWidth="1.8"
            opacity="0.75"
          />
          <path
            d="M18 120 L32 116 M18 125 L34 125 M18 130 L32 134 M20 270 L34 266 M20 275 L36 275 M20 280 L34 284"
            stroke="#FFF5D0"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 4 Traditional Imperial Cloud & Flame Corner Brackets */}
      <div className="statue-corner statue-corner-tl" aria-hidden="true">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path
            d="M4 38 V10 C4 6.7 6.7 4 10 4 H38 M10 10 H26 M10 10 V26 M16 16 H24 M16 16 V24"
            stroke="#F5B041"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="10" r="2.5" fill="#FFEAA7" />
        </svg>
      </div>
      <div className="statue-corner statue-corner-tr" aria-hidden="true">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path
            d="M4 38 V10 C4 6.7 6.7 4 10 4 H38 M10 10 H26 M10 10 V26 M16 16 H24 M16 16 V24"
            stroke="#F5B041"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="10" r="2.5" fill="#FFEAA7" />
        </svg>
      </div>
      <div className="statue-corner statue-corner-bl" aria-hidden="true">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path
            d="M6 6 V36 C6 41 11 46 16 46 H46 C34 46 24 38 24 26 C24 16 16 8 6 6 Z"
            fill="url(#dragonBodyGrad)"
            stroke="#FFEAA7"
            strokeWidth="1"
          />
        </svg>
      </div>
      <div className="statue-corner statue-corner-br" aria-hidden="true">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path
            d="M6 6 V36 C6 41 11 46 16 46 H46 C34 46 24 38 24 26 C24 16 16 8 6 6 Z"
            fill="url(#dragonBodyGrad)"
            stroke="#FFEAA7"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Top Right Floating Badge */}
      <div className="hero-statue-badge-top">
        <Swords size={13} className="badge-icon-gold" aria-hidden="true" />
        <span>{badgeTop}</span>
      </div>

      {/* Bottom Left Floating Badge */}
      <div className="hero-statue-badge-bottom">
        <Scroll size={13} className="badge-icon-gold" aria-hidden="true" />
        <span>{badgeBottom}</span>
      </div>

      {/* Statue Content Container */}
      <div className="statue-image-container">
        {children}
      </div>

      {/* Imperial Pedestal Plinth (Bệ đá hoàng đế chạm khắc chữ vàng) */}
      <div className="hero-statue-plinth">
        <figcaption className="hero-statue-caption">
          QUANG TRUNG HOÀNG ĐẾ
        </figcaption>
      </div>
    </div>
  );
}
