/**
 * Tiện ích tạo ảnh Giấy Chứng Nhận Vinh Danh Sử Học Tây Sơn bằng HTML5 Canvas
 * Tách độc lập từ QuizArenaTab theo kiến trúc Single Responsibility Principle
 */

export function generateCertificateCanvas({
  studentName = 'Lê Trường Thịnh',
  totalScore = 300,
  rankTitle = 'THỦ KHOA SỬ HỌC TÂY SƠN (XUẤT SẮC)',
  date = new Date()
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');

  // Nền giấy lụa hoàng gia
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Khung viền ngoài màu son đậm (Vermilion Lacquer)
  ctx.strokeStyle = '#9E2A2B';
  ctx.lineWidth = 14;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  // Khung viền chỉ vàng kim (Metallic Gold)
  ctx.strokeStyle = '#C5A059';
  ctx.lineWidth = 4;
  ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

  // Hoa văn 4 góc truyền thống
  const drawCorner = (x, y, flipX, flipY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX, flipY);
    ctx.strokeStyle = '#C5A059';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(20, 20, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(70, 70, 1, 1);
  drawCorner(canvas.width - 70, 70, -1, 1);
  drawCorner(70, canvas.height - 70, 1, -1);
  drawCorner(canvas.width - 70, canvas.height - 70, -1, -1);

  // Quốc hiệu tiêu ngữ
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 24px "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', canvas.width / 2, 115);
  ctx.font = 'italic 20px "Times New Roman", serif';
  ctx.fillText('Độc lập – Tự do – Hạnh phúc', canvas.width / 2, 148);

  // Dải phân cách hoa văn vàng
  ctx.strokeStyle = '#C5A059';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 140, 168);
  ctx.lineTo(canvas.width / 2 + 140, 168);
  ctx.stroke();

  // Tiêu đề Giấy Chứng Nhận
  ctx.fillStyle = '#9E2A2B';
  ctx.font = 'bold 50px "Times New Roman", Georgia, serif';
  ctx.fillText('GIẤY CHỨNG NHẬN VINH DANH', canvas.width / 2, 245);

  ctx.fillStyle = '#C5A059';
  ctx.font = 'bold 26px "Times New Roman", serif';
  ctx.fillText('AM HIỂU LỊCH SỬ PHONG TRÀO TÂY SƠN', canvas.width / 2, 290);

  // Nội dung vinh danh
  ctx.fillStyle = '#44403C';
  ctx.font = '22px "Times New Roman", serif';
  ctx.fillText('Hội đồng Khảo cứu & Giáo dục Di sản Kỹ thuật số trân trọng chứng nhận:', canvas.width / 2, 360);

  // Tên học sinh
  ctx.fillStyle = '#9E2A2B';
  ctx.font = 'bold 44px "Times New Roman", Georgia, serif';
  ctx.fillText(studentName || 'Lê Trường Thịnh', canvas.width / 2, 425);

  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 22px "Times New Roman", serif';
  ctx.fillText('Lớp 12A8 — Trường THPT Nguyễn Huệ', canvas.width / 2, 470);

  ctx.fillStyle = '#44403C';
  ctx.font = '22px "Times New Roman", serif';
  ctx.fillText('Đã hoàn thành xuất sắc toàn bộ 3 cấp độ thử thách Đấu trường Sử học Tây Sơn:', canvas.width / 2, 530);
  ctx.fillText('• Khởi Khái Môn (Cơ bản)   • Binh Pháp Khắc Địch (Nâng cao)   • Kỳ Tài Vương Triều (Chuyên sâu)', canvas.width / 2, 565);

  // Bảng thành tích
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 24px "Times New Roman", serif';
  ctx.fillText(`Tổng điểm tích lũy: ${totalScore} / 300 Điểm`, canvas.width / 2, 630);
  ctx.fillStyle = '#15803D';
  ctx.fillText(`Danh hiệu phong tặng: ${rankTitle}`, canvas.width / 2, 670);

  // Ngày tháng
  const certDate = date instanceof Date ? date : new Date(date);
  const dateStr = `Ngày ${certDate.getDate()} tháng ${certDate.getMonth() + 1} năm ${certDate.getFullYear()}`;
  ctx.fillStyle = '#44403C';
  ctx.font = 'italic 20px "Times New Roman", serif';
  ctx.fillText(dateStr, canvas.width - 320, 770);

  ctx.font = 'bold 22px "Times New Roman", serif';
  ctx.fillText('BAN KHẢO CỨU SỬ HỌC', canvas.width - 320, 810);
  ctx.font = 'italic 18px "Times New Roman", serif';
  ctx.fillText('(Ký tên và chứng thực)', canvas.width - 320, 840);

  // Mộc đỏ triều Quang Trung
  ctx.save();
  ctx.translate(canvas.width - 320, 920);
  ctx.strokeStyle = '#DC2626';
  ctx.fillStyle = '#DC2626';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = 'bold 13px "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText('ĐẠI VIỆT', 0, -22);
  ctx.font = 'bold 15px "Times New Roman", serif';
  ctx.fillText('QUANG TRUNG', 0, 2);
  ctx.fillText('HOÀNG ĐẾ', 0, 22);
  ctx.font = '10px "Times New Roman", serif';
  ctx.fillText('1788 - 1792', 0, 38);
  ctx.restore();

  return canvas.toDataURL('image/png');
}
