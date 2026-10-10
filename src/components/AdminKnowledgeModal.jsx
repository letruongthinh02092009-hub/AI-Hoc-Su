import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle, 
  X, 
  Lock, 
  BookOpen, 
  Upload,
  FileText,
  AlertCircle 
} from 'lucide-react';
import { 
  getKnowledgeBase, 
  addKnowledgeItem, 
  deleteKnowledgeItem, 
  resetKnowledgeBase,
  saveKnowledgeBase
} from '../services/geminiService';
import { playChime, playCorrectSound } from '../utils/audio';
import mammoth from 'mammoth';

const ADMIN_PASSCODE = '1789'; // Mật khẩu năm đại phá quân Thanh 1789

export default function AdminKnowledgeModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [knowledgeList, setKnowledgeList] = useState([]);

  // Form thêm thủ công
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Chiến dịch & Nhân vật');
  const [source, setSource] = useState('');
  const [content, setContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Upload file state
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKnowledgeList(getKnowledgeBase());
    }
  }, [isOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setErrorMsg('');
      playCorrectSound();
    } else {
      setErrorMsg('Mã PIN chưa chính xác (Gợi ý: Năm đại phá quân Thanh 1789)');
      playChime(300, 'sawtooth', 0.2);
    }
  };

  // Xử lý tải file tư liệu lên (.docx, .txt, .md, .json)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    setUploadedFileName(fileName);

    // 1. Xử lý file Microsoft Word (.docx)
    if (fileName.toLowerCase().endsWith('.docx')) {
      const docxReader = new FileReader();
      docxReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value || '';
          if (!text.trim()) {
            alert('File Word không có nội dung văn bản.');
            return;
          }
          const defaultTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setTitle(defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1));
          setContent(text.trim());
          setSource(`Tài liệu Word: ${fileName} (Lê Trường Thịnh phê duyệt)`);
          setSuccessMsg(`Đã trích xuất thành công nội dung từ file Word "${fileName}"! Hãy kiểm tra và nhấn "Lưu vào kho tư liệu".`);
          playCorrectSound();
          setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
          alert('Không thể đọc file Word: ' + err.message);
        }
      };
      docxReader.readAsArrayBuffer(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Xử lý file văn bản (.txt, .md) hoặc cấu trúc (.json)
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileText = event.target?.result;
      if (typeof fileText !== 'string') return;

      if (fileName.endsWith('.json')) {
        try {
          const parsed = JSON.parse(fileText);
          if (Array.isArray(parsed)) {
            // Nhập hàng loạt từ file JSON
            const currentKb = getKnowledgeBase();
            const formatted = parsed.map((item, idx) => ({
              id: 'kb-' + Date.now() + '-' + idx,
              title: item.title || `Tư liệu ${idx + 1}`,
              category: item.category || 'Tư liệu bổ sung',
              authorApproved: 'Lê Trường Thịnh (12A8 THPT Nguyễn Huệ)',
              source: item.source || fileName,
              content: item.content || ''
            }));
            const combined = [...formatted, ...currentKb];
            saveKnowledgeBase(combined);
            setKnowledgeList(combined);
            setSuccessMsg(`Đã nhập thành công ${formatted.length} mục từ file ${fileName}!`);
            playCorrectSound();
            setTimeout(() => setSuccessMsg(''), 4000);
            return;
          }
        } catch (err) {
          alert('File JSON không đúng định dạng mảng tài liệu.');
          return;
        }
      }

      // Xử lý file .txt hoặc .md
      const defaultTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1));
      setContent(fileText.trim());
      setSource(`Tệp đính kèm: ${fileName} (Lê Trường Thịnh)`);
      setSuccessMsg(`Đã đọc nội dung file "${fileName}". Bạn hãy kiểm tra lại và nhấn "Lưu vào kho tư liệu"!`);
      playCorrectSound();
      setTimeout(() => setSuccessMsg(''), 4000);
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung sử liệu.');
      return;
    }

    addKnowledgeItem({
      title: title.trim(),
      category: category,
      source: source.trim() || 'Tư liệu khảo cứu (Lê Trường Thịnh phê duyệt)',
      content: content.trim()
    });

    setKnowledgeList(getKnowledgeBase());
    setTitle('');
    setSource('');
    setContent('');
    setUploadedFileName('');
    setSuccessMsg('Đã lưu thành công tư liệu mới vào hệ thống RAG!');
    playCorrectSound();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này khỏi kho?')) {
      const updated = deleteKnowledgeItem(id);
      setKnowledgeList(updated);
      playChime(400, 'sine', 0.1);
    }
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục lại kho tư liệu sử học chuẩn ban đầu?')) {
      const reseted = resetKnowledgeBase();
      setKnowledgeList(reseted);
      playChime(600, 'triangle', 0.2);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div 
          className="admin-modal-card cyber-glass-card"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="admin-modal-header">
            <div className="header-badge-title">
              <ShieldCheck className="header-icon" size={24} />
              <div>
                <h3>Quản Trị Kho Tri Thức Sử Học</h3>
                <span className="sub-tag">Phê duyệt dữ liệu: Lê Trường Thịnh (Lớp 12A8)</span>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="admin-modal-body">
            {!isAuthenticated ? (
              // Form đăng nhập PIN
              <div className="admin-login-box">
                <div className="lock-icon-wrapper">
                  <Lock size={32} />
                </div>
                <h4>Xác Thực Quyền Tác Giả</h4>
                <p>Nhập mã PIN để truy cập bảng nạp dữ liệu và tải file tài liệu vào kho.</p>

                <form onSubmit={handleLogin}>
                  <div className="pin-input-group">
                    <input 
                      type="password"
                      placeholder="Nhập mã PIN bí mật..."
                      value={passcode}
                      onChange={e => setPasscode(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="login-btn">Mở Khóa</button>
                  </div>
                  {errorMsg && <div className="pin-error-text">{errorMsg}</div>}
                </form>
              </div>
            ) : (
              // Bảng điều khiển Quản trị: Thêm qua file hoặc Thêm thủ công
              <div className="admin-content-layout">
                {/* Cột trái: Thêm tài liệu */}
                <div className="admin-add-col">
                  {/* Khu vực Upload File */}
                  <div className="upload-file-card">
                    <div className="upload-header">
                      <Upload size={18} className="upload-icon" />
                      <strong>Tải File Word (.docx), Văn Bản (.txt, .md) hoặc Dữ Liệu (.json)</strong>
                    </div>
                    <p className="upload-desc">
                      Tự động trích xuất nội dung văn bản từ tài liệu Microsoft Word hoặc file văn bản để nạp vào kho tri thức RAG của Sử Quan AI.
                    </p>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept=".docx,.txt,.md,.json" 
                      style={{ display: 'none' }} 
                    />

                    <button 
                      type="button" 
                      className="btn-select-file"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileText size={16} />
                      <span>{uploadedFileName ? `Đã chọn: ${uploadedFileName}` : 'Chọn file Word (.docx) hoặc Text (.txt, .md)'}</span>
                    </button>
                  </div>

                  <div className="divider-or">
                    <span>HOẶC NHẬP THỦ CÔNG</span>
                  </div>

                  <form onSubmit={handleAdd} className="add-kb-form">
                    <div className="form-group">
                      <label>Tiêu đề sử liệu:</label>
                      <input 
                        type="text" 
                        placeholder="Vd: Chi tiết chiến thuật nghi binh tại Hà Hồi..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Phân loại chủ đề:</label>
                      <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="Chiến dịch & Nhân vật">Chiến dịch & Nhân vật</option>
                        <option value="Nghệ thuật quân sự">Nghệ thuật quân sự</option>
                        <option value="Văn hóa & Chính sách">Văn hóa & Chính sách</option>
                        <option value="Hành quân & Hậu cần">Hành quân & Hậu cần</option>
                        <option value="Tư liệu bổ sung">Tư liệu bổ sung</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Nguồn trích dẫn:</label>
                      <input 
                        type="text" 
                        placeholder="Vd: Đại Nam Thực Lục, Hoàng Lê Nhất Thống Chí..."
                        value={source}
                        onChange={e => setSource(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Nội dung chi tiết (AI sẽ ưu tiên 100% phần này):</label>
                      <textarea 
                        rows="5"
                        placeholder="Nhập nội dung tư liệu sử học hoặc nội dung đã đọc từ file..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                      />
                    </div>

                    {successMsg && (
                      <div className="add-success-banner">
                        <CheckCircle size={16} /> {successMsg}
                      </div>
                    )}

                    <button type="submit" className="submit-kb-btn">
                      <Plus size={18} /> Lưu Vào Kho Tư Liệu
                    </button>
                  </form>
                </div>

                {/* Cột phải: Danh mục tài liệu đã nạp */}
                <div className="admin-list-col">
                  <div className="list-col-header">
                    <h4>Kho Sử Liệu Đã Nạp ({knowledgeList.length} tài liệu)</h4>
                    <button className="reset-kb-btn" onClick={handleReset} title="Khôi phục mặc định">
                      <RotateCcw size={14} /> Khôi phục ban đầu
                    </button>
                  </div>

                  <div className="knowledge-cards-scroll">
                    {knowledgeList.map((item) => (
                      <div key={item.id} className="admin-doc-card">
                        <div className="doc-card-header">
                          <span className="doc-cat-tag">{item.category}</span>
                          <button 
                            className="del-doc-btn" 
                            onClick={() => handleDelete(item.id)}
                            title="Xóa tài liệu này"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <h5 className="doc-title">{item.title}</h5>
                        <p className="doc-excerpt">{item.content.slice(0, 150)}...</p>
                        <div className="doc-source-footer">
                          <span>📚 {item.source}</span>
                          <span>✓ {item.authorApproved}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
