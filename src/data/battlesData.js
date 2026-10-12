export const BATTLES_DATA = {
  'rach-gam': {
    id: 'rach-gam',
    title: 'Thủy Chiến Rạch Gầm – Xoài Mút (1785)',
    subtitle: 'Nghệ thuật nhử địch và giáp công bao vây trên sông Tiền',
    center: [10.335, 106.310],
    zoom: 12,
    time: 'Đêm 19 rạng sáng 20/01/1785',
    commander: 'Long Nhương Tướng Quân Nguyễn Huệ',
    enemyCommander: 'Chiêu Tăng & Chiêu Sương (Xiêm La), Nguyễn Ánh',
    enemyForce: 'Khoảng 5 vạn quân (2 vạn thủy binh, 3 vạn bộ binh) cùng 300 thuyền chiến',
    ourForce: 'Khoảng 2 vạn quân Tây Sơn cùng hạm đội thuyền chiến hỏa hổ cơ động',
    summary: 'Nguyễn Huệ không đánh trực diện mà nghiên cứu quy luật dòng chảy con nước triều sông Tiền, bố trí bẫy phục kích dài khoảng 6–7km từ Rạch Gầm đến Xoài Mút. Khi đoàn thuyền giặc lọt vào lòng sông lúc triều rút, hai cánh thủy quân Tây Sơn từ các nhánh rạch lao ra khóa chặt hai đầu, phối hợp đại bác và hỏa hổ từ cù lao Thới Sơn thiêu rụi hạm đội giặc trong một đêm.',
    forcesComparison: {
      ourForces: {
        name: 'Nghĩa Quân Tây Sơn',
        count: 'Khoảng 2 vạn quân',
        percent: 28,
        color: '#10B981',
        details: 'Chiến thuyền hỏa hổ cơ động, đại bác dã chiến, quân thủy bộ tinh nhuệ'
      },
      enemyForces: {
        name: 'Liên Quân Xiêm La & Nguyễn Ánh',
        count: 'Khoảng 5 vạn quân (2 vạn thủy, 3 vạn bộ)',
        percent: 72,
        color: '#EF4444',
        details: 'Hơn 300 thuyền chiến hỏa khí hạng nặng'
      },
      ratioNote: 'Tương quan 1 chọi gần 3 (Lấy ít địch nhiều, mưu sâu chôn vùi 5 vạn giặc trong một đêm)'
    },
    funFacts: [
      {
        icon: 'Waves',
        title: 'Lợi dụng con nước triều',
        desc: 'Nguyễn Huệ tính toán chính xác chu kỳ triều rút sông Tiền để nhử địch vào cạm bẫy hẹp.'
      },
      {
        icon: 'Flame',
        title: 'Ống phóng Hỏa Hổ uy lực',
        desc: 'Hàng trăm ống hỏa hổ thiêu rụi thuyền Xiêm khiến quân giặc nhảy xuống sông tán loạn.'
      },
      {
        icon: 'Swords',
        title: 'Thắng lợi trong một đêm',
        desc: 'Toàn bộ 300 thuyền chiến và gần 5 vạn quân Xiêm bị xóa sổ chỉ trong một đêm rạng sáng 20/01/1785.'
      }
    ],
    phases: [
      {
        label: 'Nghi binh nhử địch',
        phase: 'Giai đoạn 1: Nghi binh nhử địch',
        tag: 'Khởi đầu trận đánh',
        icon: '⚔️',
        center: [10.355, 106.275],
        zoom: 13,
        desc: 'Cho thuyền nhỏ ra khiêu chiến rồi giả thua rút lui theo dòng chảy, kích động tướng Xiêm Chiêu Tăng dốc toàn lực hạm đội đuổi theo vào đúng đoạn sông mai phục.',
        miniQuiz: {
          question: 'Tại sao Nguyễn Huệ lại cho thuyền nhỏ ra khiêu chiến rồi vờ rút lui?',
          options: ['Do quân ít sợ hãi', 'Nghi binh nhử địch vào bẫy sông Rạch Gầm', 'Đợi viện binh từ Quy Nhơn', 'Để trinh sát ban ngày'],
          correct: 1,
          explain: 'Kế nghi binh giả thua khiến tướng Chiêu Tăng khinh địch, thúc toàn bộ 300 thuyền chiến tiến vào lòng sông mai phục.'
        }
      },
      {
        label: 'Khóa gọng kìm',
        phase: 'Giai đoạn 2: Khóa chặt thế gọng kìm',
        tag: 'Bước ngoặt then chốt',
        icon: '🔒',
        center: [10.335, 106.310],
        zoom: 13,
        desc: 'Đúng lúc nước ròng (thủy triều rút nhanh), hai đạo thủy binh Tây Sơn từ rạch Rạch Gầm và rạch Xoài Mút đồng loạt xông ra bịt kín lối tiến lẫn lối thoái của giặc.',
        miniQuiz: {
          question: 'Yếu tố tự nhiên nào quyết định thời điểm phát lệnh công kích của quân Tây Sơn?',
          options: ['Gió mùa đông bắc', 'Trời đổ mưa rào', 'Nước ròng (thủy triều rút nhanh)', 'Sương mù dày đặc'],
          correct: 2,
          explain: 'Khi nước ròng rút nhanh, thuyền chiến lớn của giặc bị cản trở dòng chảy và mắc cạn, tạo thời cơ gọng kìm khép lại.'
        }
      },
      {
        label: 'Pháo hỏa hủy diệt',
        phase: 'Giai đoạn 3: Pháo hỏa hủy diệt',
        tag: 'Quyết chiến toàn thắng',
        icon: '🔥',
        center: [10.338, 106.320],
        zoom: 13.5,
        desc: 'Từ cù lao Thới Sơn và hai bờ cây cối rậm rạp, pháo binh dã chiến và ống hỏa hổ bắn xối xả chia cắt đội hình, đốt cháy và đánh chìm toàn bộ 300 chiến thuyền giặc.',
        miniQuiz: {
          question: 'Lực lượng pháo binh và hỏa hổ Tây Sơn được bố trí mai phục ở đâu?',
          options: ['Cù lao Thới Sơn và hai bờ sông', 'Trên núi Bà Đen', 'Sau thành Mỹ Tho', 'Thả trôi theo bè lửa'],
          correct: 0,
          explain: 'Địa hình cù lao Thới Sơn rậm rạp giữa lòng sông Tiền là trận địa pháo bí mật xả đạn chia cắt đội hình thuyền giặc.'
        }
      }
    ],
    tactics: [
      { 
        id: 1,
        label: 'Nghi binh nhử địch',
        phase: 'Giai đoạn 1: Nghi binh nhử địch', 
        tag: 'Khởi đầu trận đánh',
        icon: '⚔️',
        center: [10.355, 106.275],
        zoom: 13,
        desc: 'Cho thuyền nhỏ ra khiêu chiến rồi giả thua rút lui theo dòng chảy, kích động tướng Xiêm Chiêu Tăng dốc toàn lực hạm đội đuổi theo vào đúng đoạn sông mai phục.',
        miniQuiz: {
          question: 'Tại sao Nguyễn Huệ lại cho thuyền nhỏ ra khiêu chiến rồi vờ rút lui?',
          options: ['Do quân ít sợ hãi', 'Nghi binh nhử địch vào bẫy sông Rạch Gầm', 'Đợi viện binh từ Quy Nhơn', 'Để trinh sát ban ngày'],
          correct: 1,
          explain: 'Kế nghi binh giả thua khiến tướng Chiêu Tăng khinh địch, thúc toàn bộ 300 thuyền chiến tiến vào lòng sông mai phục.'
        }
      },
      { 
        id: 2,
        label: 'Khóa gọng kìm',
        phase: 'Giai đoạn 2: Khóa chặt thế gọng kìm', 
        tag: 'Bước ngoặt then chốt',
        icon: '🔒',
        center: [10.335, 106.310],
        zoom: 13,
        desc: 'Đúng lúc nước ròng (thủy triều rút nhanh), hai đạo thủy binh Tây Sơn từ rạch Rạch Gầm và rạch Xoài Mút đồng loạt xông ra bịt kín lối tiến lẫn lối thoái của giặc.',
        miniQuiz: {
          question: 'Yếu tố tự nhiên nào quyết định thời điểm phát lệnh công kích của quân Tây Sơn?',
          options: ['Gió mùa đông bắc', 'Trời đổ mưa rào', 'Nước ròng (thủy triều rút nhanh)', 'Sương mù dày đặc'],
          correct: 2,
          explain: 'Khi nước ròng rút nhanh, thuyền chiến lớn của giặc bị cản trở dòng chảy và mắc cạn, tạo thời cơ gọng kìm khép lại.'
        }
      },
      { 
        id: 3,
        label: 'Pháo hỏa hủy diệt',
        phase: 'Giai đoạn 3: Pháo hỏa hủy diệt', 
        tag: 'Quyết chiến toàn thắng',
        icon: '🔥',
        center: [10.338, 106.320],
        zoom: 13.5,
        desc: 'Từ cù lao Thới Sơn và hai bờ cây cối rậm rạp, pháo binh dã chiến và ống hỏa hổ bắn xối xả chia cắt đội hình, đốt cháy và đánh chìm toàn bộ 300 chiến thuyền giặc.',
        miniQuiz: {
          question: 'Lực lượng pháo binh và hỏa hổ Tây Sơn được bố trí mai phục ở đâu?',
          options: ['Cù lao Thới Sơn và hai bờ sông', 'Trên núi Bà Đen', 'Sau thành Mỹ Tho', 'Thả trôi theo bè lửa'],
          correct: 0,
          explain: 'Địa hình cù lao Thới Sơn rậm rạp giữa lòng sông Tiền là trận địa pháo bí mật xả đạn chia cắt đội hình thuyền giặc.'
        }
      }
    ],
    // Vùng chiến lược tổng quát (Operational Areas)
    zones: [
      {
        id: 'zone-ambush-river',
        title: 'Vùng sông Tiền phục kích (Rạch Gầm – Xoài Mút)',
        type: 'battlefield',
        color: '#D4AF37',
        coords: [
          [10.355, 106.270],
          [10.345, 106.295],
          [10.320, 106.340],
          [10.310, 106.330],
          [10.335, 106.280],
          [10.355, 106.270]
        ],
        desc: 'Đoạn sông dài khoảng 7km, lòng sông rộng nhưng có nhiều cù lao chia cắt dòng chảy, là lòng chảo mai phục tiêu diệt chiến thuyền giặc.'
      },
      {
        id: 'zone-thoi-son',
        title: 'Khu vực cù lao Thới Sơn (Trận địa hỏa lực mai phục)',
        type: 'friendly',
        color: '#10B981',
        coords: [
          [10.345, 106.305],
          [10.348, 106.330],
          [10.330, 106.335],
          [10.328, 106.310],
          [10.345, 106.305]
        ],
        desc: 'Cù lao rậm rạp giữa sông nơi bố trí bí mật bộ binh tinh nhuệ, đại bác dã chiến và súng phun lửa hỏa hổ ẩn mình chờ lệnh.'
      }
    ],
    // Các hướng tiến công và chuyển quân (Directional Flow Lines)
    flows: [
      {
        id: 'flow-enemy-advance',
        title: 'Hướng hạm đội thuyền giặc Xiêm tiến vào bẫy',
        type: 'enemy',
        color: '#EF4444',
        dashArray: '8, 8',
        points: [
          [10.360, 106.260],
          [10.350, 106.280],
          [10.338, 106.305],
          [10.325, 106.325]
        ],
        desc: 'Quân Xiêm hăm hở đuổi theo thuyền nghi binh của Tây Sơn xuôi theo dòng chảy sông Tiền.'
      },
      {
        id: 'flow-ally-lock-north',
        title: 'Cánh thủy quân Tây Sơn khóa đầu thượng lưu (Rạch Gầm)',
        type: 'friendly',
        color: '#F59E0B',
        points: [
          [10.370, 106.280],
          [10.355, 106.285],
          [10.348, 106.290]
        ],
        desc: 'Thủy quân Tây Sơn từ rạch Rạch Gầm lao ra cắt đứt đường rút lui phía trên của quân địch.'
      },
      {
        id: 'flow-ally-lock-south',
        title: 'Cánh thủy quân Tây Sơn khóa đuôi hạ lưu (Xoài Mút)',
        type: 'friendly',
        color: '#F59E0B',
        points: [
          [10.315, 106.350],
          [10.322, 106.338],
          [10.328, 106.325]
        ],
        desc: 'Cánh quân thứ hai từ rạch Xoài Mút và Mỹ Tho khóa kín cửa dưới, hoàn thành thế gọng kìm bất khả kháng.'
      }
    ]
  },

  'ngoc-hoi-dong-da': {
    id: 'ngoc-hoi-dong-da',
    title: 'Đại Phá Quân Thanh – Ngọc Hồi Đống Đa (1789)',
    subtitle: 'Nghệ thuật hành quân thần tốc và 5 mũi tiến công táo bạo',
    center: [20.940, 105.840],
    zoom: 11,
    time: 'Đêm 30 tháng Chạp năm Mậu Thân đến mùng 5 Tết Kỷ Dậu (1789)',
    commander: 'Hoàng đế Quang Trung – Nguyễn Huệ',
    enemyCommander: 'Tổng đốc Tôn Sĩ Nghị, Sầm Nghi Đống, Hứa Thế Hanh',
    enemyForce: '29 vạn quân Mãn Thanh đóng tại các cứ điểm quanh Thăng Long',
    ourForce: 'Khoảng 10 vạn quân Tây Sơn cùng hàng trăm thớt voi chiến và ống hỏa hổ',
    summary: 'Từ phòng tuyến Tam Điệp, vua Quang Trung chia quân làm 5 đạo tiến công đồng loạt. Mũi chủ lực do nhà vua chỉ huy dùng voi chiến và khiên rơm ướt phá tan đồn thép Ngọc Hồi. Cùng lúc, mũi vu hồi của Đô đốc Long luồn sâu đánh úp đồn Đống Đa khiến giặc tan vỡ hàng loạt. Trưa mùng 5 Tết, đại quân tiến vào Thăng Long trước sự hoảng loạn tháo chạy của Tôn Sĩ Nghị.',
    forcesComparison: {
      ourForces: {
        name: 'Đại Quân Tây Sơn',
        count: 'Khoảng 10 vạn quân',
        percent: 25,
        color: '#10B981',
        details: 'Hơn 100 thớt voi chiến mang hỏa hổ, dũng sĩ mang khiên rơm ướt, bộ binh hành quân thần tốc'
      },
      enemyForces: {
        name: 'Quân Xâm Lược Mãn Thanh',
        count: '29 vạn quân Mãn Thanh',
        percent: 75,
        color: '#EF4444',
        details: 'Kỵ binh Bát Kỳ thiện chiến, hỏa khí, công sự đồn lũy kiên cố tại Ngọc Hồi và Thăng Long'
      },
      ratioNote: 'Tương quan 1 chọi gần 3 (10 vạn quân thần tốc đè bẹp 29 vạn giặc trong 5 ngày Tết Kỷ Dậu)'
    },
    funFacts: [
      {
        icon: 'Sparkles',
        title: 'Ăn Tết sớm 30 Chạp',
        desc: 'Quang Trung khao quân ăn Tết trước ở Tam Điệp, hẹn mùng 7 Tết sẽ vào Thăng Long ăn mừng khải hoàn.'
      },
      {
        icon: 'Shield',
        title: 'Khiên bọc rơm ướt',
        desc: 'Cứ 20 dũng sĩ khiêng ván ghép bọc rơm ướt chắn hỏa khí súng đạn mở đường cho voi chiến công phá đồn.'
      },
      {
        icon: 'Flame',
        title: 'Hành quân thần tốc phi thường',
        desc: 'Đại quân đi bộ từ Phú Xuân ra Thăng Long hơn 600km chỉ trong vài ngày bằng cách cáng luân phiên.'
      }
    ],
    phases: [
      {
        label: 'Tam Điệp & Ăn Tết sớm',
        phase: 'Giai đoạn 1: Bàn đạp Tam Điệp & Ăn Tết sớm',
        tag: 'Xuất quân thần tốc',
        icon: '🏕️',
        center: [20.140, 105.930],
        zoom: 11.5,
        desc: 'Tập kết toàn quân tại phòng tuyến Tam Điệp – Biện Sơn, khao quân ăn Tết trước vào ngày 30 tháng Chạp, hẹn mùng 7 Tết sẽ vào Thăng Long ăn mừng khải hoàn.',
        miniQuiz: {
          question: 'Vua Quang Trung khao quân ăn Tết trước ở đâu và hẹn khi nào vào Thăng Long?',
          options: ['Ở Nghệ An, hẹn rằm tháng Giêng', 'Ở Tam Điệp, hẹn mùng 7 Tết', 'Ở Thanh Hóa, hẹn mùng 1 Tết', 'Ở Phú Xuân, hẹn mùng 10'],
          correct: 1,
          explain: 'Vua khao quân ăn Tết sớm ở Tam Điệp – Biện Sơn ngày 30 Chạp, khẳng định chắc nịch sẽ ăn Tết chính thức tại Thăng Long vào mùng 7 Tết.'
        }
      },
      {
        label: 'Công phá Ngọc Hồi',
        phase: 'Giai đoạn 2: Hạ đồn Hà Hồi & Công phá Ngọc Hồi',
        tag: 'Đột phá cứ điểm thép',
        icon: '🐘',
        center: [20.910, 105.845],
        zoom: 12.5,
        desc: 'Đêm mùng 3 vây đồn Hà Hồi bằng cờ lệnh tiếng hò reo, bắt sống toàn bộ giặc. Rạng sáng mùng 5, voi chiến mang hỏa hổ cùng dũng sĩ mang khiên bọc rơm ướt xông lên bẻ gãy đồn thép Ngọc Hồi.',
        miniQuiz: {
          question: 'Chiến thuật độc đáo nào giúp nghĩa quân Tây Sơn vô hiệu hóa hỏa lực súng đạn tại đồn Ngọc Hồi?',
          options: ['Đào hào ngầm', 'Dùng khiên bện rơm ướt chắn đạn', 'Chờ sương mù tan', 'Bắn tên lửa ban đêm'],
          correct: 1,
          explain: 'Dũng sĩ Tây Sơn ghép ván bện rơm dấp nước bên ngoài che chắn hỏa tiễn và súng đạn của quân Thanh, tạo đường cho voi chiến xông lên.'
        }
      },
      {
        label: 'Đánh úp Đống Đa',
        phase: 'Giai đoạn 3: Đánh úp Đống Đa & Giải phóng Thăng Long',
        tag: 'Khải hoàn Thăng Long',
        icon: '⚡',
        center: [21.015, 105.830],
        zoom: 12.5,
        desc: 'Đạo quân Đô đốc Long phối hợp nhân dân luồn sâu đánh bất ngờ vào đồn Khương Thượng – Đống Đa khiến Sầm Nghi Đống tự vẫn. Tôn Sĩ Nghị bỏ chạy đứt cầu phao sông Hồng.',
        miniQuiz: {
          question: 'Đạo quân của vị tướng nào đã luồn sâu đánh bất ngờ vào đồn Khương Thượng – Đống Đa?',
          options: ['Đô đốc Long (Đặng Tiến Đông)', 'Đô đốc Bảo', 'Ngô Thì Nhậm', 'Nguyễn Nhạc'],
          correct: 0,
          explain: 'Đạo quân Đô đốc Long phối hợp cùng nhân dân địa phương đánh bất ngờ lúc rạng sáng, khiến tướng giặc Sầm Nghi Đống phải thắt cổ tự vẫn.'
        }
      }
    ],
    tactics: [
      { 
        id: 1,
        label: 'Tam Điệp & Ăn Tết sớm',
        phase: 'Giai đoạn 1: Bàn đạp Tam Điệp & Ăn Tết sớm', 
        tag: 'Xuất quân thần tốc',
        icon: '🏕️',
        center: [20.140, 105.930],
        zoom: 11.5,
        desc: 'Tập kết toàn quân tại phòng tuyến Tam Điệp – Biện Sơn, khao quân ăn Tết trước vào ngày 30 tháng Chạp, hẹn mùng 7 Tết sẽ vào Thăng Long ăn mừng khải hoàn.',
        miniQuiz: {
          question: 'Vua Quang Trung khao quân ăn Tết trước ở đâu và hẹn khi nào vào Thăng Long?',
          options: ['Ở Nghệ An, hẹn rằm tháng Giêng', 'Ở Tam Điệp, hẹn mùng 7 Tết', 'Ở Thanh Hóa, hẹn mùng 1 Tết', 'Ở Phú Xuân, hẹn mùng 10'],
          correct: 1,
          explain: 'Vua khao quân ăn Tết sớm ở Tam Điệp – Biện Sơn ngày 30 Chạp, khẳng định chắc nịch sẽ ăn Tết chính thức tại Thăng Long vào mùng 7 Tết.'
        }
      },
      { 
        id: 2,
        label: 'Công phá Ngọc Hồi',
        phase: 'Giai đoạn 2: Hạ đồn Hà Hồi & Công phá Ngọc Hồi', 
        tag: 'Đột phá cứ điểm thép',
        icon: '🐘',
        center: [20.910, 105.845],
        zoom: 12.5,
        desc: 'Đêm mùng 3 vây đồn Hà Hồi bằng cờ lệnh tiếng hò reo, bắt sống toàn bộ giặc. Rạng sáng mùng 5, voi chiến mang hỏa hổ cùng dũng sĩ mang khiên bọc rơm ướt xông lên bẻ gãy đồn thép Ngọc Hồi.',
        miniQuiz: {
          question: 'Chiến thuật độc đáo nào giúp nghĩa quân Tây Sơn vô hiệu hóa hỏa lực súng đạn tại đồn Ngọc Hồi?',
          options: ['Đào hào ngầm', 'Dùng khiên bện rơm ướt chắn đạn', 'Chờ sương mù tan', 'Bắn tên lửa ban đêm'],
          correct: 1,
          explain: 'Dũng sĩ Tây Sơn ghép ván bện rơm dấp nước bên ngoài che chắn hỏa tiễn và súng đạn của quân Thanh, tạo đường cho voi chiến xông lên.'
        }
      },
      { 
        id: 3,
        label: 'Đánh úp Đống Đa',
        phase: 'Giai đoạn 3: Đánh úp Đống Đa & Giải phóng Thăng Long', 
        tag: 'Khải hoàn Thăng Long',
        icon: '⚡',
        center: [21.015, 105.830],
        zoom: 12.5,
        desc: 'Đạo quân Đô đốc Long phối hợp nhân dân luồn sâu đánh bất ngờ vào đồn Khương Thượng – Đống Đa khiến Sầm Nghi Đống tự vẫn. Tôn Sĩ Nghị bỏ chạy đứt cầu phao sông Hồng.',
        miniQuiz: {
          question: 'Đạo quân của vị tướng nào đã luồn sâu đánh bất ngờ vào đồn Khương Thượng – Đống Đa?',
          options: ['Đô đốc Long (Đặng Tiến Đông)', 'Đô đốc Bảo', 'Ngô Thì Nhậm', 'Nguyễn Nhạc'],
          correct: 0,
          explain: 'Đạo quân Đô đốc Long phối hợp cùng nhân dân địa phương đánh bất ngờ lúc rạng sáng, khiến tướng giặc Sầm Nghi Đống phải thắt cổ tự vẫn.'
        }
      }
    ],
    // Vùng chiến lược tổng quát
    zones: [
      {
        id: 'zone-tam-diep',
        title: 'Khu vực phòng tuyến Tam Điệp – Biện Sơn',
        type: 'friendly',
        color: '#10B981',
        coords: [
          [20.120, 105.880],
          [20.180, 105.950],
          [20.150, 106.020],
          [20.080, 105.920],
          [20.120, 105.880]
        ],
        desc: 'Phòng tuyến hiểm trở nơi hội tụ đại quân thủy bộ Tây Sơn, khao quân ăn Tết sớm trước ngày xuất quân thần tốc.'
      },
      {
        id: 'zone-ngoc-hoi-fortress',
        title: 'Cụm cứ điểm phòng ngự Ngọc Hồi – Văn Điển',
        type: 'enemy',
        color: '#EF4444',
        coords: [
          [20.910, 105.830],
          [20.950, 105.860],
          [20.930, 105.880],
          [20.890, 105.840],
          [20.910, 105.830]
        ],
        desc: 'Cứ điểm kiên cố nhất của quân Thanh án ngữ cửa ngõ phía Nam Thăng Long, có bãi chông ngầm và hỏa lực mạnh.'
      },
      {
        id: 'zone-thang-long',
        title: 'Khu vực kinh thành Thăng Long & Cầu phao sông Hồng',
        type: 'battlefield',
        color: '#D4AF37',
        coords: [
          [21.000, 105.820],
          [21.050, 105.840],
          [21.040, 105.880],
          [20.990, 105.850],
          [21.000, 105.820]
        ],
        desc: 'Trung tâm đầu não của Tôn Sĩ Nghị và khu vực cầu phao bị đứt khi quân Thanh chen chúc tháo chạy.'
      }
    ],
    // Các hướng tiến công và chuyển quân
    flows: [
      {
        id: 'flow-main-advance',
        title: 'Mũi tiến công chủ lực của vua Quang Trung',
        type: 'friendly',
        color: '#F59E0B',
        points: [
          [20.200, 105.900],
          [20.550, 105.880],
          [20.880, 105.850], // Hà Hồi
          [20.935, 105.845]  // Ngọc Hồi
        ],
        desc: 'Đạo quân chủ lực do đích thân vua Quang Trung cưỡi voi đốc chiến, phá đồn Hà Hồi rồi đè bẹp cứ điểm Ngọc Hồi.'
      },
      {
        id: 'flow-flank-dong-da',
        title: 'Mũi vu hồi của Đô đốc Long tập kích Đống Đa',
        type: 'friendly',
        color: '#10B981',
        dashArray: '6, 6',
        points: [
          [20.600, 105.750],
          [20.850, 105.770],
          [21.010, 105.825]  // Khương Thượng - Đống Đa
        ],
        desc: 'Đạo quân bí mật vòng qua sườn phía Tây, bất ngờ đánh úp đồn Khương Thượng – Đống Đa làm sụp đổ toàn bộ cánh quân Thanh.'
      },
      {
        id: 'flow-enemy-retreat',
        title: 'Hướng tháo chạy hỗn loạn của Tôn Sĩ Nghị qua sông Hồng',
        type: 'enemy',
        color: '#EF4444',
        dashArray: '6, 6',
        points: [
          [21.035, 105.850],
          [21.060, 105.870],
          [21.150, 105.950]
        ],
        desc: 'Tôn Sĩ Nghị cùng tàn quân hoảng sợ vượt cầu phao sông Nhị chạy thục mạng về phương Bắc.'
      }
    ]
  }
};
