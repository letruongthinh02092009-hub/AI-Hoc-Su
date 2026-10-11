import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  Swords, 
  Crosshair, 
  Compass,
  ArrowRight,
  Shield,
  MapPin,
  Info
} from 'lucide-react';
import { BATTLES_DATA } from '../data/battlesData';
import { playChime } from '../utils/audio';

export default function BattleMapTab() {
  const [activeBattleId, setActiveBattleId] = useState('rach-gam');
  const [mapLayerType, setMapLayerType] = useState('satellite'); // 'satellite' | 'osm'
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const layersGroupRef = useRef(null);

  const battle = BATTLES_DATA[activeBattleId];

  // Khởi tạo bản đồ Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: battle.center,
      zoom: battle.zoom,
      zoomControl: true,
      attributionControl: false
    });

    mapInstanceRef.current = map;
    layersGroupRef.current = L.layerGroup().addTo(map);

    updateTileLayer(map, mapLayerType);
    renderTacticalLayers(map, battle);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeBattleId]);

  // Cập nhật lớp ảnh nền (Vệ tinh / Địa hình)
  const updateTileLayer = (map, type) => {
    if (!map) return;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = '';
    if (type === 'satellite') {
      // Vệ tinh Esri World Imagery
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else {
      // Bản đồ địa hình OpenStreetMap
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    tileLayerRef.current = L.tileLayer(url, { maxZoom: 18 }).addTo(map);
  };

  const handleLayerChange = (type) => {
    setMapLayerType(type);
    if (mapInstanceRef.current) {
      updateTileLayer(mapInstanceRef.current, type);
    }
    playChime(500, 'sine', 0.1);
  };

  // Vẽ các Vùng tác chiến & Mũi tên hướng tiến công
  const renderTacticalLayers = (map, battleData) => {
    if (!layersGroupRef.current) return;
    layersGroupRef.current.clearLayers();

    // 1. Vẽ các Vùng tác chiến (Tactical Zones)
    battleData.zones.forEach((zone) => {
      const polygon = L.polygon(zone.coords, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.22,
        weight: 2,
        dashArray: '4, 4'
      });

      const popupContent = `
        <div class="tactical-popup">
          <span class="popup-zone-tag" style="background: ${zone.color}22; color: ${zone.color};">
            Vùng Chiến Lược
          </span>
          <h4 class="popup-zone-title">${zone.title}</h4>
          <p class="popup-zone-desc">${zone.desc}</p>
        </div>
      `;

      polygon.bindPopup(popupContent);
      polygon.on('click', () => {
        setSelectedFeature({ type: 'zone', data: zone });
        playChime(620, 'triangle', 0.1);
      });

      layersGroupRef.current.addLayer(polygon);
    });

    // 2. Vẽ Mũi tên hướng tiến công (Directional Flows)
    battleData.flows.forEach((flow) => {
      const polyline = L.polyline(flow.points, {
        color: flow.color,
        weight: 4,
        opacity: 0.9,
        dashArray: flow.dashArray || null
      });

      // Tạo điểm mũi tên ở đích đến
      const lastPoint = flow.points[flow.points.length - 1];
      const arrowIcon = L.divIcon({
        className: 'tactical-arrowhead',
        html: `<div style="color: ${flow.color}; font-size: 14px; font-weight: bold; transform: rotate(45deg);">▶</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const arrowMarker = L.marker(lastPoint, { icon: arrowIcon });

      const popupContent = `
        <div class="tactical-popup">
          <span class="popup-flow-tag" style="color: ${flow.color};">
            ${flow.type === 'friendly' ? 'Hướng Tiến Công Tây Sơn' : 'Hướng Di Chuyển Đối Phương'}
          </span>
          <h4 class="popup-zone-title">${flow.title}</h4>
          <p class="popup-zone-desc">${flow.desc}</p>
        </div>
      `;

      polyline.bindPopup(popupContent);
      arrowMarker.bindPopup(popupContent);

      polyline.on('click', () => {
        setSelectedFeature({ type: 'flow', data: flow });
        playChime(650, 'sine', 0.1);
      });

      layersGroupRef.current.addLayer(polyline);
      layersGroupRef.current.addLayer(arrowMarker);
    });
  };

  const handleSwitchBattle = (id) => {
    setSelectedFeature(null);
    setActivePhaseIndex(0);
    playChime(600, 'sine', 0.15);
    setActiveBattleId(id);
  };

  // Kích hoạt zoom mượt mà theo từng giai đoạn
  const handleSelectPhase = (tac, idx) => {
    setActivePhaseIndex(idx);
    playChime(680, 'triangle', 0.12);
    if (mapInstanceRef.current && tac.center) {
      mapInstanceRef.current.flyTo(tac.center, tac.zoom || 13, {
        animate: true,
        duration: 1.4
      });
    }
  };

  // Trở về góc nhìn toàn cảnh trận đánh
  const handleResetView = () => {
    playChime(550, 'sine', 0.1);
    setSelectedFeature(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(battle.center, battle.zoom, {
        animate: true,
        duration: 1.2
      });
    }
  };

  return (
    <motion.div 
      className="tab-page battlemap-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="section-title-box">
        <span className="section-kicker">LƯỢC ĐỒ QUÂN SỰ TƯƠNG TÁC</span>
        <h2 className="section-heading">SA BÀN CHIẾN TRẬN & ĐIỀU BINH TÂY SƠN</h2>
        <p className="section-subtext">Mô phỏng các mũi tiến công thần tốc và vùng tác chiến chiến lược, phản ánh chân thực nghệ thuật bách chiến bách thắng của Hoàng đế Quang Trung.</p>
        <div className="title-divider-gold"></div>
      </div>

      {/* Battle Selection Bar */}
      <div className="battle-selector-tabs">
        <button 
          className={`battle-tab-btn ${activeBattleId === 'rach-gam' ? 'active' : ''}`}
          onClick={() => handleSwitchBattle('rach-gam')}
        >
          <Swords size={17} />
          <span>Thủy Chiến Rạch Gầm – Xoài Mút (1785)</span>
        </button>
        <button 
          className={`battle-tab-btn ${activeBattleId === 'ngoc-hoi-dong-da' ? 'active' : ''}`}
          onClick={() => handleSwitchBattle('ngoc-hoi-dong-da')}
        >
          <Crosshair size={17} />
          <span>Đại Phá Quân Thanh – Ngọc Hồi Đống Đa (1789)</span>
        </button>
      </div>

      {/* Thanh 3 Giai Đoạn Tác Chiến Nằm Ngay Trên Đầu Bản Đồ (Bấm là lia Map tức thì) */}
      <div className="battlemap-phase-quickbar card">
        <div className="quickbar-header">
          <Compass size={17} className="text-gold" />
          <span className="quickbar-label">3 GIAI ĐOẠN TÁC CHIẾN (BẤM ĐỂ ĐỊNH VỊ BẢN ĐỒ):</span>
        </div>
        <div className="quickbar-buttons-row">
          {battle.tactics.map((tac, idx) => {
            const isActive = activePhaseIndex === idx;
            return (
              <button
                key={idx}
                className={`quick-phase-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectPhase(tac, idx)}
                title={`Bấm để bản đồ định vị: ${tac.phase}`}
              >
                <span className="pill-step-num">Giai đoạn {idx + 1}</span>
                <span className="pill-phase-name">{tac.phase}</span>
                <span className="pill-phase-tag">{tac.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="battlemap-workspace">
        {/* Leaflet Map Area */}
        <div className="map-view-container">
          <div ref={mapContainerRef} className="leaflet-map-element" id="leaflet-map" />

          {/* Clean 2-layer switcher */}
          <div className="map-layer-controls">
            <span className="layer-label"><Layers size={13} /> Chế độ:</span>
            <button 
              className={`layer-btn ${mapLayerType === 'satellite' ? 'active' : ''}`}
              onClick={() => handleLayerChange('satellite')}
            >
              Vệ tinh
            </button>
            <button 
              className={`layer-btn ${mapLayerType === 'osm' ? 'active' : ''}`}
              onClick={() => handleLayerChange('osm')}
            >
              Địa hình
            </button>
          </div>

          <div className="map-hint-pill">
            <span>Nhấp vào giai đoạn hoặc mũi tên để bản đồ tự động định vị</span>
            <button className="reset-view-pill-btn" onClick={handleResetView} title="Trở về toàn cảnh">
              Toàn cảnh
            </button>
          </div>
        </div>

        {/* Tactical Info Panel */}
        <div className="battle-sidebar-panel">
          
          {/* Card 1: Thẻ Tổng Quan & Thuyết Minh */}
          <div className="battle-card card battle-overview-card">
            <div className="card-top-row">
              <span className="battle-era-badge">CHIẾN DỊCH TIÊU BIỂU</span>
              <span className="battle-time-badge">{battle.time}</span>
            </div>

            <h3 className="battle-main-title">{battle.title}</h3>
            <p className="battle-subtitle-text">{battle.subtitle}</p>

            <div className="battle-meta-grid">
              <div className="meta-box">
                <span className="meta-label">Chỉ huy Tây Sơn:</span>
                <strong className="meta-val gold-accent">{battle.commander}</strong>
              </div>
              <div className="meta-box">
                <span className="meta-label">Chỉ huy giặc:</span>
                <strong className="meta-val enemy-accent">{battle.enemyCommander}</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Thẻ Tiến Trình Tác Chiến */}
          <div className="battle-card card battle-stepper-card">
            <div className="stepper-header">
              <div className="header-title-flex">
                <Compass size={16} className="text-gold" />
                <h4>Tiến Trình Tác Chiến 3 Giai Đoạn</h4>
              </div>
              <span className="stepper-tip">Bấm giai đoạn để xem vị trí</span>
            </div>

            <div className="tactical-stepper-list">
              {battle.tactics.map((tac, idx) => {
                const isActive = activePhaseIndex === idx;
                return (
                  <div 
                    key={idx}
                    className={`stepper-node-card ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectPhase(tac, idx)}
                  >
                    <div className="node-indicator-col">
                      <div className={`node-circle ${isActive ? 'active' : ''}`}>
                        {tac.icon || (idx + 1)}
                      </div>
                      {idx < battle.tactics.length - 1 && <div className="node-line" />}
                    </div>

                    <div className="node-body">
                      <div className="node-header-row">
                        <span className="phase-order-badge">Giai đoạn {idx + 1}</span>
                        <span className="phase-tag">{tac.tag}</span>
                      </div>
                      <h5 className="phase-title">{tac.phase}</h5>
                      <p className="phase-desc">{tac.desc}</p>
                      
                      {isActive && (
                        <div className="phase-active-focus">
                          <span>Đã định vị trọng điểm giai đoạn này</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Thẻ So Sánh Tương Quan Lực Lượng */}
          {battle.forcesComparison && (
            <div className="battle-card card battle-forces-card">
              <div className="forces-card-header">
                <div className="header-title-flex">
                  <Swords size={16} className="text-gold" />
                  <h4>Tương Quan Binh Lực & Khí Giới</h4>
                </div>
                <span className="forces-ratio-tag">Thế trận lấy ít địch nhiều</span>
              </div>

              {/* Progress Bars */}
              <div className="forces-bars-box">
                {/* Quân ta Tây Sơn */}
                <div className="force-bar-item">
                  <div className="force-labels">
                    <span className="force-name ally-name">
                      {battle.forcesComparison.ourForces.name}
                    </span>
                    <strong className="force-count ally-count">
                      {battle.forcesComparison.ourForces.count}
                    </strong>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill ally-fill"
                      style={{ width: `${battle.forcesComparison.ourForces.percent}%` }}
                    />
                  </div>
                  <span className="force-desc">{battle.forcesComparison.ourForces.details}</span>
                </div>

                {/* Quân địch */}
                <div className="force-bar-item">
                  <div className="force-labels">
                    <span className="force-name enemy-name">
                      {battle.forcesComparison.enemyForces.name}
                    </span>
                    <strong className="force-count enemy-count">
                      {battle.forcesComparison.enemyForces.count}
                    </strong>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill enemy-fill"
                      style={{ width: `${battle.forcesComparison.enemyForces.percent}%` }}
                    />
                  </div>
                  <span className="force-desc">{battle.forcesComparison.enemyForces.details}</span>
                </div>
              </div>

              <div className="forces-summary-callout">
                <Info size={15} className="callout-icon text-gold" />
                <p>{battle.forcesComparison.ratioNote}</p>
              </div>
            </div>
          )}

          {/* Selected Feature Info Popup Card */}
          {selectedFeature && (
            <motion.div 
              className="battle-card card selected-flow-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="selected-card-header">
                <MapPin size={16} className="text-gold" />
                <strong>Chi tiết: {selectedFeature.data.title}</strong>
              </div>
              <p className="selected-card-desc">{selectedFeature.data.desc}</p>
              <button className="clear-selection-btn" onClick={() => setSelectedFeature(null)}>
                Đóng chi tiết
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
