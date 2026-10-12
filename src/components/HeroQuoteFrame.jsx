import React from 'react';

export default function HeroQuoteFrame({ children }) {
  return (
    <div className="hero-quote-frame">
      {/* Decorative Wooden Scroll Rods with Gold Caps */}
      <div className="scroll-rod-left" aria-hidden="true">
        <span className="scroll-rod-cap-top" />
        <span className="scroll-rod-cap-bottom" />
      </div>
      <div className="scroll-rod-right" aria-hidden="true">
        <span className="scroll-rod-cap-top" />
        <span className="scroll-rod-cap-bottom" />
      </div>

      {/* Cloud & Flame Crest at Top Center (Vương miện mây lửa sơn son thiếp vàng) */}
      <div className="quote-crest-top" aria-hidden="true">
        <svg width="150" height="34" viewBox="0 0 150 34" fill="none">
          <defs>
            <linearGradient id="crestRedGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7F1D1D" />
              <stop offset="25%" stopColor="#DC2626" />
              <stop offset="50%" stopColor="#F5B041" />
              <stop offset="75%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
            <linearGradient id="crestGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#875A11" />
              <stop offset="50%" stopColor="#FFF5D0" />
              <stop offset="100%" stopColor="#875A11" />
            </linearGradient>
          </defs>

          {/* Cloud body */}
          <path
            d="M75 2 C58 2 50 14 34 14 C20 14 10 7 0 22 C16 19 28 25 42 25 C58 25 68 11 75 11 C82 11 92 25 108 25 C122 25 134 19 150 22 C140 7 130 14 116 14 C100 14 92 2 75 2 Z"
            fill="url(#crestRedGold)"
            stroke="url(#crestGoldTrim)"
            strokeWidth="1.2"
          />
          {/* Central Imperial Gold Bead */}
          <circle cx="75" cy="7" r="4.5" fill="#FFF5D0" stroke="#F5B041" strokeWidth="1" />
          <circle cx="75" cy="7" r="2" fill="#D4AC0D" />
          {/* Flame rays */}
          <path
            d="M66 14 Q75 6 84 14 Q75 18 66 14 Z"
            fill="#FFEAA7"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* 4 Traditional Vietnamese Corner Cloud Brackets (Hoa văn góc mây cuộn vàng) */}
      <div className="quote-corner quote-corner-tl" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M3 25 V6 C3 4.3 4.3 3 6 3 H25 M7 7 H17 M7 7 V17 M11 11 H15 M11 11 V15"
            stroke="#F5B041"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="7" cy="7" r="1.5" fill="#FFEAA7" />
        </svg>
      </div>
      <div className="quote-corner quote-corner-tr" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M3 25 V6 C3 4.3 4.3 3 6 3 H25 M7 7 H17 M7 7 V17 M11 11 H15 M11 11 V15"
            stroke="#F5B041"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="7" cy="7" r="1.5" fill="#FFEAA7" />
        </svg>
      </div>
      <div className="quote-corner quote-corner-bl" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M3 25 V6 C3 4.3 4.3 3 6 3 H25 M7 7 H17 M7 7 V17 M11 11 H15 M11 11 V15"
            stroke="#F5B041"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="7" cy="7" r="1.5" fill="#FFEAA7" />
        </svg>
      </div>
      <div className="quote-corner quote-corner-br" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M3 25 V6 C3 4.3 4.3 3 6 3 H25 M7 7 H17 M7 7 V17 M11 11 H15 M11 11 V15"
            stroke="#F5B041"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="7" cy="7" r="1.5" fill="#FFEAA7" />
        </svg>
      </div>

      {/* Quote Content */}
      {children}
    </div>
  );
}
