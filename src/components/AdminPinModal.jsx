import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, KeyRound, X, Check, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { playChime, playCorrectSound, playWrongSound } from '../utils/audio';

export default function AdminPinModal() {
  const { isPinModalOpen, setIsPinModalOpen, loginAdmin } = useAdmin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isPinModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(pin)) {
      playCorrectSound();
      setPin('');
      setError(false);
    } else {
      playWrongSound();
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  const handleClose = () => {
    setIsPinModalOpen(false);
    setPin('');
    setError(false);
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={handleClose}>
        <motion.div 
          className="admin-pin-modal-card"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          <button className="close-pin-modal-btn" onClick={handleClose}>
            <X size={18} />
          </button>

          <div className="pin-modal-header">
            <div className="pin-modal-icon-badge">
              <Shield size={24} className="pin-shield-icon" />
            </div>
            <h3>Kích Hoạt Chế Độ Quản Trị</h3>
            <p>Dành riêng cho tác giả (Lê Trường Thịnh) để chỉnh sửa ảnh bảo tàng, xóa/quản lý đánh giá và cấu hình hệ thống.</p>
          </div>

          <form onSubmit={handleSubmit} className="pin-form">
            <div className="pin-input-group">
              <KeyRound size={18} className="pin-input-icon" />
              <input 
                type="password" 
                placeholder="Nhập mã PIN bảo mật..."
                value={pin}
                onChange={e => setPin(e.target.value)}
                autoFocus
                maxLength={10}
              />
            </div>

            {error && (
              <div className="pin-error-notice">
                <AlertCircle size={14} />
                <span>Mã PIN không chính xác. Vui lòng thử lại!</span>
              </div>
            )}

            <div className="pin-actions-row">
              <button type="button" className="btn-pin-cancel" onClick={handleClose}>
                Hủy bỏ
              </button>
              <button type="submit" className="btn-pin-submit">
                <Check size={16} />
                <span>Xác nhận mở quyền</span>
              </button>
            </div>
          </form>

          <div className="pin-modal-footer-note">
            <span>Khách tham quan chỉ xem nội dung. Chế độ này dành cho tác giả quản trị.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
