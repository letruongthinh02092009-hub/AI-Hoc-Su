export default async function handler(req, res) {
  // Cho phép CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ID mặc định của file Google Docs người dùng cung cấp
  const DEFAULT_DOC_ID = '1yWiKZdHJlovfvMzfBOaFTW3auEaKyKcEMBUOU68BPSE';

  // Lấy Document ID từ query nếu có, hoặc dùng mặc định
  const { id, url } = req.query;
  let docId = id;

  if (!docId && url) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) docId = match[1];
  }

  if (!docId) {
    docId = DEFAULT_DOC_ID;
  }

  try {
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const response = await fetch(exportUrl, { redirect: 'follow' });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Không thể đọc file Google Docs. Vui lòng đảm bảo file đã bật Chia sẻ: "Bất kỳ ai có đường liên kết đều có thể xem".' 
      });
    }

    const text = await response.text();
    return res.status(200).json({ 
      success: true, 
      docId: docId, 
      text: text 
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
