import React from 'react';

export default function DrumBackground() {
  // Generate 14-pointed star rays for center solar disc
  const starPoints = [];
  const starRadiusOuter = 92;
  const starRadiusInner = 36;
  const pointsCount = 14;
  for (let i = 0; i < pointsCount * 2; i++) {
    const angle = (i * Math.PI) / pointsCount;
    const r = i % 2 === 0 ? starRadiusOuter : starRadiusInner;
    const x = 500 + r * Math.sin(angle);
    const y = 500 - r * Math.cos(angle);
    starPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  // Generate 8 Chim Lạc angles
  const birds = [0, 45, 90, 135, 180, 225, 270, 315];

  // Concentric circle dash patterns for traditional Dong Son relief
  const sawtoothCount = 48;
  const sawtoothPoints = [];
  for (let i = 0; i < sawtoothCount; i++) {
    const angle = (i * 2 * Math.PI) / sawtoothCount;
    const angleNext = ((i + 0.5) * 2 * Math.PI) / sawtoothCount;
    const x1 = 500 + 440 * Math.cos(angle);
    const y1 = 500 + 440 * Math.sin(angle);
    const x2 = 500 + 452 * Math.cos(angleNext);
    const y2 = 500 + 452 * Math.sin(angleNext);
    sawtoothPoints.push(`M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`);
  }

  return (
    <div className="drum-bg-wrapper" aria-hidden="true">
      {/* Blinding Solar Eclipse Corona Crescent Flare (Vầng nhật hoa hình bán nguyệt góc trên bên phải) */}
      <div className="drum-solar-corona" />

      <svg
        viewBox="0 0 1000 1000"
        className="drum-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="drumRadialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.95" />
            <stop offset="20%" stopColor="#F7C844" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#D48A14" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#8C4A0E" stopOpacity="0.5" />
            <stop offset="90%" stopColor="#4A2207" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1A0A02" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="goldRelief" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5D0" />
            <stop offset="35%" stopColor="#F5B041" />
            <stop offset="70%" stopColor="#D4AC0D" />
            <stop offset="100%" stopColor="#875A11" />
          </linearGradient>

          <linearGradient id="glowRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFEAA7" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.2" />
          </linearGradient>

          {/* Authentic Stylized Chim Lạc silhouette (Chim Lạc sải cánh bay) */}
          <g id="dongSonLacBird">
            <path
              d="M0,-365 C45,-380 95,-385 145,-372 C115,-362 80,-356 48,-352 C85,-340 135,-328 185,-332 C135,-320 75,-326 22,-335 C46,-320 82,-310 118,-308 C75,-302 26,-310 -22,-322 C-5,-342 -2,-356 0,-365 Z"
              fill="url(#goldRelief)"
              opacity="0.92"
            />
            {/* Eye of Chim Lac */}
            <circle cx="28" cy="-356" r="2.5" fill="#FFEAA7" />
          </g>

          {/* Deer & Human Dancer Motif (Hươu sao & người nhảy múa cách điệu) */}
          <g id="dongSonFigure">
            <path
              d="M0,-240 L6,-248 L12,-240 L16,-244 L10,-252 L4,-252 L-2,-244 Z M6,-240 L6,-228 L10,-222 M6,-228 L2,-222"
              stroke="#FFEAA7"
              strokeWidth="2"
              fill="none"
              opacity="0.85"
            />
          </g>
        </defs>

        {/* Ambient Halo Glow */}
        <circle cx="500" cy="500" r="485" fill="url(#drumRadialGrad)" />

        {/* Ring 1: Outermost Heavy Bronze Rim with Bevel */}
        <circle
          cx="500"
          cy="500"
          r="470"
          fill="none"
          stroke="url(#goldRelief)"
          strokeWidth="6"
          opacity="0.85"
        />
        <circle
          cx="500"
          cy="500"
          r="458"
          fill="none"
          stroke="#FFEAA7"
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Ring 2: Sawtooth / Triangle teeth border */}
        <circle
          cx="500"
          cy="500"
          r="444"
          fill="none"
          stroke="#F5B041"
          strokeWidth="10"
          strokeDasharray="4 6"
          opacity="0.75"
        />

        {/* Ring 3: Concentric Circles with Tangent Dots */}
        <circle
          cx="500"
          cy="500"
          r="422"
          fill="none"
          stroke="#FFEAA7"
          strokeWidth="2.5"
          opacity="0.8"
        />
        <circle
          cx="500"
          cy="500"
          r="410"
          fill="none"
          stroke="#D4AC0D"
          strokeWidth="6"
          strokeDasharray="2 6"
          opacity="0.85"
        />
        <circle
          cx="500"
          cy="500"
          r="398"
          fill="none"
          stroke="#FFEAA7"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Ring 4: Grand Track of 8 Flying Chim Lạc */}
        <circle
          cx="500"
          cy="500"
          r="378"
          fill="none"
          stroke="url(#goldRelief)"
          strokeWidth="3"
          opacity="0.75"
        />
        <circle
          cx="500"
          cy="500"
          r="305"
          fill="none"
          stroke="url(#goldRelief)"
          strokeWidth="3"
          opacity="0.75"
        />

        {/* 8 Chim Lạc Flying counter-clockwise */}
        <g transform="translate(500, 500)">
          {birds.map((deg, i) => (
            <g key={i} transform={`rotate(${deg})`}>
              <use href="#dongSonLacBird" />
            </g>
          ))}
        </g>

        {/* Ring 5: Dotted bands & Meander Patterns */}
        <circle
          cx="500"
          cy="500"
          r="292"
          fill="none"
          stroke="#FFEAA7"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.8"
        />
        <circle
          cx="500"
          cy="500"
          r="275"
          fill="none"
          stroke="#F5B041"
          strokeWidth="4"
          opacity="0.7"
        />

        {/* Ring 6: Human Dancers & Deer motif */}
        <g transform="translate(500, 500)">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <g key={i} transform={`rotate(${deg})`}>
              <use href="#dongSonFigure" />
            </g>
          ))}
        </g>

        {/* Ring 7: Inner concentric solar rings */}
        <circle
          cx="500"
          cy="500"
          r="215"
          fill="none"
          stroke="url(#goldRelief)"
          strokeWidth="3"
          opacity="0.8"
        />
        <circle
          cx="500"
          cy="500"
          r="195"
          fill="none"
          stroke="#FFEAA7"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.85"
        />
        <circle
          cx="500"
          cy="500"
          r="165"
          fill="none"
          stroke="#D4AC0D"
          strokeWidth="3"
          opacity="0.8"
        />
        <circle
          cx="500"
          cy="500"
          r="135"
          fill="none"
          stroke="#FFEAA7"
          strokeWidth="2"
          strokeDasharray="3 5"
          opacity="0.9"
        />
        <circle
          cx="500"
          cy="500"
          r="108"
          fill="none"
          stroke="url(#goldRelief)"
          strokeWidth="2.5"
          opacity="0.9"
        />

        {/* Center: 14-Pointed Solar Star (Mặt trời 14 tia sáng chiếu rọi) */}
        <polygon
          points={starPoints.join(' ')}
          fill="url(#goldRelief)"
          stroke="#FFF8DC"
          strokeWidth="2"
          opacity="0.98"
        />

        {/* Central Solar Core */}
        <circle
          cx="500"
          cy="500"
          r="28"
          fill="#FFF9E0"
          stroke="#B87B35"
          strokeWidth="2.5"
          filter="drop-shadow(0 0 10px #F5B041)"
        />
        <circle cx="500" cy="500" r="10" fill="#B87B35" opacity="0.6" />
      </svg>
    </div>
  );
}
