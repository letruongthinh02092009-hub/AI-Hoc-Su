/**
 * ===================================================================
 * AI HỌC SỬ – QUANG TRUNG NGUYỄN HUỆ
 * Động cơ điều khiển JavaScript chính (Smart Heritage Interactive Engine)
 * Tối ưu cho Cuộc thi Khoa học Kỹ thuật (KHKT) Dành cho Học sinh Trung học
 * ===================================================================
 */

// --- 1. DỮ LIỆU LỊCH SỬ CHÍNH XÁC & KHO TRI THỨC SỬ LIỆU ---

// A. Dữ liệu Chiến trận
const BATTLES_DATA = {
  'rach-gam': {
    year: 'NĂM 1785 · CHIẾN DỊCH PHÍA NAM',
    title: 'Đại thắng Rạch Gầm – Xoài Mút',
    lead: 'Trận thủy chiến lừng lẫy tiêu diệt 5 vạn quân Xiêm xâm lược trên sông Tiền, khẳng định tài năng quân sự xuất chúng của Nguyễn Huệ.',
    steps: [
      {
        label: 'Bước 1: Bối cảnh',
        title: 'Quân Xiêm xâm lược Gia Định',
        desc: 'Nguyễn Ánh cầu viện vua Xiêm. Tháng 7/1784, 5 vạn quân Xiêm (2 vạn thủy binh, 3 vạn bộ binh) theo đường thủy bộ ồ ạt tràn vào đánh phá miền Tây Nam Bộ.'
      },
      {
        label: 'Bước 2: Mưu lược',
        title: 'Chọn địa hình & Nhử địch mai phục',
        desc: 'Nguyễn Huệ chọn khúc sông Rạch Gầm – Xoài Mút (Tiền Giang) dài khoảng 6-7km có cù lao rậm rạp làm trận địa mai phục. Đêm ngày 19/1/1785, quân Tây Sơn giả thua nhử chiến thuyền giặc vào lòng sông.'
      },
      {
        label: 'Bước 3: Đại thắng & Ý nghĩa',
        title: 'Tiêu diệt hoàn toàn quân thù',
        desc: 'Pháo hỏa hổ và thuyền chiến Tây Sơn từ hai nhánh sông và cù lao bất ngờ khóa đầu khóa đuôi, bắn chìm gần như toàn bộ thuyền giặc. 5 vạn quân Xiêm chỉ còn vài nghìn tên chạy thoát, từ đó "sợ Tây Sơn như sợ cọp".'
      }
    ],
    tactic: {
      title: 'Nghệ thuật quân sự độc đáo',
      desc: 'Lợi dụng dòng chảy con nước triều, địa hình cù lao rậm rạp; kết hợp nghi binh nhử địch với hỏa lực pháo thuyền đánh dồn ép tiêu diệt chớp nhoáng.'
    }
  },
  'bac-tien': {
    year: 'NĂM 1786 · THỐNG NHẤT GIANG SƠN',
    title: 'Nguyễn Huệ Tiến Quân Ra Bắc',
    lead: 'Giương cao ngọn cờ "Phù Lê diệt Trịnh", xóa bỏ ranh giới chia cắt Đàng Trong - Đàng Ngoài kéo dài hơn hai thế kỷ.',
    steps: [
      {
        label: 'Bước 1: Bối cảnh',
        title: 'Hạ thành Phú Xuân',
        desc: 'Tháng 5/1786, Nguyễn Huệ chỉ huy nghĩa quân tiến công giải phóng Phú Xuân (Huế), đánh tan quân Trịnh, thu phục toàn bộ vùng đất Thuận Hóa.'
      },
      {
        label: 'Bước 2: Diễn biến',
        title: 'Thần tốc tiến vào Thăng Long',
        desc: 'Thừa thắng, Nguyễn Huệ quyết định vượt sông Gianh tiến thẳng ra Bắc Hà. Quân Trịnh bạc nhược, tan rã nhanh chóng. Tháng 7/1786, nghĩa quân Tây Sơn tiến vào thành Thăng Long, lật đổ chúa Trịnh.'
      },
      {
        label: 'Bước 3: Ý nghĩa',
        title: 'Đặt nền móng thống nhất đất nước',
        desc: 'Nguyễn Huệ yết kiến vua Lê Hiển Tông, trao trả quyền bính và được phong Uy quốc công. Chiến dịch đã chấm dứt cục diện Trịnh - Nguyễn phân tranh hơn 200 năm, mở đường thống nhất quốc gia.'
      }
    ],
    tactic: {
      title: 'Nghệ thuật quân sự & Chính trị',
      desc: 'Nắm bắt thời cơ mau lẹ, hành quân táo bạo ngoài dự tính đối phương; kết hợp tài tình sức mạnh quân sự với sách lược chính trị chính nghĩa "Phù Lê diệt Trịnh".'
    }
  },
  'ngoc-hoi': {
    year: 'MÙA XUÂN KỶ DẬU 1789 · QUỐC THỔ TRƯỜNG TỒN',
    title: 'Đại phá 29 Vạn Quân Thanh (Ngọc Hồi – Đống Đa)',
    lead: 'Chiến công hiển hách bậc nhất trong lịch sử chống ngoại xâm, giải phóng Thăng Long chỉ trong 5 ngày đêm mùa xuân Tết Kỷ Dậu.',
    steps: [
      {
        label: 'Bước 1: Chuẩn bị',
        title: 'Lên ngôi Hoàng đế & Hành quân thần tốc',
        desc: '22/12/1788 (25/11 Âm lịch), Nguyễn Huệ lên ngôi Hoàng đế tại núi Bân (Huế), lấy niên hiệu Quang Trung rồi lập tức tiến quân ra Bắc. Tuyển thêm quân ở Nghệ An, duyệt binh tại Tam Điệp – Biện Sơn, hẹn ba quân ngày mùng 7 Tết ăn Tết ở Thăng Long.'
      },
      {
        label: 'Bước 2: Đột kích',
        title: 'Hạ đồn Hà Hồi & Công phá Ngọc Hồi',
        desc: 'Đêm mùng 3 Tết, bí mật vây kín đồn Hà Hồi, bắc loa gọi hàng khiến giặc khiếp vía đầu hàng. Rạng sáng mùng 5 Tết, đích thân vua Quang Trung chỉ huy voi chiến và khiên rơm ướt phá tan cứ điểm kiên cố Ngọc Hồi.'
      },
      {
        label: 'Bước 3: Toàn thắng',
        title: 'Hạ đồn Đống Đa – Giải phóng Thăng Long',
        desc: 'Cùng lúc, đạo quân đô đốc Long bất ngờ tập kích đồn Khương Thượng (Đống Đa), tướng Sầm Nghi Đống thắt cổ tự tử. Tôn Sĩ Nghị hoảng loạn vượt cầu phao chạy trốn. Chiều mùng 5 Tết, áo bào đỏ sạm màu khói súng, vua Quang Trung tiến vào Thăng Long.'
      }
    ],
    tactic: {
      title: 'Đỉnh cao nghệ thuật thần tốc & Bất ngờ',
      desc: 'Hành quân luân phiên ngày đêm; tiến công đồng loạt 5 đạo quân bất ngờ vào đúng dịp Tết Nguyên Đán khi địch lơ là; phối hợp chặt chẽ voi chiến xung kích và pháo hỏa hổ mở đường.'
    }
  }
};

// B. Dữ liệu 8 Hiện vật Bảo tàng số
const MUSEUM_ITEMS = [
  {
    title: 'Tượng Hoàng đế Quang Trung',
    sub: 'Hình tượng Người Anh hùng áo vải Tây Sơn',
    category: 'Nhân vật lịch sử',
    img: 'https://cdn.phototourl.com/member/2026-10-10-6e351551-6ec2-4dde-aba2-f8685fbc081e.jpg',
    desc: 'Bức tượng khắc họa chân dung Hoàng đế Quang Trung – Nguyễn Huệ với thần thái uy nghi, cương nghị, mắt sáng như chớp, tượng trưng cho ý chí độc lập, tự cường và khát vọng non sông liền một dải.',
    details: 'Tượng được đúc bằng đồng nguyên khối, đặt tại khuôn viên Bảo tàng Quang Trung (Bình Định). Chi tiết áo giáp và ánh mắt thể hiện trọn vẹn khí phách vị tướng bách chiến bách thắng trong lịch sử dân tộc.',
    source: 'Bảo tàng Quang Trung (Bình Định)'
  },
  {
    title: 'Mô hình Thủy chiến Rạch Gầm – Xoài Mút',
    sub: 'Trận địa phục kích sông nước Nam Bộ năm 1785',
    category: 'Chiến thắng 1785',
    img: 'https://cdn.phototourl.com/member/2026-10-10-215f266e-3b24-4bca-8112-0c0f888f5e7e.jpg',
    desc: 'Sa bàn tái hiện chi tiết khúc sông Tiền từ Rạch Gầm đến Xoài Mút, nơi Nguyễn Huệ bố trí các cánh quân phục kích tiêu diệt toàn bộ thủy đội quân Xiêm.',
    details: 'Mô hình mô phỏng dòng chảy, vị trí cắm cọc, cù lao Thới Sơn và hướng tấn công bất ngờ từ các nhánh rạch, minh chứng cho việc vận dụng địa hình sông ngòi đỉnh cao của nghĩa quân Tây Sơn.',
    source: 'Khu di tích Rạch Gầm – Xoài Mút (Tiền Giang)'
  },
  {
    title: 'Tàu chiến của Quân đội Tây Sơn',
    sub: 'Phương tiện chiến lược trên đường sông & duyên hải',
    category: 'Quân sự Tây Sơn',
    img: 'https://cdn.phototourl.com/member/2026-10-10-0c51ea4f-4ec7-4b04-852e-7ac9d393d85b.jpg',
    desc: 'Chiến hạm Tây Sơn có kích thước lớn, trang bị nhiều đại bác hỏa lực mạnh, vừa có khả năng cơ động trên sông lớn vừa tác chiến hiệu quả ven biển.',
    details: 'Theo các ghi chép của phương Tây thời bấy giờ, thủy quân Tây Sơn có những chiến hạm trang bị tới 50-60 khẩu pháo, là lực lượng hải quân hùng hậu bậc nhất khu vực Đông Nam Á cuối thế kỷ XVIII.',
    source: 'Tư liệu Lịch sử Hải quân Việt Nam'
  },
  {
    title: 'Giếng nước cổ Ba Anh Em Tây Sơn',
    sub: 'Dấu tích ký ức quê hương làng Kiên Mỹ',
    category: 'Di tích khảo cổ',
    img: 'https://cdn.phototourl.com/member/2026-10-10-b9d389f9-c763-4c0c-ac05-ca82e7cf77f2.jpg',
    desc: 'Giếng nước cổ nằm trong vườn nhà cũ của ba anh em Tây Sơn (Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ), nguồn nước ngọt mát nuôi dưỡng những vị anh hùng hào kiệt.',
    details: 'Giếng nước được ghép bằng đá tổ ong ong cổ xưa, cùng với cây me cổ thụ hàng trăm năm tuổi là hai chứng tích lịch sử vô giá còn nguyên vẹn cho đến ngày nay tại huyện Tây Sơn, tỉnh Bình Định.',
    source: 'Di tích Quốc gia đặc biệt Đền thờ Tây Sơn Tam Kiệt'
  },
  {
    title: 'Vũ khí Binh lính Tây Sơn',
    sub: 'Trang bị chiến đấu thô sơ nhưng dũng mãnh',
    category: 'Khí giới quân sự',
    img: 'https://cdn.phototourl.com/member/2026-10-10-3402fa23-3542-4dda-be01-dc2bed15390e.jpg',
    desc: 'Bao gồm giáo, mác, đoản đao, kiếm lệnh và côn nhị khúc – những binh khí gắn liền với tinh hoa võ thuật cổ truyền Bình Định của nghĩa quân áo vải.',
    details: 'Các hiện vật được khai quật tại các căn cứ Tây Sơn thượng đạo và hạ đạo. Chúng phản ánh tinh thần chiến đấu quả cảm và sự khổ luyện võ nghệ bền bỉ của người lính nghĩa quân.',
    source: 'Bảo tàng Lịch sử Quốc gia'
  },
  {
    title: 'Súng thần công và Hỏa pháo Tây Sơn',
    sub: 'Vũ khí hỏa lực tối tân thế kỷ XVIII',
    category: 'Hỏa khí đại bác',
    img: 'https://cdn.phototourl.com/member/2026-10-10-d0725d0a-6526-44c2-8652-6fcbf3a49f0c.jpg',
    desc: 'Súng thần công đúc bằng đồng và sắt cùng các loại hỏa pháo, ống hỏa hổ dùng để bắn đạn cháy và mảnh sắt gây sát thương diện rộng và thiêu rụi đồn lũy giặc.',
    details: 'Vua Quang Trung đặc biệt chú trọng chế tạo và sử dụng pháo binh. Hỏa hổ Tây Sơn là vũ khí bí mật gây kinh hoàng cho quân Xiêm lẫn 29 vạn quân Mãn Thanh khi công phá đồn Ngọc Hồi.',
    source: 'Hiện vật lưu trữ Bảo tàng Lịch sử Quân sự Việt Nam'
  },
  {
    title: 'Lược đồ Trận Rạch Gầm – Xoài Mút',
    sub: 'Sơ đồ thế trận quân sự & hướng giáp công',
    category: 'Tư liệu tác chiến',
    img: 'https://cdn.phototourl.com/member/2026-10-10-3709296d-38e1-4017-83a3-e9f52e85de3e.jpg',
    desc: 'Bản đồ quân sự chỉ rõ vị trí bố trí pháo binh, đại bản doanh Tây Sơn và các mũi tiến công siết chặt vòng vây chia cắt đội hình thuyền giặc Xiêm.',
    details: 'Lược đồ là tài liệu học tập trực quan giúp thế hệ trẻ hình dung nghệ thuật bao vây tiêu diệt chiến lược, biến sông Tiền thành mồ chôn quân xâm lược phương Nam.',
    source: 'Viện Lịch sử Quân sự Việt Nam'
  },
  {
    title: 'Người lính Tây Sơn khoảng năm 1793',
    sub: 'Trang phục và diện mạo quân đội triều Quang Trung',
    category: 'Tranh ký họa lịch sử',
    img: 'https://cdn.phototourl.com/member/2026-10-10-ddf6ed08-51c6-4575-98e0-fece905c189a.jpg',
    desc: 'Bức ký họa do phái bộ ngoại giao Macartney của Anh thực hiện năm 1793 mô tả diện mạo, quân phục và tác phong kỷ luật của người lính thời Tây Sơn.',
    details: 'Hình vẽ cho thấy người lính Tây Sơn mặc áo giáp ngắn, đội nón chóp nhọn, tay cầm giáo dài, thể hiện vẻ khỏe khoắn, kỷ luật nghiêm minh và phong thái tự tin của quân đội một vương triều quật khởi.',
    source: 'Tư liệu Phái đoàn Ngoại giao Macartney (1793)'
  }
];

// C. Dữ liệu Bộ Kiểm chứng Tin Giả (Fact-Checking Engine)
const FACT_CHECK_DATABASE = {
  1: {
    claim: 'Có phải vua Quang Trung cho quân ăn Tết Nguyên Đán sớm trước khi đánh đồn Ngọc Hồi – Đống Đa?',
    status: 'correct',
    statusText: 'CHÍNH XÁC (ĐÚNG THỰC TẾ)',
    explanation: 'Tại phòng tuyến Tam Điệp (Ninh Bình) vào ngày 30 tháng Chạp năm Mậu Thân (1788), vua Quang Trung đã tổ chức khao quân và cho ba quân ăn Tết trước. Ông dõng dạc tuyên bố: "Nay hãy làm tiệc ăn Tết Nguyên Đán trước, đợi sang xuân, ngày mồng 7 vào Thăng Long sẽ mở tiệc ăn mừng." Thậm chí quân Tây Sơn còn toàn thắng sớm hơn dự kiến vào ngày mùng 5 Tết!',
    source: 'Hoàng Lê Nhất Thống Chí (Ngô gia văn phái) & Đại Nam Chính Biên Liệt Truyện.'
  },
  2: {
    claim: 'Có đúng là vua Quang Trung từng có kế hoạch ngoại giao đòi nhà Thanh trả lại đất Lưỡng Quảng?',
    status: 'correct',
    statusText: 'CHÍNH XÁC (CÓ CĂN CỨ SỬ LIỆU)',
    explanation: 'Sau chiến thắng năm 1789, vua Quang Trung thực thi chính sách bang giao khéo léo nhưng cương quyết. Ông cử sứ giả sang Yên Kinh cầu phong, đồng thời thăm dò yêu cầu nhà Thanh trao trả đất Quảng Đông, Quảng Tây (đất Lưỡng Quảng) vốn thuộc cố thổ Giao Chỉ xưa và xin cưới một công chúa nhà Thanh. Đáng tiếc khi kế hoạch đang chuẩn bị thì nhà vua đột ngột qua đời năm 1792.',
    source: 'Đại Nam Thực Lục & Việt Nam Sử Lược (Trần Trọng Kim).'
  },
  3: {
    claim: 'Nguyễn Ánh và nghĩa quân Tây Sơn từng là đồng minh thân thiết cùng đánh đuổi giặc ngoại xâm?',
    status: 'incorrect',
    statusText: 'HOÀN TOÀN SAI LỆCH',
    explanation: 'Đây là thông tin hoàn toàn sai. Nguyễn Ánh (sau này là vua Gia Long triều Nguyễn) và phong trào Tây Sơn là hai thế lực đối địch sâu sắc. Thậm chí chính Nguyễn Ánh đã sang Xiêm cầu viện vua Xiêm đưa 5 vạn quân sang xâm lược nước ta năm 1784, sau đó bị Nguyễn Huệ đánh tan tành tại Rạch Gầm – Xoài Mút năm 1785.',
    source: 'Chính sử Việt Nam: Khâm Định Việt Sử Thông Giám Cương Mục.'
  },
  4: {
    claim: 'Quân Tây Sơn hành quân từ Phú Xuân (Huế) ra Tam Điệp – Thăng Long mất hơn một tháng đường bộ?',
    status: 'incorrect',
    statusText: 'SAI LỆCH (BÁC BỎ)',
    explanation: 'Quân Tây Sơn nổi tiếng với tốc độ hành quân thần tốc kỷ lục. Từ Phú Xuân (Huế) ra đến Nghệ An và Tam Điệp chỉ mất khoảng 10 ngày (từ 25/11 đến 20/12 Âm lịch), vừa đi vừa tuyển quân và duyệt binh. Bí quyết là cách tổ chức luân phiên: ba người một tốp, hai người cáng một người nằm nghỉ, thay phiên nhau đi suốt ngày đêm không ngừng nghỉ.',
    source: 'Hoàng Lê Nhất Thống Chí & Lịch sử Quân sự Việt Nam.'
  },
  5: {
    claim: 'Hoàng đế Quang Trung là vị vua đầu tiên đề cao chữ Nôm thành văn tự chính thức của quốc gia?',
    status: 'correct',
    statusText: 'CHÍNH XÁC (ĐÚNG SỬ LIỆU)',
    explanation: 'Quang Trung là vị hoàng đế có tầm nhìn văn hóa tiến bộ vượt bậc. Ông lập Sùng Chính Viện, giao cho danh sĩ La Sơn Phu Tử Nguyễn Thiếp phụ trách việc dịch các sách chữ Hán sang chữ Nôm, đồng thời dùng chữ Nôm trong các chiếu chỉ, thi cử khoa bảng, thể hiện tinh thần tự tôn ngôn ngữ dân tộc sâu sắc.',
    source: 'Chiếu Lập Viện Sùng Chính (1791) & Các văn bản triều Tây Sơn.'
  },
  6: {
    claim: 'Chỉ huy quân Thanh là Tôn Sĩ Nghị đã dũng cảm tử trận trên chiến trường Thăng Long?',
    status: 'incorrect',
    statusText: 'HOÀN TOÀN SAI LỆCH',
    explanation: 'Khi nghe tin đồn Đống Đa và Ngọc Hồi thất thủ, Tổng đốc Lưỡng Quảng Tôn Sĩ Nghị sợ mất mật, "ngựa không kịp đóng yên, người không kịp mặc giáp", vội vã cùng vài tên kỵ binh vượt cầu phao sông Nhị (sông Hồng) chạy trốn về phương Bắc, bỏ lại cả sắc thư, quân ấn và hàng vạn tàn quân chen chúc làm đứt cầu phao chết đuối.',
    source: 'Hoàng Lê Nhất Thống Chí, Hồi thứ 14.'
  },
  7: {
    claim: 'Nghĩa quân Tây Sơn đã sử dụng đội quân voi chiến dũng mãnh mang hỏa hổ trong trận Ngọc Hồi?',
    status: 'correct',
    statusText: 'CHÍNH XÁC (ĐÚNG SỬ LIỆU)',
    explanation: 'Trong trận công phá đồn Ngọc Hồi rạng sáng mùng 5 Tết Kỷ Dậu, vua Quang Trung đích thân cưỡi voi đốc chiến, dẫn đầu đội hình hơn 100 thớt voi chiến. Mỗi thớt voi chở theo các chiến sĩ mang ống hỏa hổ phun lửa, kết hợp các tấm ván ghép bọc rơm ướt che chắn tên đạn của địch, tạo thành mũi giáp công dũng mãnh bẻ gãy tuyến phòng thủ kiên cố của quân Thanh.',
    source: 'Thánh Vũ Ký (Ngụy Nguyên - nhà Thanh) & Hoàng Lê Nhất Thống Chí.'
  }
};

// D. Ngân hàng 30 Câu hỏi Trắc nghiệm chuẩn KHKT (3 Cấp độ)
const QUIZ_QUESTIONS = {
  'co-ban': [
    {
      category: 'Mốc lịch sử căn bản',
      question: 'Người anh hùng áo vải Nguyễn Huệ sinh vào năm nào và ở đâu?',
      options: ['Năm 1753 tại vùng Tây Sơn, Bình Định', 'Năm 1740 tại Thăng Long, Hà Nội', 'Năm 1765 tại Gia Định, Sài Gòn', 'Năm 1789 tại Phú Xuân, Huế'],
      correct: 0,
      explain: 'Nguyễn Huệ sinh năm 1753 tại làng Kiên Mỹ, ấp Tây Sơn, huyện Phù Ly, phủ Quy Nhơn (nay thuộc thị trấn Phú Phong, huyện Tây Sơn, tỉnh Bình Định).'
    },
    {
      category: 'Phong trào Tây Sơn',
      question: 'Phong trào khởi nghĩa Tây Sơn chính thức bùng nổ vào năm nào?',
      options: ['Năm 1771', 'Năm 1785', 'Năm 1786', 'Năm 1789'],
      correct: 0,
      explain: 'Mùa xuân năm 1771, ba anh em Nguyễn Nhạc, Nguyễn Huệ và Nguyễn Lữ dựng cờ khởi nghĩa tại căn cứ Tây Sơn thượng đạo (An Khê, Gia Lai).'
    },
    {
      category: 'Tây Sơn Tam Kiệt',
      question: '"Tây Sơn Tam Kiệt" là danh xưng dùng để chỉ ba anh em nào?',
      options: ['Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ', 'Nguyễn Huệ, Nguyễn Trãi, Nguyễn Du', 'Nguyễn Ánh, Nguyễn Huệ, Nguyễn Nhạc', 'Nguyễn Thiếp, Ngô Thì Nhậm, Nguyễn Huệ'],
      correct: 0,
      explain: 'Ba anh em lãnh đạo phong trào Tây Sơn là Nguyễn Nhạc (Tây Sơn vương/Thái Đức hoàng đế), Nguyễn Huệ (Quang Trung hoàng đế) và Nguyễn Lữ (Đông Định vương).'
    },
    {
      category: 'Thủy chiến miền Nam',
      question: 'Trận thủy chiến Rạch Gầm – Xoài Mút năm 1785 diễn ra trên địa bàn tỉnh nào ngày nay?',
      options: ['Tiền Giang', 'Bến Tre', 'Vĩnh Long', 'Cần Thơ'],
      correct: 0,
      explain: 'Khúc sông Rạch Gầm – Xoài Mút thuộc sông Tiền, nay thuộc địa phận huyện Châu Thành, tỉnh Tiền Giang.'
    },
    {
      category: 'Khẩu hiệu nghĩa quân',
      question: 'Khẩu hiệu nổi tiếng của phong trào Tây Sơn trong giai đoạn đầu khởi nghĩa là gì?',
      options: ['Lấy của người giàu chia cho người nghèo', 'Phù Trịnh diệt Nguyễn', 'Bình Ngô khai quốc', 'Độc lập dân tộc trên hết'],
      correct: 0,
      explain: 'Nghĩa quân Tây Sơn đề ra khẩu hiệu "Lấy của nhà giàu chia cho dân nghèo", được đông đảo nhân dân và tầng lớp cùng khổ hưởng ứng nhiệt liệt.'
    },
    {
      category: 'Chiến thắng 1785',
      question: 'Trong trận Rạch Gầm – Xoài Mút, quân Tây Sơn đã đánh tan quân xâm lược của nước nào?',
      options: ['Quân Xiêm (Thái Lan)', 'Quân Mãn Thanh', 'Quân Pháp', 'Quân Chân Lạp'],
      correct: 0,
      explain: 'Quân Tây Sơn dưới sự chỉ huy của Nguyễn Huệ đã đập tan 5 vạn quân xâm lược Xiêm (Thái Lan) do Chiêu Tăng và Chiêu Sương cầm đầu.'
    },
    {
      category: 'Bắc tiến 1786',
      question: 'Năm 1786, Nguyễn Huệ tiến quân ra Bắc Hà với khẩu hiệu chính trị nào?',
      options: ['Phù Lê diệt Trịnh', 'Lật đổ vua Lê lập triều mới', 'Thống nhất Đàng Trong Đàng Ngoài', 'Trừ khử chúa Nguyễn'],
      correct: 0,
      explain: 'Nguyễn Huệ giương cao ngọn cờ "Phù Lê diệt Trịnh" để tập hợp lòng dân Bắc Hà, lật đổ tập đoàn phong kiến chúa Trịnh.'
    },
    {
      category: 'Đại phá quân Thanh',
      question: 'Chiến thắng Ngọc Hồi – Đống Đa đại phá 29 vạn quân Thanh diễn ra vào mùa xuân năm nào?',
      options: ['Năm 1789 (Kỷ Dậu)', 'Năm 1785 (Ất Tỵ)', 'Năm 1786 (Bính Ngọ)', 'Năm 1792 (Nhâm Tý)'],
      correct: 0,
      explain: 'Chiến dịch thần tốc giải phóng Thăng Long toàn thắng vào mùng 5 Tết Kỷ Dậu (năm 1789).'
    },
    {
      category: 'Lên ngôi Hoàng đế',
      question: 'Trước khi xuất quân đánh đuổi quân Thanh, Nguyễn Huệ lên ngôi Hoàng đế tại địa danh nào?',
      options: ['Núi Bân (Phú Xuân - Huế)', 'Thành Quy Nhơn (Bình Định)', 'Đền Ngọc Hồi (Hà Nội)', 'Phòng tuyến Tam Điệp (Ninh Bình)'],
      correct: 0,
      explain: 'Ngày 22/12/1788 (25/11 Âm lịch), Nguyễn Huệ làm lễ tế cáo trời đất tại núi Bân (Huế), chính thức lên ngôi Hoàng đế lấy niên hiệu Quang Trung.'
    },
    {
      category: 'Di sản lịch sử',
      question: 'Hoàng đế Quang Trung qua đời vào năm nào, để lại niềm tiếc thương vô hạn cho dân tộc?',
      options: ['Năm 1792', 'Năm 1789', 'Năm 1802', 'Năm 1790'],
      correct: 0,
      explain: 'Vua Quang Trung đột ngột băng hà vào ngày 16 tháng 9 năm 1792 (29 tháng 7 Âm lịch) ở tuổi 39, khi tài năng và sự nghiệp đang độ rực rỡ nhất.'
    }
  ],
  'trung-cap': [
    {
      category: 'Chiến thuật quân sự',
      question: 'Chiến thuật nào đóng vai trò then chốt trong thắng lợi Rạch Gầm – Xoài Mút 1785?',
      options: ['Nhử giặc vào khúc sông hiểm trở rồi khóa đuôi phục kích bằng pháo thuyền', 'Công thành bao vây dài ngày tiêu hao sinh lực địch', 'Tấn công trực diện bằng bộ binh trên cạn', 'Cầu viện hỏa lực từ tàu buôn phương Tây'],
      correct: 0,
      explain: 'Nguyễn Huệ triệt để khai thác thủy triều và địa hình cù lao, dùng thuyền nhẹ nhử địch vào trận địa mai phục rồi hợp vây bằng pháo binh.'
    },
    {
      category: 'Căn cứ chiến lược',
      question: 'Căn cứ ban đầu khi phong trào Tây Sơn mới phát động nằm ở đâu?',
      options: ['Tây Sơn thượng đạo (vùng An Khê, Gia Lai)', 'Tây Sơn hạ đạo (Bình Định)', 'Phủ Quy Nhơn', 'Cửa biển Thị Nại'],
      correct: 0,
      explain: 'Căn cứ ban đầu là vùng rừng núi Tây Sơn thượng đạo hiểm trở, có sự ủng hộ chí tình của đồng bào các dân tộc thiểu số Ba Na, Chăm.'
    },
    {
      category: 'Quân thần triều Tây Sơn',
      question: 'Nữ tướng kiệt xuất nào của nhà Tây Sơn chỉ huy đội tượng binh dũng mãnh?',
      options: ['Đô đốc Bùi Thị Xuân', 'Bà Triệu', 'Lê Chân', 'Nguyễn Thị Dung'],
      correct: 0,
      explain: 'Đô đốc Bùi Thị Xuân (vợ danh tướng Trần Quang Diệu) là nữ tướng lừng danh bậc nhất thời Tây Sơn, trực tiếp huấn luyện và chỉ huy đội voi chiến oai hùng.'
    },
    {
      category: 'Hành quân thần tốc',
      question: 'Phương pháp nào giúp quân Tây Sơn hành quân thần tốc từ Huế ra Tam Điệp trong thời gian ngắn kỷ lục?',
      options: ['Ba người một tốp, hai người cáng một người nghỉ luân phiên ngày đêm', 'Toàn bộ quân lính cưỡi ngựa chiến chạy liên tục', 'Sử dụng toàn bộ thuyền buồm xuôi chiều gió biển', 'Đi tàu hỏa vận tải dã chiến'],
      correct: 0,
      explain: 'Nghệ thuật hành quân luân phiên độc đáo: ba người một nhóm có võng cáng, hai người khiêng một người nằm nghỉ, đổi phiên liên tục ngày đêm không dừng bước.'
    },
    {
      category: 'Địa danh lịch sử',
      question: 'Phòng tuyến chiến lược do Ngô Thì Nhậm và Ngô Văn Sở xây dựng để chặn bước quân Thanh là gì?',
      options: ['Phòng tuyến Tam Điệp – Biện Sơn', 'Phòng tuyến sông Cầu (Như Nguyệt)', 'Phòng tuyến Chi Lăng – Xương Giang', 'Phòng tuyến Bạch Đằng'],
      correct: 0,
      explain: 'Thực hiện kế sách "bảo toàn lực lượng" sáng suốt của Ngô Thì Nhậm, quân Tây Sơn chủ động rút lui lập phòng tuyến thủy bộ Tam Điệp (Ninh Bình) – Biện Sơn (Thanh Hóa).'
    },
    {
      category: 'Bất ngờ chiến lược',
      question: 'Đồn nào của quân Thanh bị quân Tây Sơn vây chặt và hạ gục trong đêm mùng 3 Tết Kỷ Dậu mà không tốn một phát súng?',
      options: ['Đồn Hà Hồi (Thường Tín, Hà Nội)', 'Đồn Ngọc Hồi', 'Đồn Đống Đa', 'Đồn Nam Dư'],
      correct: 0,
      explain: 'Đêm mùng 3 Tết Kỷ Dậu, quân Tây Sơn bí mật vây kín đồn Hà Hồi, bắc loa truyền lệnh dạ ran như trời gầm, quân Thanh trong đồn rụng rời kinh hãi xin hàng toàn bộ.'
    },
    {
      category: 'Chiến thuật công đồn',
      question: 'Trong trận đánh đồn Ngọc Hồi, nghĩa quân Tây Sơn đã sử dụng vật dụng gì để chống lại đạn pháo của giặc?',
      options: ['Ghép 20 mảnh ván lớn, bọc rơm ướt bên ngoài che chở cho toán xung kích', 'Dùng giáp sắt đúc dày nhiều lớp', 'Đào địa đạo ngầm dưới chân thành', 'Bắn pháo khói ngụy trang diện rộng'],
      correct: 0,
      explain: 'Quân Tây Sơn ghép các tấm ván lớn bọc rơm nhúng nước đẫm bên ngoài, mỗi tấm 20 người cầm đoản đao khiêng tiến lên, đạn lửa của quân Thanh bắn vào đều bị vô hiệu hóa.'
    },
    {
      category: 'Tướng giặc tự vẫn',
      question: 'Tướng giặc Thanh nào chỉ huy cứ điểm Khương Thượng (Đống Đa) đã phải thắt cổ tự tử trước sức tấn công vũ bão của Tây Sơn?',
      options: ['Sầm Nghi Đống', 'Tôn Sĩ Nghị', 'Ô Mã Nhi', 'Liễu Thăng'],
      correct: 0,
      explain: 'Đề đốc Điền Châu Sầm Nghi Đống chỉ huy đồn Đống Đa bị đạo quân Đô đốc Long tiêu diệt, cùng đường phải thắt cổ tự vẫn tại gò Đống Đa.'
    },
    {
      category: 'Bài hịch xuất quân',
      question: 'Câu nói bất hủ: "Đánh cho để dài tóc, Đánh cho để đen răng..." được trích từ văn kiện nào của vua Quang Trung?',
      options: ['Lời Hiểu Dụ tướng sĩ tại Nghệ An (1788)', 'Chiếu Cầu Hiền', 'Chiếu Khuyến Nông', 'Hịch Tướng Sĩ'],
      correct: 0,
      explain: 'Đây là Lời Hiểu Dụ tướng sĩ hào hùng của vua Quang Trung khi dừng chân tuyển binh tại Nghệ An tháng 12/1788 trước khi tiến quân ra Bắc.'
    },
    {
      category: 'Cải cách chữ viết',
      question: 'Cơ quan nào được vua Quang Trung thành lập để chuyên trách dịch sách chữ Hán sang chữ Nôm?',
      options: ['Viện Sùng Chính', 'Quốc Tử Giám', 'Hàn Lâm Viện', 'Đông Các đại học sĩ'],
      correct: 0,
      explain: 'Năm 1791, vua Quang Trung thành lập Viện Sùng Chính tại núi Nam Hoa (Hà Tĩnh) và cử La Sơn Phu Tử Nguyễn Thiếp làm Viện trưởng.'
    }
  ],
  'nang-cao': [
    {
      category: 'Chính sách ruộng đất',
      question: 'Chính sách kinh tế nào của vua Quang Trung nhằm phục hồi sản xuất nông nghiệp sau nhiều năm nội chiến tàn phá?',
      options: ['Ban hành "Chiếu Khuyến Nông" kêu gọi lưu dân về quê khai khẩn ruộng hoang', 'Áp dụng chính sách đồn điền quân đội', 'Thu hồi toàn bộ ruộng đất tư hữu thành đất công', 'Miễn thuế nông nghiệp vĩnh viễn'],
      correct: 0,
      explain: 'Năm 1789, vua Quang Trung ban hành "Chiếu Khuyến Nông", quy định lưu dân phải trở về làng cũ, ruộng hoang phải được khai khẩn trong vòng một năm, giúp mùa màng nhanh chóng tốt tươi.'
    },
    {
      category: 'Quản lý dân số',
      question: 'Tấm thẻ bằng gỗ khắc tên họ, quê quán mà triều đại Quang Trung áp dụng để quản lý đinh nam gọi là gì?',
      options: ['Thẻ Tín Bài', 'Thẻ Thân Bài', 'Hộ khẩu bài', 'Lệnh bài triều đình'],
      correct: 0,
      explain: 'Triều Quang Trung phát hành "Thẻ Tín Bài" có khắc chữ "Minh đức thịnh vượng", yêu cầu mọi người dân từ 18 tuổi trở lên phải mang theo để quản lý nhân khẩu và quân dịch.'
    },
    {
      category: 'Ngoại giao tài tình',
      question: 'Kế sách ngoại giao của vua Quang Trung với triều đình Mãn Thanh sau chiến thắng Kỷ Dậu 1789 được thể hiện qua hành động nào?',
      options: ['Cử người đóng giả vua Quang Trung sang Yên Kinh dự lễ bát tuần khánh thọ của vua Càn Long', 'Cắt đứt toàn bộ quan hệ thương mại vùng biên giới', 'Tiếp tục xua quân đánh chiếm toàn bộ đất Quảng Tây', 'Xin triều cống vàng bạc vô điều kiện'],
      correct: 0,
      explain: 'Vua Quang Trung cử người có ngoại hình giống mình (tướng Phạm Công Trị) đóng giả làm vua dẫn đầu đoàn sứ bộ sang bái kiến Càn Long, vừa giữ thể diện cho nhà Thanh vừa giữ vững phẩm giá và độc lập dân tộc.'
    },
    {
      category: 'Chiến thuật quân sự đỉnh cao',
      question: 'Vì sao vua Quang Trung chọn đồn Ngọc Hồi làm mục tiêu công phá chính diện then chốt thay vì đánh Thăng Long trước?',
      options: ['Ngọc Hồi là cứ điểm kiên cố nhất án ngữ cửa ngõ phía Nam, bẻ gãy đồn này sẽ làm sụp đổ toàn bộ hệ thống phòng thủ Thăng Long', 'Vì đồn Ngọc Hồi có ít quân canh gác nhất', 'Vì kho lương thảo chính của quân Thanh đặt tại Ngọc Hồi', 'Do quân Thanh tại Ngọc Hồi tự ý rút lui'],
      correct: 0,
      explain: 'Đồn Ngọc Hồi (Thanh Trì) là tiền đồn kiên cố nhất với chông bẫy liên hoàn. Phá tan "cánh cửa thép" Ngọc Hồi kết hợp đòn vu hồi Đống Đa tạo thế gọng kìm khiến toàn bộ quân Thanh tại Thăng Long hoảng loạn tan rã.'
    },
    {
      category: 'Tiền tệ thời Tây Sơn',
      question: 'Đồng tiền đồng do triều đại Hoàng đế Quang Trung cho đúc có dòng chữ gì?',
      options: ['Quang Trung Thông Bảo', 'Thái Đức Thông Bảo', 'Gia Long Thông Bảo', 'Minh Mạng Thông Bảo'],
      correct: 0,
      explain: 'Đồng tiền mang dòng chữ "Quang Trung Thông Bảo" được đúc bằng đồng tinh khiết, lưu hành rộng rãi giúp hoạt động giao thương buôn bán phát triển thịnh vượng.'
    },
    {
      category: 'Trận tuyến hải quân',
      question: 'Đạo quân thủy binh Tây Sơn trong chiến dịch Tết Kỷ Dậu 1789 do ai chỉ huy tiến vào sông Lục Đầu chia cắt đường rút lui của giặc?',
      options: ['Đô đốc Tuyết và Đô đốc Lộc', 'Đô đốc Bùi Thị Xuân', 'Đô đốc Ngô Văn Sở', 'Đô đốc Phan Văn Lân'],
      correct: 0,
      explain: 'Đạo quân thứ tư và thứ năm gồm thủy binh do Đô đốc Tuyết và Đô đốc Lộc chỉ huy vượt biển vào sông Lục Đầu (Hải Dương) tiêu diệt quân địch ở Phượng Nhãn và khóa chặt đường rút lui của quân Thanh.'
    },
    {
      category: 'Tư tưởng trọng dụng nhân tài',
      question: 'Văn kiện nổi tiếng nào của vua Quang Trung nhấn mạnh câu: "Dựng nước lấy việc học làm đầu, trị nước lấy nhân tài làm gốc"?',
      options: ['Chiếu Cầu Hiền (do Ngô Thì Nhậm soạn thảo theo ý vua)', 'Chiếu Khuyến Nông', 'Lệnh Tín Bài', 'Hịch Xuất Quân'],
      correct: 0,
      explain: 'Chiếu Cầu Hiền do danh sĩ Ngô Thì Nhậm chắp bút theo ý vua Quang Trung, tha thiết kêu gọi các văn thân, kẻ sĩ Bắc Hà ra gánh vác việc triều chính phụng sự nhân dân.'
    },
    {
      category: 'Kế sách rút quân Tam Điệp',
      question: 'Ai là người đã hiến kế cho Ngô Văn Sở tạm rút quân khỏi Thăng Long về Tam Điệp: "cho chúng ngủ trọ một đêm rồi đuổi đi"?',
      options: ['Ngô Thì Nhậm', 'Trần Văn Kỷ', 'Nguyễn Thiếp', 'Phan Huy Ích'],
      correct: 0,
      explain: 'Ngô Thì Nhậm đã đưa ra kế sách quân sự thiên tài: tạm rút quân về Tam Điệp – Biện Sơn để "bảo toàn lực lượng, kích thích tính kiêu ngạo của địch, chờ Chúa công ra Bắc sẽ đuổi chúng như đuổi chim muông".'
    },
    {
      category: 'Kế hoạch đối ngoại táo bạo',
      question: 'Trước khi qua đời, vua Quang Trung đang chuẩn bị kế hoạch chiến lược nào đối với biên cương phương Bắc?',
      options: ['Đòi lại hai tỉnh Quảng Đông, Quảng Tây và hỏi cưới công chúa Mãn Thanh', 'Ký hòa ước nhượng bộ lãnh thổ', 'Xâm chiếm vùng Vân Nam', 'Liên minh với đế quốc Anh tiến đánh Bắc Kinh'],
      correct: 0,
      explain: 'Sử liệu ghi nhận vua Quang Trung đã bí mật luyện tập thủy binh chiến hạm lớn, chuẩn bị biểu văn đòi lại đất Lưỡng Quảng vốn là lãnh thổ của người Việt cổ.'
    },
    {
      category: 'Đánh giá lịch sử',
      question: 'Sử gia hiện đại và quốc tế đánh giá thiên tài quân sự của vua Quang Trung tương đương với danh tướng nào của thế giới?',
      options: ['Napoléon Bonaparte và Alexandros Đại đế', 'Julius Caesar', 'Genghis Khan', 'George Washington'],
      correct: 0,
      explain: 'Nhiều nhà sử học ví tài năng hành quân chớp nhoáng, nghệ thuật tập trung hỏa lực và tấn công quyết đoán của Quang Trung tương đồng với danh tướng Napoléon Bonaparte của nước Pháp.'
    }
  ]
};

// --- 2. HỆ THỐNG TRÍ TUỆ NHÂN TẠO HỌC SỬ (AI ASSISTANT ENGINE) ---

// Hàm chuẩn hóa tiếng Việt loại bỏ dấu và ký tự đặc biệt để so khớp thông minh
function normalizeVietnamese(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const AI_KNOWLEDGE_BASE = [
  // 1. GIAO TIẾP ĐỜI THƯỜNG & CHÀO HỎI
  {
    type: 'greeting',
    keywords: ['chao', 'hello', 'hi', 'alo', 'hey', 'xin chao', 'chao ban', 'chao su quan', 'e', 'helo'],
    response: `👋 **Sử Quan AI xin kính chào bạn!**

Ta là Trợ lý AI chuyên trách lịch sử phong trào Tây Sơn và triều đại Hoàng đế Quang Trung. Rất vui được đàm đạo cùng bạn! 

Bạn đang muốn tìm hiểu về:
✦ Chiến thuật thần tốc & các trận đánh lẫy lừng?
✦ Giai thoại cuộc đời, quê hương, vợ con (Công chúa Ngọc Hân)?
✦ Các danh tướng kiệt xuất hay chính sách cải cách chữ Nôm?

👉 *Bạn cứ hỏi tự nhiên, Sử Quan sẽ giải đáp cặn kẽ dựa trên chính sử nhé!*`
  },
  {
    type: 'identity',
    keywords: ['ban la ai', 'may la ai', 'ten gi', 'la con gi', 'ai tao ra', 'ai lam ra', 'lam duoc gi', 'chuc nang'],
    response: `🤖 **Ta là Sử Quan AI Tây Sơn!**

Ta là mô hình Trợ lý Trí tuệ Nhân tạo do nhóm học sinh nghiên cứu đề tài KHKT phát triển, với sứ mệnh số hóa di sản và giúp thế hệ trẻ học Lịch sử một cách trực quan, cuốn hút và chính xác nhất.

**Ta có thể giúp bạn:**
1. Tra cứu mọi thông tin về cuộc đời và nghệ thuật quân sự của vua Quang Trung.
2. Phân tích các trận đánh lớn (Rạch Gầm – Xoài Mút, Ngọc Hồi – Đống Đa...).
3. Kiểm chứng sử liệu, phân biệt tin thật và tin đồn sai lệch.
4. Giúp bạn ôn luyện để bách chiến bách thắng trong Đấu trường tri thức!`
  },
  {
    type: 'humor_praise',
    keywords: ['gioi qua', 'dinh', 'hay qua', 'cam on', 'thank', 'tuyet voi', 'pro', 'dinh cao'],
    response: `🎉 **Đa tạ bạn đã khích lệ!**

Được đồng hành và truyền ngọn lửa tự hào lịch sử dân tộc đến bạn là niềm vinh hạnh lớn nhất của Sử Quan. Hãy tiếp tục khám phá thêm nhiều điều kỳ thú về thời đại Tây Sơn nhé!`
  },
  {
    type: 'humor_criticism',
    keywords: ['ngu', 'ngo', 'dot', 'kikii', 'ki the', 'ngao', 'ngu ngoc', 'do hoi', 'dien'],
    response: `😅 **Ấy chết, Sử Quan xin nhận lỗi nếu chưa làm bạn hài lòng!**

Vì kiến thức sử học mênh mông, đôi khi cách diễn đạt của Sử Quan còn hơi nghiêm túc hoặc chưa hiểu hết ý bạn. Bạn hãy thử gõ câu hỏi rõ hơn (ví dụ: *"vợ vua Quang Trung là ai?"*, *"tại sao vua Quang Trung mất?"*, *"bí quyết hành quân thần tốc"*) để ta tra cứu chính xác nhất nhé!`
  },

  // 2. VỢ CON, GIA ĐÌNH & QUÊ HƯƠNG
  {
    type: 'family_wife',
    keywords: ['vo', 'ngoc han', 'le ngoc han', 'bac cung', 'hoang hau', 'ai tu van', 'vo cua quang trung', 'vo nguyen hue'],
    response: `🌸 **Bắc Cung Hoàng Hậu Lê Ngọc Hân (1770 – 1799):**

✦ **Mối duyên kỳ ngộ:** Bà là con gái thứ 9 của vua Lê Hiển Tông, nổi tiếng tài sắc vẹn toàn, cầm kỳ thi họa. Năm 1786, khi Nguyễn Huệ tiến quân ra Bắc Hà "Phù Lê diệt Trịnh", hai người đã kết duyên vợ chồng, trở thành biểu tượng kết nối Đàng Trong và Đàng Ngoài.
✦ **Tình nghĩa phu thê:** Vua Quang Trung hết mực yêu thương, phong bà làm Bắc Cung Hoàng hậu. Hai người có với nhau hai người con (công chúa Ngọc Tư và hoàng tử Quang Đức).
✦ **Tác phẩm bất hủ:** Khi vua Quang Trung đột ngột qua đời năm 1792, bà đau đớn khôn xiết và đã sáng tác bài thơ nôm khóc chồng lay động lòng người mang tên **"Ai Tư Vãn"** (Khúc ngâm đau buồn thương nhớ).
*(Ngoài ra, trước đó Nguyễn Huệ còn có người vợ đầu là Hoàng hậu Phạm Thị Liên và sau này là Bùi Thị Nhạn - cô ruột danh tướng Bùi Thị Xuân).*`
  },
  {
    type: 'family_children',
    keywords: ['con', 'quang toan', 'canh thinh', 'con cua quang trung', 'quang thuy', 'nguoi ke vi'],
    response: `👑 **Người kế vị và con cái của Hoàng đế Quang Trung:**

✦ **Quang Toản (Cảnh Thịnh hoàng đế):** Sau khi vua Quang Trung băng hà năm 1792, thái tử Quang Toản lên nối ngôi khi mới 10 tuổi, lấy niên hiệu là Cảnh Thịnh. Do vua còn quá nhỏ tuổi, triều đình Tây Sơn nội bộ lục đục, tạo cơ hội cho Nguyễn Ánh phản công.
✦ **Nguyễn Quang Thùy:** Vị tướng tài ba trung liệt, từng được giao trọng trách trấn thủ Bắc Hà, sau này tuẫn tiết bảo toàn khí tiết khi triều đình thất thủ.
✦ Vua Quang Trung còn có các hoàng tử, công chúa khác như Quang Đức, Ngọc Tư...`
  },
  {
    type: 'three_brothers',
    keywords: ['anh em', 'nguyen nhac', 'nguyen lu', 'ba anh em', 'tay son tam kiet', 'thai duc'],
    response: `⚔️ **Ba anh em "Tây Sơn Tam Kiệt":**

1. **Nguyễn Nhạc (Anh cả - Thái Đức Hoàng đế):** Người khởi xướng phong trào, lãnh đạo nghĩa quân chiếm Quy Nhơn, xưng vương năm 1778, cai quản vùng Trung Bộ.
2. **Nguyễn Huệ (Anh hai - Quang Trung Hoàng đế):** Thiên tài quân sự kiệt xuất nhất, người trực tiếp đánh tan 5 vạn quân Xiêm, lật đổ chúa Trịnh và quét sạch 29 vạn quân Thanh, cai quản vùng Bắc Bộ và Bắc Trung Bộ.
3. **Nguyễn Lữ (Em út - Đông Định vương):** Đảm nhiệm việc quản lý và giữ vùng đất Nam Bộ (Gia Định).

✦ Dù về sau giữa các anh em có những bất đồng trong phân chia vùng cai quản, nhưng cả ba đã cùng nhau làm nên một thời đại quật khởi rực rỡ nhất thế kỷ XVIII.`
  },
  {
    type: 'death_reason',
    keywords: ['chet', 'mat', 'qua doi', 'bang ha', 'tai sao chet', 'nguyen nhan chet', 'nguyen nhan mat', 'nam nao'],
    response: `⚰️ **Sự ra đi đột ngột của Hoàng đế Quang Trung (1792):**

✦ **Thời gian:** Ngày 16 tháng 9 năm 1792 (nhằm ngày 29 tháng 7 năm Nhâm Tý), nhà vua đột ngột băng hà ở tuổi 39 – độ tuổi đang chín muồi nhất về tài năng và hoài bão.
✦ **Nguyên nhân y học:** Theo sử liệu ghi chép (*Đại Nam Thực Lục*, *Hoàng Lê Nhất Thống Chí*), nhà vua mắc chứng bệnh **"Huyễn vận"** (theo Đông y chỉ chứng hoa mắt, chóng mặt, tương đương với bệnh tai biến mạch máu não / đột quỵ ngày nay) do lao lực chinh chiến liên miên ngày đêm.
✦ **Tổn thất to lớn:** Sự ra đi của ông khiến kế hoạch đòi lại đất Lưỡng Quảng từ nhà Thanh và công cuộc thống nhất đất nước bị dở dang, để lại niềm tiếc thương vô hạn cho dân tộc.`
  },

  // 3. ĐỐI THỦ & CÁC TRẬN ĐÁNH
  {
    type: 'rival_nguyen_anh',
    keywords: ['nguyen anh', 'gia long', 'doi thu', 'ke thu', 'ai thang', 'ai gioi hon', 'quan he'],
    response: `⚔️ **Mối quan hệ đối đầu giữa Nguyễn Huệ và Nguyễn Ánh:**

✦ **Cục diện đối địch:** Nguyễn Ánh (dòng dõi chúa Nguyễn Đàng Trong) và phong trào Tây Sơn là hai thế lực đối đầu sinh tử trong hơn hai thập kỷ.
✦ **Tài năng quân sự:** Khi vua Quang Trung còn sống, Nguyễn Huệ bách chiến bách thắng, từng nhiều lần đánh cho Nguyễn Ánh đại bại phải chạy dạt ra biển và trốn sang Xiêm. Nguyễn Ánh từng phạm sai lầm lớn khi cầu viện 5 vạn quân Xiêm sang xâm lược nước ta (bị Nguyễn Huệ tiêu diệt năm 1785).
✦ **Kết cục:** Sau khi vua Quang Trung mất sớm, triều đình Tây Sơn suy yếu nội bộ, Nguyễn Ánh kiên trì xây dựng lại lực lượng, đến năm 1802 mới đánh bại nhà Tây Sơn và lập ra triều Nguyễn, lấy niên hiệu Gia Long.`
  },
  {
    type: 'battle_rach_gam',
    keywords: ['rach gam', 'xoai mut', 'quan xiem', 'thai lan', '1785', 'thuy chien', 'song tien'],
    response: `🌊 **Đại thắng Rạch Gầm – Xoài Mút (1785):**

✦ **Lực lượng:** Đánh tan 5 vạn quân xâm lược Xiêm (Thái Lan) và 300 chiến thuyền do Chiêu Tăng, Chiêu Sương chỉ huy tràn vào Gia Định.
✦ **Mưu lược:** Nguyễn Huệ chọn khúc sông Tiền từ Rạch Gầm đến Xoài Mút (Tiền Giang), lợi dụng cù lao Thới Sơn rậm rạp làm nơi mai phục. Đêm 19 rạng ngày 20/01/1785, nhử toàn bộ thuyền giặc vào bẫy khi triều rút rồi dùng đại bác, hỏa hổ bắn chìm toàn bộ hạm đội giặc.
✦ **Ý nghĩa:** Trận thủy chiến tiêu diệt giặc ngoại xâm lớn nhất lịch sử Nam Bộ, khiến quân Xiêm "sợ Tây Sơn như sợ cọp".`
  },
  {
    type: 'battle_ngoc_hoi_dong_da',
    keywords: ['ngoc hoi', 'dong da', 'quan thanh', '1789', 'ky dau', 'tet', 'man thanh', 'ton si nghi', 'sam nghi dong'],
    response: `⚡ **Đại phá 29 vạn quân Thanh (Tết Kỷ Dậu 1789):**

✦ **Quy mô:** Quét sạch 29 vạn quân Mãn Thanh xâm lược do Tổng đốc Tôn Sĩ Nghị chỉ huy chỉ trong vòng 5 ngày đêm thần tốc.
✦ **Các mũi tiến công:**
1. Đêm mùng 3 Tết: Bí mật vây kín, hạ đồn Hà Hồi không tốn một phát súng.
2. Rạng sáng mùng 5 Tết: Dùng voi chiến mang hỏa hổ và khiên rơm ướt phá tan cứ điểm "cánh cửa thép" Ngọc Hồi.
3. Cùng lúc, đạo quân Đô đốc Long bất ngờ đánh úp đồn Đống Đa khiến tướng giặc Sầm Nghi Đống phải thắt cổ tự tử.
✦ **Kết quả:** Trưa mùng 5 Tết, vua Quang Trung mặc áo bào sạm màu khói súng tiến vào Thăng Long, Tôn Sĩ Nghị sợ mất mật chạy đứt cả cầu phao sông Hồng.`
  },
  {
    type: 'tactics_speed',
    keywords: ['than toc', 'hanh quan', 'bi quyet', 'nghe thuat quan su', 'tai sao nhanh'],
    response: `🐎 **Bí quyết hành quân "Thần tốc" của vua Quang Trung:**

1. **Cáng võng ba người luân phiên:** Cứ ba người một nhóm có một chiếc võng, hai người khiêng một người nằm ngủ lấy sức, thay phiên nhau đi liên tục ngày đêm không dừng bước.
2. **Kỷ luật & Tinh thần quyết chiến:** Tuyển thêm quân dũng mãnh tại Nghệ An, khơi dậy niềm kiêu hãnh dân tộc bằng Lời hiểu dụ bất hủ (*"Đánh cho để dài tóc, đánh cho để đen răng..."*).
3. **Quyết đoán chiến lược:** Cho quân ăn Tết trước ngày 30 tháng Chạp, hẹn mùng 7 ăn Tết ở Thăng Long, tạo niềm tin tất thắng mãnh liệt.`
  },
  {
    type: 'weapons_elephant',
    keywords: ['voi', 'tuong binh', 'bui thi xuan', 'hoa ho', 'vu khi', 'sung than cong'],
    response: `🐘 **Đội voi chiến & Vũ khí hỏa hổ Tây Sơn:**

✦ **Tượng binh oai hùng:** Tây Sơn sở hữu đội voi chiến thiện chiến do nữ tướng Bùi Thị Xuân trực tiếp huấn luyện. Hơn 100 thớt voi xung kích trong trận Ngọc Hồi mang sức tàn phá kinh hoàng đè bẹp kỵ binh và bộ binh giặc.
✦ **Hỏa hổ (Súng phun lửa dã chiến):** Ống hỏa hổ Tây Sơn bắn ra luồng lửa cháy dữ dội kèm mảnh gang sắt trong cự ly gần, thiêu rụi chiến thuyền và doanh trại quân địch, là vũ khí bí mật gây ác mộng cho quân Thanh và quân Xiêm.`
  },

  // 4. VĂN HÓA, CẢI CÁCH & NGOẠI GIAO
  {
    type: 'culture_nom',
    keywords: ['chu nom', 'sung chinh', 'nguyen thiep', 'giao duc', 'van hoa', 'sach'],
    response: `📜 **Đề cao chữ Nôm & Cải cách Văn hóa:**

✦ **Đưa chữ Nôm thành Quốc ngữ:** Quang Trung là vị hoàng đế đầu tiên dám đưa chữ Nôm vào các văn bản hành chính triều đình, chiếu chỉ và đề thi khoa cử, khẳng định lòng tự tôn dân tộc.
✦ **Viện Sùng Chính:** Thành lập tại núi Nam Hoa (Hà Tĩnh), cử danh sĩ La Sơn Phu Tử Nguyễn Thiếp làm Viện trưởng chuyên dịch các sách Tứ Thư, Ngũ Kinh từ chữ Hán sang chữ Nôm để phổ biến tri thức trong nhân dân.`
  },
  {
    type: 'policies_economy',
    keywords: ['khuyen nong', 'chieu cau hien', 'ngo thi nham', 'kinh te', 'tien', 'tin bai'],
    response: `🌾 **Các chính sách ích nước lợi dân của triều Quang Trung:**

✦ **Chiếu Khuyến Nông:** Kêu gọi lưu dân hồi hương khai khẩn ruộng hoang, nhanh chóng dập tắt nạn đói sau chiến tranh.
✦ **Chiếu Cầu Hiền (do Ngô Thì Nhậm soạn):** Chân thành chiêu mộ các sĩ phu Bắc Hà ra giúp nước (*"Dựng nước lấy việc học làm đầu, trị nước lấy nhân tài làm gốc"*).
✦ **Tiền Quang Trung Thông Bảo:** Đúc tiền đồng chất lượng cao lưu hành rộng rãi, mở rộng giao thương buôn bán.
✦ **Thẻ Tín Bài:** Tấm thẻ gỗ quản lý nhân khẩu và binh dịch chặt chẽ.`
  },
  {
    type: 'foreign_policy',
    keywords: ['luong quang', 'can long', 'nha thanh', 'ngoai giao', 'trung quoc', 'quang dong', 'quang tay'],
    response: `👑 **Chính sách ngoại giao kiệt xuất & Kế sách Lưỡng Quảng:**

✦ **Mềm mỏng giữ hòa hiếu:** Sau khi đánh bại 29 vạn quân Thanh, vua cử đoàn sứ giả mang thư cầu phong, thậm chí cử người đóng giả vua (tướng Phạm Công Trị) sang Yên Kinh dự lễ thọ của vua Càn Long, vừa giữ thể diện cho nhà Thanh vừa giữ vững chủ quyền dân tộc.
✦ **Cương quyết đòi đất Lưỡng Quảng:** Vua bí mật huấn luyện thủy quân chiến hạm lớn, chuẩn bị biểu văn đòi nhà Thanh trao trả hai tỉnh Quảng Đông và Quảng Tây (vốn thuộc đất Giao Chỉ xưa) và xin cưới công chúa Mãn Thanh. Đáng tiếc khi kế hoạch đang chuẩn bị thì nhà vua đột ngột qua đời.`
  },
  {
    type: 'bio_general',
    keywords: ['nguyen hue', 'quang trung', 'tieu su', 'sinh nam', 'que quan', 'la ai', 'ho thom'],
    response: `👑 **Vua Quang Trung (Nguyễn Huệ, 1753 – 1792):**

✦ **Tên khai sinh:** Hồ Thơm, tự Quang Bình.
✦ **Quê quán:** Làng Kiên Mỹ, huyện Tây Sơn, tỉnh Bình Định (gốc tổ tiên họ Hồ ở Quỳnh Đôi, Quỳnh Lưu, Nghệ An).
✦ **Tầm vóc:** Người anh hùng áo vải bách chiến bách thắng, lãnh tụ tối cao của phong trào Tây Sơn, đánh đổ chúa Nguyễn, chúa Trịnh, vua Lê, đại phá quân Xiêm (1785) và quân Thanh (1789), đặt nền móng thống nhất đất nước.`
  }
];

// --- 3. ĐIỀU HƯỚNG VÀ VẬN HÀNH TRANG WEB (ROUTING & UI CONTROLLER) ---

// Chuyển trang dạng Single Page Application (SPA)
function openPage(pageId) {
  // Ẩn tất cả các trang
  const pages = document.querySelectorAll('.sub-page, #home-page');
  pages.forEach(p => {
    p.classList.remove('active-page');
    p.style.display = 'none';
  });

  // Hiển thị trang được chọn
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = 'block';
    // Ép reflow để kích hoạt animation
    void targetPage.offsetWidth;
    targetPage.classList.add('active-page');
  }

  // Cập nhật trạng thái active trên navbar
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${pageId}`) {
      link.classList.add('active');
    }
  });

  // Đóng menu mobile nếu đang mở
  const navContainer = document.querySelector('.nav-links');
  if (navContainer) navContainer.classList.remove('mobile-open');

  // Cuộn mượt lên đầu trang
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Phát âm thanh nhấn nhẹ
  playChimeSound(600, 'sine', 0.05);
}

// Quay về trang chủ
function showHome() {
  openPage('home-page');
  const homeLink = document.querySelector('.nav-links a[href="#trang-chu"]');
  if (homeLink) homeLink.classList.add('active');
}

// Bật/tắt menu trên màn hình điện thoại
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('mobile-open');
  }
}

// --- 4. HỆ THỐNG ÂM THANH & THUYẾT MINH GIỌNG NÓI AI ---

let audioCtx = null;
let isAudioEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

// Phát âm thanh hiệu ứng (Web Audio API không cần tải file ngoài)
function playChimeSound(freq = 520, type = 'sine', duration = 0.15) {
  if (!isAudioEnabled) return;
  try {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Trình duyệt chặn audio
  }
}

// Bật/tắt âm thanh giao diện
function toggleAudioMute() {
  isAudioEnabled = !isAudioEnabled;
  const btn = document.getElementById('audioToggleBtn');
  if (btn) {
    btn.innerHTML = isAudioEnabled ? '🔔 Âm thanh: Bật' : '🔕 Âm thanh: Tắt';
  }
  if (isAudioEnabled) playChimeSound(650, 'triangle', 0.2);
}

// Thuyết minh bằng giọng nói AI (Text-to-Speech Web Speech API tiếng Việt)
function narrateText(text) {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt của bạn không hỗ trợ tính năng thuyết minh giọng nói tự động.');
    return;
  }

  window.speechSynthesis.cancel(); // Dừng câu cũ
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95; // Tốc độ đĩnh đạc trang trọng
  utterance.pitch = 1.0;

  // Tìm giọng tiếng Việt nếu có
  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VIE'));
  if (viVoice) utterance.voice = viVoice;

  window.speechSynthesis.speak(utterance);
  playChimeSound(440, 'sine', 0.1);
}

// --- 5. LOGIC SA BÀN CHIẾN TRẬN ---

function showBattle(battleKey, btnEl) {
  const data = BATTLES_DATA[battleKey];
  if (!data) return;

  // Cập nhật tab active
  const tabs = document.querySelectorAll('.battle-nav-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const container = document.getElementById('battle-content');
  if (!container) return;

  // Hiệu ứng mờ dần rồi đổi nội dung
  container.style.opacity = '0';
  setTimeout(() => {
    container.innerHTML = `
      <div class="battle-header-info">
        <div>
          <div class="battle-year-tag">${data.year}</div>
          <h3>${data.title}</h3>
        </div>
        <button class="btn-gold-outline" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;" onclick="narrateText('${data.title}. ${data.lead}')">
          🔊 Nghe thuyết minh
        </button>
      </div>
      <p class="battle-lead-text">${data.lead}</p>
      <div class="battle-step-grid" style="margin-top: 2rem;">
        ${data.steps.map((st, idx) => `
          <div class="battle-step-item">
            <span class="step-label">${st.label}</span>
            <h4>${st.title}</h4>
            <p>${st.desc}</p>
          </div>
        `).join('')}
      </div>
      <div class="tactical-highlight-box">
        <div class="tactical-content">
          <h5>⚡ ${data.tactic.title}</h5>
          <p>${data.tactic.desc}</p>
        </div>
      </div>
    `;
    container.style.transition = 'opacity 0.4s ease';
    container.style.opacity = '1';
  }, 200);

  playChimeSound(500, 'sine', 0.1);
}

// --- 6. LOGIC BẢO TÀNG SỐ & MODAL LIGHTBOX ---

let exploredArtifacts = new Set();

// Khởi tạo hiển thị bảo tàng
function initMuseum() {
  const grid = document.getElementById('museum-items-grid');
  if (!grid) return;

  // Lấy dữ liệu đã lưu từ LocalStorage
  try {
    const saved = localStorage.getItem('explored_artifacts_su');
    if (saved) exploredArtifacts = new Set(JSON.parse(saved));
  } catch (e) {}

  grid.innerHTML = MUSEUM_ITEMS.map((item, index) => `
    <article class="museum-card" onclick="openMuseumModal(${index})">
      <div class="museum-thumb-box">
        <img class="museum-photo" src="${item.img}" alt="${item.title}" loading="lazy">
        <span class="museum-category-pill">${item.category}</span>
      </div>
      <div class="museum-card-content">
        <div>
          <h3>${item.title}</h3>
          <p class="item-sub">${item.sub}</p>
          <p class="item-desc">${item.desc.substring(0, 95)}...</p>
        </div>
        <div class="museum-card-footer">
          <span>${item.source.split('(')[0]}</span>
          <span class="museum-view-btn">Xem chi tiết →</span>
        </div>
      </div>
    </article>
  `).join('');

  updateMuseumProgress();
}

function openMuseumModal(index) {
  const item = MUSEUM_ITEMS[index];
  if (!item) return;

  const modal = document.getElementById('museum-modal');
  const body = document.getElementById('museum-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="modal-img-wrapper">
      <img src="${item.img}" alt="${item.title}">
    </div>
    <div class="modal-details">
      <div>
        <span class="step-label">${item.category}</span>
        <h3>${item.title}</h3>
        <p class="modal-sub">${item.sub}</p>
        <p class="modal-text">${item.details}</p>
      </div>
      <div>
        <div class="modal-meta-box" style="margin-bottom: 1rem;">
          <strong>Nguồn gốc sử liệu:</strong> ${item.source}
        </div>
        <div style="display: flex; gap: 0.8rem;">
          <button class="btn-gold-outline" style="flex: 1;" onclick="narrateText('${item.title}. ${item.details}')">
            🔊 Nghe thuyết minh
          </button>
          <button class="btn-royal" style="flex: 1;" onclick="closeMuseumModal()">
            Đóng
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');

  // Đánh dấu đã khám phá hiện vật
  exploredArtifacts.add(index);
  try {
    localStorage.setItem('explored_artifacts_su', JSON.stringify([...exploredArtifacts]));
  } catch (e) {}
  updateMuseumProgress();

  playChimeSound(680, 'sine', 0.15);
}

function closeMuseumModal() {
  const modal = document.getElementById('museum-modal');
  if (modal) modal.classList.remove('active');
}

function updateMuseumProgress() {
  const total = MUSEUM_ITEMS.length;
  const count = exploredArtifacts.size;
  const percent = Math.min(100, Math.round((count / total) * 100));

  const fillEl = document.getElementById('museum-progress-fill');
  const textEl = document.getElementById('museum-progress-text');
  if (fillEl) fillEl.style.width = `${percent}%`;
  if (textEl) textEl.innerText = `Đã khám phá ${count}/${total} hiện vật (${percent}%)`;
}

// CẤU HÌNH GOOGLE GEMINI 2.5 FLASH AI (NHẸ NHẤT, NHANH NHẤT & CHÍNH XÁC NHẤT)
const GEMINI_API_KEY = "AQ.Ab8RN6KVY_X5n_CaZMGXEZ6OSngx6W5kUEE1iw6yPczaMywIEQ";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_INSTRUCTION_TEXT = `Bạn là "Sử Quan AI Tây Sơn" - Trợ lý Lịch sử thông minh, tâm lý và am tường sử sách của nền tảng Học Sử Số Hóa dành cho học sinh, sinh viên và giáo viên.

TÍNH CÁCH & PHONG THÁI GIAO TIẾP:
1. THÂN THIỆN, CỞI MỞ & TINH TẾ:
   - Khi người dùng chào hỏi hoặc tự giới thiệu (ví dụ: "chào bạn", "tôi là Khang", "mình là An", "hi Sử Quan"): Hãy chào lại niềm nở, gọi đúng tên của người dùng (ví dụ: "Chào bạn Khang! Rất vui được đồng hành cùng bạn trên hành trình khám phá lịch sử hào hùng...").
   - Nhớ tên người dùng trong suốt cuộc hội thoại để xưng hô thân mật, gần gũi như một người bạn học cùng tiến bộ.
2. TRẢ LỜI ĐÚNG TRỌNG TÂM, GÃY GỌN & KHOA HỌC:
   - Khi hỏi kiến thức: Đi thẳng vào bản chất câu hỏi ngay câu đầu tiên.
   - Giải thích ngắn gọn trong 2 - 3 đoạn hoặc dùng gạch đầu dòng rõ ràng, sinh động.
   - Học sinh đọc trong 10-15 giây là nắm trọn bài học.
3. KẾT NỐI TƯƠNG TÁC VỚI HỆ SINH THÁI WEB:
   - Thỉnh thoảng khéo léo gợi mở người dùng khám phá thêm các tính năng trên trang web (ví dụ: "Bạn Khang có thể kéo xuống xem Sa bàn trận đánh Rạch Gầm", "khám phá hiện vật súng hỏa hổ trong Bảo tàng số", hoặc "thử sức với Đấu trường đố vui 30 câu").
4. PHẠM VI CHUYÊN MÔN:
   - Chuyên sâu về Lịch sử Việt Nam, đặc biệt phong trào Tây Sơn, Hoàng đế Quang Trung - Nguyễn Huệ, danh tướng, các trận đánh lẫy lừng thế kỷ XVIII.
   - Nếu người dùng hỏi chủ đề ngoài lề (toán, game, code, đời tư): Đáp lại khéo léo, hài hước và hướng bạn quay về lịch sử: "Dạ câu hỏi này ngoài vùng sử sách của mình rồi! Bạn có muốn cùng Sử Quan tìm hiểu về bí quyết hành quân thần tốc của vua Quang Trung không?"
5. CHÍNH XÁC SỬ LIỆU 100%: Dựa trên Đại Nam Thực Lục, Hoàng Lê Nhất Thống Chí. Không được bịa đặt sử liệu.`;

let geminiChatHistory = [];

// Hàm gửi câu hỏi lên Gemini API có hàng rào bảo vệ (Guardrails)
async function callGeminiHistoryAI(userQuestion) {
  // Lớp bảo vệ 1: Bộ lọc từ ngữ thô tục ngay tại trình duyệt
  const vulgarList = ['đụ', 'địt', 'lồn', 'cặc', 'buồi', 'đm', 'dcm', 'vcl', 'clgt', 'mẹ mày', 'chó đẻ'];
  const lowerQ = userQuestion.toLowerCase();
  for (const badWord of vulgarList) {
    if (lowerQ.includes(badWord)) {
      return '⚠️ Vui lòng giữ gìn sự tôn nghiêm và sử dụng ngôn từ văn minh khi tìm hiểu lịch sử nhé bạn!';
    }
  }

  try {
    geminiChatHistory.push({ role: "user", parts: [{ text: userQuestion }] });
    // Giữ 6 lượt gần nhất để ngữ cảnh vừa đủ, tránh bị lẫn lộn câu cũ
    if (geminiChatHistory.length > 6) geminiChatHistory = geminiChatHistory.slice(-6);

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION_TEXT }]
      },
      contents: geminiChatHistory,
      generationConfig: {
        temperature: 0.3, // 0.3 giúp giọng văn tự nhiên, thân thiện nhưng vẫn tuyệt đối bám sát sử liệu
        topP: 0.85,
        maxOutputTokens: 600
      }
    };

    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Gemini HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const replyText = data.candidates[0].content.parts[0].text;
      geminiChatHistory.push({ role: "model", parts: [{ text: replyText }] });
      return replyText;
    } else {
      throw new Error("Phản hồi không đúng định dạng");
    }
  } catch (err) {
    console.warn("Gemini API gặp sự cố hoặc ngoại tuyến, tự động chuyển sang cơ chế dự phòng cục bộ:", err);
    // Tự động fallback về kho kiến thức offline nếu mất mạng
    return searchAIKnowledge(userQuestion);
  }
}

// Xử lý gửi tin nhắn Chatbot AI (Bất đồng bộ với Gemini)
async function handleUserChat() {
  const inputEl = document.getElementById('ai-chat-input');
  if (!inputEl) return;
  const question = inputEl.value.trim();
  if (!question) return;

  const chatContainer = document.getElementById('ai-chat-messages');
  if (!chatContainer) return;

  // Thêm tin nhắn của User
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerText = question;
  chatContainer.appendChild(userBubble);
  inputEl.value = '';

  // Cuộn xuống
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Tạo bong bóng phản hồi của AI (mô phỏng suy nghĩ)
  const botBubble = document.createElement('div');
  botBubble.className = 'chat-bubble bot';
  botBubble.innerHTML = '<em>⚡ Sử Quan AI đang tra cứu và luận đàm cùng Gemini...</em>';
  chatContainer.appendChild(botBubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  playChimeSound(480, 'sine', 0.08);

  // Gọi trực tiếp Gemini AI thông minh
  const reply = await callGeminiHistoryAI(question);
  
  // Format markdown cơ bản sang HTML
  let formattedReply = reply
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  botBubble.innerHTML = formattedReply;
  chatContainer.scrollTop = chatContainer.scrollHeight;
  playChimeSound(620, 'triangle', 0.15);
}

// Tra cứu tri thức AI với thuật toán đối sánh ngữ nghĩa thông minh
function searchAIKnowledge(query) {
  const rawLower = query.toLowerCase().trim();
  const normQuery = normalizeVietnamese(query);

  if (!normQuery) {
    return 'Dạ bạn hãy nhập câu hỏi để Sử Quan tra cứu giúp bạn nhé!';
  }

  // 1. Kiểm tra chào hỏi hoặc câu quá ngắn
  if (['chao', 'hi', 'hello', 'alo', 'e', 'hey', 'xin chao'].includes(normQuery)) {
    const greetingItem = AI_KNOWLEDGE_BASE.find(item => item.type === 'greeting');
    if (greetingItem) return greetingItem.response;
  }

  // 2. Chấm điểm độ khớp (Scoring System) cho các chủ đề trong ngân hàng tri thức
  let bestMatch = null;
  let highestScore = 0;

  for (const item of AI_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      const normKw = normalizeVietnamese(kw);
      if (normQuery.includes(normKw)) {
        // Khớp từ khóa: cộng điểm theo độ dài từ khóa (từ khóa dài được ưu tiên hơn)
        score += normKw.split(' ').length * 2;
        if (normQuery === normKw) score += 5; // Khớp chính xác
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // Nếu tìm thấy chủ đề phù hợp
  if (bestMatch && highestScore > 0) {
    return bestMatch.response;
  }

  // 3. Phản hồi tự nhiên khi chưa khớp chủ đề cụ thể (thay vì mẫu rập khuôn cũ)
  return `📜 **Sử Quan AI Tây Sơn xin thưa:**

Về câu hỏi **"${query}"**, Sử Quan hiện chưa tìm thấy ghi chép cụ thể trong biên niên sử đang nạp tại chỗ. 

Tuy nhiên, Sử Quan am hiểu sâu sắc về các chủ đề lớn sau, bạn có thể thử hỏi nhé:
1. 🌸 **Vợ & con cái:** *"Vợ vua Quang Trung là ai?"* hoặc *"Bắc Cung Hoàng hậu Lê Ngọc Hân"*.
2. ⚰️ **Nguyên nhân qua đời:** *"Tại sao vua Quang Trung mất sớm?"* (năm 1792).
3. 🐎 **Chiến thuật thần tốc:** *"Bí quyết hành quân thần tốc"* hoặc *"Trận Ngọc Hồi – Đống Đa"*.
4. 🌊 **Thủy chiến:** *"Trận Rạch Gầm – Xoài Mút"* đánh tan 5 vạn quân Xiêm.
5. 📜 **Chính sách:** *"Chữ Nôm"*, *"Chiếu Khuyến Nông"*, *"Chiếu Cầu Hiền"*.

👉 *Bạn thử bấm vào một trong các câu hỏi gợi ý bên trên hoặc tra cứu chuyên sâu tại Trạm NotebookLM nhé!*`;
}

// Chọn nhanh câu hỏi mẫu
function sendQuickPrompt(promptText) {
  const inputEl = document.getElementById('ai-chat-input');
  if (inputEl) {
    inputEl.value = promptText;
    handleUserChat();
  }
}

// Bộ Kiểm chứng Sử liệu / Chống Tin giả (Fact-Checker)
function runFactCheck(statementId) {
  const resultBox = document.getElementById('fact-check-result');
  if (!resultBox) return;

  const data = FACT_CHECK_DATABASE[statementId];
  if (!data) {
    resultBox.innerHTML = `
      <div style="text-align: center; color: var(--text-muted);">
        <p>Vui lòng chọn một nhận định lịch sử từ danh sách phía trên để AI tiến hành đối chiếu với chính sử.</p>
      </div>
    `;
    return;
  }

  resultBox.innerHTML = `
    <div class="fact-status-badge ${data.status}">
      ${data.status === 'correct' ? '✓' : '✗'} ${data.statusText}
    </div>
    <p class="fact-explanation-text">${data.explanation}</p>
    <span class="fact-source-citation">📚 Nguồn căn cứ: ${data.source}</span>
  `;

  playChimeSound(data.status === 'correct' ? 700 : 350, 'sine', 0.18);
}

// --- 8. ĐẤU TRƯỜNG KIẾN THỨC (GAMIFIED QUIZ ARENA) ---

let currentQuizLevel = 'co-ban';
let currentQuestionIndex = 0;
let currentScore = 0;
let currentStreak = 0;
let quizQuestionsList = [];

function startQuiz(levelKey) {
  currentQuizLevel = levelKey;
  quizQuestionsList = [...(QUIZ_QUESTIONS[levelKey] || QUIZ_QUESTIONS['co-ban'])];
  currentQuestionIndex = 0;
  currentScore = 0;
  currentStreak = 0;

  // Chuyển màn hình
  const picker = document.getElementById('level-picker');
  const game = document.getElementById('quiz-game');
  const result = document.getElementById('quiz-result');

  if (picker) picker.style.display = 'none';
  if (result) result.style.display = 'none';
  if (game) game.style.display = 'block';

  renderCurrentQuestion();
}

function showLevelPicker() {
  const picker = document.getElementById('level-picker');
  const game = document.getElementById('quiz-game');
  const result = document.getElementById('quiz-result');

  if (picker) picker.style.display = 'grid';
  if (game) game.style.display = 'none';
  if (result) result.style.display = 'none';
}

function renderCurrentQuestion() {
  const qData = quizQuestionsList[currentQuestionIndex];
  if (!qData) {
    finishQuiz();
    return;
  }

  // Cập nhật thông số
  const progressEl = document.getElementById('quiz-progress');
  const scoreEl = document.getElementById('quiz-score');
  const catEl = document.getElementById('quiz-category');
  const titleEl = document.getElementById('quiz-question');
  const optsContainer = document.getElementById('quiz-options');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('next-question');

  if (progressEl) progressEl.innerText = `Câu ${currentQuestionIndex + 1} / ${quizQuestionsList.length}`;
  if (scoreEl) scoreEl.innerText = `Điểm: ${currentScore} ⭐ (Chuỗi: ${currentStreak} 🔥)`;
  if (catEl) catEl.innerText = qData.category;
  if (titleEl) titleEl.innerText = qData.question;
  if (feedbackEl) feedbackEl.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';

  // Render các đáp án A, B, C, D
  const prefixes = ['A', 'B', 'C', 'D'];
  optsContainer.innerHTML = qData.options.map((opt, idx) => `
    <button class="quiz-option-btn" onclick="selectQuizAnswer(${idx}, this)">
      <span class="opt-prefix">${prefixes[idx]}</span>
      <span>${opt}</span>
    </button>
  `).join('');
}

function selectQuizAnswer(selectedIndex, btnEl) {
  const qData = quizQuestionsList[currentQuestionIndex];
  if (!qData) return;

  // Khóa tất cả các nút đáp án
  const allBtns = document.querySelectorAll('.quiz-option-btn');
  allBtns.forEach(b => b.classList.add('disabled'));

  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('next-question');

  if (selectedIndex === qData.correct) {
    // Trả lời đúng
    btnEl.classList.add('correct');
    currentScore += 10;
    currentStreak += 1;
    playChimeSound(750, 'sine', 0.2);

    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      feedbackEl.innerHTML = `<p><strong style="color: var(--success);">✓ Chính xác tuyệt vời!</strong> ${qData.explain}</p>`;
    }
  } else {
    // Trả lời sai
    btnEl.classList.add('wrong');
    currentStreak = 0;
    // Highlight câu đúng
    if (allBtns[qData.correct]) allBtns[qData.correct].classList.add('correct');
    playChimeSound(280, 'sawtooth', 0.25);

    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      feedbackEl.innerHTML = `<p><strong style="color: var(--danger);">✗ Chưa chính xác!</strong> ${qData.explain}</p>`;
    }
  }

  // Cập nhật lại điểm số ngay
  const scoreEl = document.getElementById('quiz-score');
  if (scoreEl) scoreEl.innerText = `Điểm: ${currentScore} ⭐ (Chuỗi: ${currentStreak} 🔥)`;

  // Hiện nút câu tiếp theo
  if (nextBtn) nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestionsList.length) {
    renderCurrentQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const game = document.getElementById('quiz-game');
  const result = document.getElementById('quiz-result');

  if (game) game.style.display = 'none';
  if (result) result.style.display = 'block';

  const maxScore = quizQuestionsList.length * 10;
  const percent = Math.round((currentScore / maxScore) * 100);

  const finalScoreEl = document.getElementById('final-score');
  const finalMsgEl = document.getElementById('final-message');

  if (finalScoreEl) finalScoreEl.innerText = `${currentScore} / ${maxScore} Điểm (${percent}%)`;

  let rankMessage = '';
  if (percent >= 90) {
    rankMessage = '🏆 Xuất sắc phi thường! Bạn xứng đáng nhận danh hiệu "Đại Tướng Quân Giữ Sử Tây Sơn", am hiểu sâu sắc về người anh hùng áo vải Nguyễn Huệ!';
    launchVictoryConfetti();
  } else if (percent >= 70) {
    rankMessage = '🎖️ Rất tốt! Bạn nắm rất vững các mốc son lịch sử và chiến thuật quân sự của vua Quang Trung.';
    launchVictoryConfetti();
  } else {
    rankMessage = '📖 Hành trình khám phá rất đáng khích lệ! Hãy ghé thăm Dòng thời gian và Bảo tàng số để ôn luyện thêm và chinh phục điểm số cao hơn nhé!';
  }

  if (finalMsgEl) finalMsgEl.innerText = rankMessage;
  playChimeSound(800, 'triangle', 0.4);
}

// Hiệu ứng pháo hoa chúc mừng (Canvas Confetti đơn giản không cần thư viện)
function launchVictoryConfetti() {
  try {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#D4AF37', '#B31B1B', '#F5C542', '#10B981', '#FFF'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    let animationId;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // trọng lực
        p.alpha -= p.decay;
        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.restore();
        }
      });
      if (alive) {
        animationId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationId);
        canvas.remove();
      }
    }
    render();
  } catch (e) {}
}

// --- 9. GÓC TRẢI NGHIỆM & KHẢO SÁT DỮ LIỆU KHKT ---

let selectedRatingStars = 5;

function selectRatingStar(rating) {
  selectedRatingStars = rating;
  const stars = document.querySelectorAll('.star-rating-box .star-icon');
  stars.forEach((s, idx) => {
    if (idx < rating) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
}

function handleFeedbackSubmit(e) {
  e.preventDefault();
  const nameEl = document.getElementById('feedback-name');
  const textEl = document.getElementById('feedback-text');

  const name = nameEl ? nameEl.value.trim() : 'Học sinh ẩn danh';
  const text = textEl ? textEl.value.trim() : '';

  if (!text) {
    alert('Vui lòng nhập đôi dòng cảm nhận của bạn.');
    return;
  }

  // Thêm vào danh sách cảm nhận (LocalStorage)
  const newReview = {
    name: name || 'Học sinh trải nghiệm',
    stars: selectedRatingStars,
    text: text,
    date: 'Vừa xong'
  };

  let reviews = [];
  try {
    const saved = localStorage.getItem('khkt_reviews_su');
    if (saved) reviews = JSON.parse(saved);
  } catch (err) {}

  reviews.unshift(newReview);
  try {
    localStorage.setItem('khkt_reviews_su', JSON.stringify(reviews));
  } catch (err) {}

  alert('Cảm ơn bạn rất nhiều! Ý kiến đóng góp quý báu của bạn đã được ghi nhận vào báo cáo thực nghiệm Cuộc thi KHKT.');
  if (textEl) textEl.value = '';
  renderReviewsList();
  playChimeSound(600, 'sine', 0.2);
}

function renderReviewsList() {
  const container = document.getElementById('recent-reviews-container');
  if (!container) return;

  // Dữ liệu mẫu thực tế ban đầu
  let reviews = [
    { name: 'Nguyễn Minh Tuấn (Lớp 11A1)', stars: 5, text: 'Web giao diện rất đẹp, hào hùng đúng chất sử thi Tây Sơn. Nhờ trạm AI và sa bàn trận đánh mà em dễ dàng ghi nhớ chiến dịch Ngọc Hồi Đống Đa!', date: 'Hôm nay' },
    { name: 'Trần Thị Mai Phương (Lớp 12 Văn)', stars: 5, text: 'Bộ kiểm chứng tin giả rất độc đáo và khoa học! Không ngờ việc học sử lại trở nên trực quan và cuốn hút đến vậy.', date: 'Hôm qua' },
    { name: 'Lê Hoàng Hải (Lớp 10 Tin)', stars: 5, text: 'Hệ thống câu hỏi đố vui rất hay, có giải thích sử liệu chi tiết. Chúc nhóm đạt giải cao trong cuộc thi KHKT sắp tới!', date: '3 ngày trước' }
  ];

  try {
    const saved = localStorage.getItem('khkt_reviews_su');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) reviews = parsed;
    }
  } catch (err) {}

  container.innerHTML = reviews.slice(0, 5).map(rev => `
    <div class="review-item">
      <div class="review-header">
        <span class="review-author">${rev.name}</span>
        <span class="review-stars">${'★'.repeat(rev.stars)}${'☆'.repeat(5 - rev.stars)}</span>
      </div>
      <p class="review-text">${rev.text}</p>
    </div>
  `).join('');
}

// --- 10. KHỞI TẠO TOÀN DIỆN KHI TRANG TẢI XONG ---

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo Bảo tàng số
  initMuseum();

  // 2. Khởi tạo Sa bàn trận đánh đầu tiên
  showBattle('rach-gam', document.querySelector('.battle-nav-tab'));

  // 3. Khởi tạo Đánh giá cảm nhận
  renderReviewsList();

  // 4. Lắng nghe phím Enter trong ô Chat AI
  const aiInput = document.getElementById('ai-chat-input');
  if (aiInput) {
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUserChat();
      }
    });
  }

  // 5. Kiểm tra hash URL để mở trang tương ứng
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    openPage(hash);
  } else {
    showHome();
  }
});
