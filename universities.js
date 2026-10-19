/**
 * AURA SYSTEM — DANH SÁCH 285+ TRƯỜNG ĐẠI HỌC & HỌC VIỆN VIỆT NAM
 * Trích xuất từ tệp chính thức: 'Danh sách các trường đại học ở VN.pdf'
 */
(function() {
    const UNIVERSITIES = [
  {
    "stt": 1,
    "code": "VNU",
    "name": "Đại học Quốc gia Hà Nội",
    "displayName": "Đại học Quốc gia Hà Nội (VNU)",
    "region": "Hà Nội"
  },
  {
    "stt": 2,
    "code": "QHL",
    "name": "Khoa Luật (ĐHQG Hà Nội)",
    "displayName": "Khoa Luật (ĐHQG Hà Nội) (QHL)",
    "region": "Hà Nội"
  },
  {
    "stt": 3,
    "code": "QHQ",
    "name": "Khoa Quốc tế (ĐHQG Hà Nội)",
    "displayName": "Khoa Quốc tế (ĐHQG Hà Nội) (QHQ)",
    "region": "Hà Nội"
  },
  {
    "stt": 4,
    "code": "QHY",
    "name": "Trường Đại học Y Dược (ĐHQG Hà Nội)",
    "displayName": "Trường Đại học Y Dược (ĐHQG Hà Nội) (QHY)",
    "region": "Hà Nội"
  },
  {
    "stt": 5,
    "code": "QHI",
    "name": "Trường Đại học Công nghệ (ĐHQG Hà Nội)",
    "displayName": "Trường Đại học Công nghệ (ĐHQG Hà Nội) (QHI)",
    "region": "Hà Nội"
  },
  {
    "stt": 6,
    "code": "QHE",
    "name": "Trường Đại học Kinh tế (ĐHQG Hà Nội)",
    "displayName": "Trường Đại học Kinh tế (ĐHQG Hà Nội) (QHE)",
    "region": "Hà Nội"
  },
  {
    "stt": 7,
    "code": "QHS",
    "name": "Trường ĐH Giáo dục (ĐHQG Hà Nội)",
    "displayName": "Trường ĐH Giáo dục (ĐHQG Hà Nội) (QHS)",
    "region": "Hà Nội"
  },
  {
    "stt": 8,
    "code": "QHT",
    "name": "Trường ĐH Khoa học Tự nhiên (ĐHQG Hà Nội)",
    "displayName": "Trường ĐH Khoa học Tự nhiên (ĐHQG Hà Nội) (QHT)",
    "region": "Hà Nội"
  },
  {
    "stt": 9,
    "code": "QHX",
    "name": "Trường ĐH Khoa học Xã hội và Nhân văn (ĐHQG Hà Nội)",
    "displayName": "Trường ĐH Khoa học Xã hội và Nhân văn (ĐHQG Hà Nội) (QHX)",
    "region": "Hà Nội"
  },
  {
    "stt": 10,
    "code": "QHD",
    "name": "Trường Quản trị và kinh doanh (ĐHQG Hà Nội)",
    "displayName": "Trường Quản trị và kinh doanh (ĐHQG Hà Nội) (QHD)",
    "region": "Hà Nội"
  },
  {
    "stt": 11,
    "code": "QHF",
    "name": "Trường Đại học Ngoại ngữ (ĐHQG Hà Nội)",
    "displayName": "Trường Đại học Ngoại ngữ (ĐHQG Hà Nội) (QHF)",
    "region": "Hà Nội"
  },
  {
    "stt": 12,
    "code": "VJU",
    "name": "Trường Đại học Việt Nhật (ĐHQG Hà Nội)",
    "displayName": "Trường Đại học Việt Nhật (ĐHQG Hà Nội) (VJU)",
    "region": "Hà Nội"
  },
  {
    "stt": 13,
    "code": "NVH",
    "name": "Học viện Âm nhạc Quốc gia Việt Nam",
    "displayName": "Học viện Âm nhạc Quốc gia Việt Nam (NVH)",
    "region": "Hà Nội"
  },
  {
    "stt": 14,
    "code": "HBT",
    "name": "Học viện Báo chí Tuyên truyền",
    "displayName": "Học viện Báo chí Tuyên truyền (HBT)",
    "region": "Hà Nội"
  },
  {
    "stt": 15,
    "code": "HCP",
    "name": "Học viện Chính sách và Phát triển",
    "displayName": "Học viện Chính sách và Phát triển (HCP)",
    "region": "Hà Nội"
  },
  {
    "stt": 16,
    "code": "BVH",
    "name": "Học viện Công nghệ Bưu chính Viễn thông",
    "displayName": "Học viện Công nghệ Bưu chính Viễn thông (BVH)",
    "region": "Hà Nội"
  },
  {
    "stt": 17,
    "code": "HCH",
    "name": "Học viện Hành chính Quốc gia",
    "displayName": "Học viện Hành chính Quốc gia (HCH)",
    "region": "Hà Nội"
  },
  {
    "stt": 18,
    "code": "KMA",
    "name": "Học viện Kỹ thuật Mật mã",
    "displayName": "Học viện Kỹ thuật Mật mã (KMA)",
    "region": "Hà Nội"
  },
  {
    "stt": 19,
    "code": "NHH",
    "name": "Học viện Ngân hàng",
    "displayName": "Học viện Ngân hàng (NHH)",
    "region": "Hà Nội"
  },
  {
    "stt": 20,
    "code": "HQT",
    "name": "Học viện Ngoại giao",
    "displayName": "Học viện Ngoại giao (HQT)",
    "region": "Hà Nội"
  },
  {
    "stt": 21,
    "code": "HVN",
    "name": "Học viện Nông nghiệp Việt Nam",
    "displayName": "Học viện Nông nghiệp Việt Nam (HVN)",
    "region": "Hà Nội"
  },
  {
    "stt": 22,
    "code": "HPN",
    "name": "Học viện Phụ nữ Việt Nam",
    "displayName": "Học viện Phụ nữ Việt Nam (HPN)",
    "region": "Hà Nội"
  },
  {
    "stt": 23,
    "code": "HVQ",
    "name": "Học viện Quản lý Giáo dục",
    "displayName": "Học viện Quản lý Giáo dục (HVQ)",
    "region": "Hà Nội"
  },
  {
    "stt": 24,
    "code": "HTC",
    "name": "Học viện Tài chính",
    "displayName": "Học viện Tài chính (HTC)",
    "region": "Hà Nội"
  },
  {
    "stt": 25,
    "code": "HTN",
    "name": "Học viện Thanh Thiếu niên Việt Nam",
    "displayName": "Học viện Thanh Thiếu niên Việt Nam (HTN)",
    "region": "Hà Nội"
  },
  {
    "stt": 26,
    "code": "HTA",
    "name": "Học viện Tòa án",
    "displayName": "Học viện Tòa án (HTA)",
    "region": "Hà Nội"
  },
  {
    "stt": 27,
    "code": "HYD",
    "name": "Học viện Y Dược học cổ truyền Việt Nam",
    "displayName": "Học viện Y Dược học cổ truyền Việt Nam (HYD)",
    "region": "Hà Nội"
  },
  {
    "stt": 28,
    "code": "BKA",
    "name": "Đại học Bách khoa Hà Nội",
    "displayName": "Đại học Bách khoa Hà Nội (BKA)",
    "region": "Hà Nội"
  },
  {
    "stt": 29,
    "code": "LDA",
    "name": "Trường Đại học Công đoàn",
    "displayName": "Trường Đại học Công đoàn (LDA)",
    "region": "Hà Nội"
  },
  {
    "stt": 30,
    "code": "GTA",
    "name": "Trường Đại học Công nghệ Giao thông vận tải",
    "displayName": "Trường Đại học Công nghệ Giao thông vận tải (GTA)",
    "region": "Hà Nội"
  },
  {
    "stt": 31,
    "code": "CCM",
    "name": "Trường Đại học Công nghiệp Dệt may Hà Nội",
    "displayName": "Trường Đại học Công nghiệp Dệt may Hà Nội (CCM)",
    "region": "Hà Nội"
  },
  {
    "stt": 32,
    "code": "DCN",
    "name": "Trường Đại học Công nghiệp Hà Nội",
    "displayName": "Trường Đại học Công nghiệp Hà Nội (DCN)",
    "region": "Hà Nội"
  },
  {
    "stt": 33,
    "code": "VHD",
    "name": "Trường Đại học Công nghiệp Việt Hung",
    "displayName": "Trường Đại học Công nghiệp Việt Hung (VHD)",
    "region": "Hà Nội"
  },
  {
    "stt": 34,
    "code": "DDN",
    "name": "Trường Đại học Đại Nam (*)",
    "displayName": "Trường Đại học Đại Nam (*) (DDN)",
    "region": "Hà Nội"
  },
  {
    "stt": 35,
    "code": "DDL",
    "name": "Trường Đại học Điện lực",
    "displayName": "Trường Đại học Điện lực (DDL)",
    "region": "Hà Nội"
  },
  {
    "stt": 36,
    "code": "DKH",
    "name": "Trường Đại học Dược Hà Nội",
    "displayName": "Trường Đại học Dược Hà Nội (DKH)",
    "region": "Hà Nội"
  },
  {
    "stt": 37,
    "code": "FPT",
    "name": "Trường Đại học FPT (*)",
    "displayName": "Trường Đại học FPT (*) (FPT)",
    "region": "Hà Nội"
  },
  {
    "stt": 38,
    "code": "GHA",
    "name": "Trường Đại học Giao thông vận tải",
    "displayName": "Trường Đại học Giao thông vận tải (GHA)",
    "region": "Hà Nội"
  },
  {
    "stt": 39,
    "code": "NHF",
    "name": "Trường Đại học Hà Nội",
    "displayName": "Trường Đại học Hà Nội (NHF)",
    "region": "Hà Nội"
  },
  {
    "stt": 40,
    "code": "ETU",
    "name": "Trường Đại học Hòa Bình (*)",
    "displayName": "Trường Đại học Hòa Bình (*) (ETU)",
    "region": "Hà Nội"
  },
  {
    "stt": 41,
    "code": "KCN",
    "name": "Trường Đại học Khoa học và Công nghệ Hà Nội",
    "displayName": "Trường Đại học Khoa học và Công nghệ Hà Nội (KCN)",
    "region": "Hà Nội"
  },
  {
    "stt": 42,
    "code": "DKS",
    "name": "Trường Đại học Kiểm sát Hà Nội",
    "displayName": "Trường Đại học Kiểm sát Hà Nội (DKS)",
    "region": "Hà Nội"
  },
  {
    "stt": 43,
    "code": "KTA",
    "name": "Trường Đại học Kiến trúc Hà Nội",
    "displayName": "Trường Đại học Kiến trúc Hà Nội (KTA)",
    "region": "Hà Nội"
  },
  {
    "stt": 44,
    "code": "DKK",
    "name": "Trường Đại học Kinh tế Kỹ thuật Công nghiệp",
    "displayName": "Trường Đại học Kinh tế Kỹ thuật Công nghiệp (DKK)",
    "region": "Hà Nội"
  },
  {
    "stt": 45,
    "code": "KHA",
    "name": "Đại học Kinh tế Quốc dân",
    "displayName": "Đại học Kinh tế Quốc dân (KHA)",
    "region": "Hà Nội"
  },
  {
    "stt": 46,
    "code": "LNH",
    "name": "Trường Đại học Lâm nghiệp",
    "displayName": "Trường Đại học Lâm nghiệp (LNH)",
    "region": "Hà Nội"
  },
  {
    "stt": 47,
    "code": "DLX",
    "name": "Trường Đại học Lao động Xã hội",
    "displayName": "Trường Đại học Lao động Xã hội (DLX)",
    "region": "Hà Nội"
  },
  {
    "stt": 48,
    "code": "LPH",
    "name": "Trường Đại học Luật Hà Nội",
    "displayName": "Trường Đại học Luật Hà Nội (LPH)",
    "region": "Hà Nội"
  },
  {
    "stt": 49,
    "code": "MDA",
    "name": "Trường Đại học Mỏ Địa chất Hà Nội",
    "displayName": "Trường Đại học Mỏ Địa chất Hà Nội (MDA)",
    "region": "Hà Nội"
  },
  {
    "stt": 50,
    "code": "MTC",
    "name": "Trường Đại học Mỹ thuật Công nghiệp",
    "displayName": "Trường Đại học Mỹ thuật Công nghiệp (MTC)",
    "region": "Hà Nội"
  },
  {
    "stt": 51,
    "code": "MTH",
    "name": "Trường Đại học Mỹ thuật Việt Nam",
    "displayName": "Trường Đại học Mỹ thuật Việt Nam (MTH)",
    "region": "Hà Nội"
  },
  {
    "stt": 52,
    "code": "NTH",
    "name": "Trường Đại học Ngoại thương",
    "displayName": "Trường Đại học Ngoại thương (NTH)",
    "region": "Hà Nội"
  },
  {
    "stt": 53,
    "code": "NTU",
    "name": "Trường Đại học Nguyễn Trãi (*)",
    "displayName": "Trường Đại học Nguyễn Trãi (*) (NTU)",
    "region": "Hà Nội"
  },
  {
    "stt": 54,
    "code": "SKD",
    "name": "Trường Đại học Sân khấu Điện ảnh",
    "displayName": "Trường Đại học Sân khấu Điện ảnh (SKD)",
    "region": "Hà Nội"
  },
  {
    "stt": 55,
    "code": "SPH",
    "name": "Trường Đại học Sư phạm Hà Nội",
    "displayName": "Trường Đại học Sư phạm Hà Nội (SPH)",
    "region": "Hà Nội"
  },
  {
    "stt": 56,
    "code": "GNT",
    "name": "Trường Đại học Sư phạm Nghệ thuật Trung ương Hà Nội",
    "displayName": "Trường Đại học Sư phạm Nghệ thuật Trung ương Hà Nội (GNT)",
    "region": "Hà Nội"
  },
  {
    "stt": 57,
    "code": "TDH",
    "name": "Trường Đại học Sư phạm Thể dục thể thao Hà nội",
    "displayName": "Trường Đại học Sư phạm Thể dục thể thao Hà nội (TDH)",
    "region": "Hà Nội"
  },
  {
    "stt": 58,
    "code": "FBU",
    "name": "Trường Đại học Tài chính Ngân hàng Hà Nội (*)",
    "displayName": "Trường Đại học Tài chính Ngân hàng Hà Nội (*) (FBU)",
    "region": "Hà Nội"
  },
  {
    "stt": 59,
    "code": "DMT",
    "name": "Trường Đại học Tài nguyên và Môi trường Hà Nội",
    "displayName": "Trường Đại học Tài nguyên và Môi trường Hà Nội (DMT)",
    "region": "Hà Nội"
  },
  {
    "stt": 60,
    "code": "DTL",
    "name": "Trường Đại học Thăng Long (*)",
    "displayName": "Trường Đại học Thăng Long (*) (DTL)",
    "region": "Hà Nội"
  },
  {
    "stt": 61,
    "code": "TDD",
    "name": "Trường Đại học Thành Đô (*)",
    "displayName": "Trường Đại học Thành Đô (*) (TDD)",
    "region": "Hà Nội"
  },
  {
    "stt": 62,
    "code": "HNM",
    "name": "Trường Đại học Thủ đô Hà Nội",
    "displayName": "Trường Đại học Thủ đô Hà Nội (HNM)",
    "region": "Hà Nội"
  },
  {
    "stt": 63,
    "code": "TMU",
    "name": "Trường Đại học Thương mại",
    "displayName": "Trường Đại học Thương mại (TMU)",
    "region": "Hà Nội"
  },
  {
    "stt": 64,
    "code": "TLA",
    "name": "Trường Đại học Thủy lợi",
    "displayName": "Trường Đại học Thủy lợi (TLA)",
    "region": "Hà Nội"
  },
  {
    "stt": 65,
    "code": "VHH",
    "name": "Trường Đại học Văn hóa Hà Nội",
    "displayName": "Trường Đại học Văn hóa Hà Nội (VHH)",
    "region": "Hà Nội"
  },
  {
    "stt": 66,
    "code": "XDA",
    "name": "Trường Đại học Xây dựng Hà Nội",
    "displayName": "Trường Đại học Xây dựng Hà Nội (XDA)",
    "region": "Hà Nội"
  },
  {
    "stt": 67,
    "code": "YHB",
    "name": "Trường Đại học Y Hà Nội",
    "displayName": "Trường Đại học Y Hà Nội (YHB)",
    "region": "Hà Nội"
  },
  {
    "stt": 68,
    "code": "YTC",
    "name": "Trường Đại học Y tế Công cộng",
    "displayName": "Trường Đại học Y tế Công cộng (YTC)",
    "region": "Hà Nội"
  },
  {
    "stt": 69,
    "code": "DCQ",
    "name": "Trường Đại học Công nghệ và Quản lý Hữu nghị (*)",
    "displayName": "Trường Đại học Công nghệ và Quản lý Hữu nghị (*) (DCQ)",
    "region": "Hà Nội"
  },
  {
    "stt": 70,
    "code": "DDU",
    "name": "Trường Đại học Đông Đô (*)",
    "displayName": "Trường Đại học Đông Đô (*) (DDU)",
    "region": "Hà Nội"
  },
  {
    "stt": 71,
    "code": "DQK",
    "name": "Trường Đại học Kinh doanh và Công nghệ Hà Nội (*)",
    "displayName": "Trường Đại học Kinh doanh và Công nghệ Hà Nội (*) (DQK)",
    "region": "Hà Nội"
  },
  {
    "stt": 72,
    "code": "DPD",
    "name": "Trường Đại học Phương Đông (*)",
    "displayName": "Trường Đại học Phương Đông (*) (DPD)",
    "region": "Hà Nội"
  },
  {
    "stt": 73,
    "code": "MHN",
    "name": "Trường Đại học Mở Hà Nội",
    "displayName": "Trường Đại học Mở Hà Nội (MHN)",
    "region": "Hà Nội"
  },
  {
    "stt": 74,
    "code": "PKA",
    "name": "Đại học Phenikaa",
    "displayName": "Đại học Phenikaa (PKA)",
    "region": "Hà Nội"
  },
  {
    "stt": 75,
    "code": "CMC",
    "name": "Trường Đại học CMC",
    "displayName": "Trường Đại học CMC (CMC)",
    "region": "Hà Nội"
  },
  {
    "stt": 76,
    "code": "VNU-HCM",
    "name": "Đại học QUỐC GIA TP.HCM",
    "displayName": "Đại học QUỐC GIA TP.HCM (VNU-HCM)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 77,
    "code": "QSY",
    "name": "Trường Đại học Sức khỏe - ĐHQG TP.HCM",
    "displayName": "Trường Đại học Sức khỏe - ĐHQG TP.HCM (QSY)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 78,
    "code": "QSB",
    "name": "Trường Đại học Bách Khoa - ĐHQG TP.HCM",
    "displayName": "Trường Đại học Bách Khoa - ĐHQG TP.HCM (QSB)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 79,
    "code": "QSC",
    "name": "Trường Đại học Công nghệ Thông tin - ĐH Quốc gia TP.HCM",
    "displayName": "Trường Đại học Công nghệ Thông tin - ĐH Quốc gia TP.HCM (QSC)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 80,
    "code": "QST",
    "name": "Trường Đại học Khoa học Tự nhiên - ĐHQG TPHCM",
    "displayName": "Trường Đại học Khoa học Tự nhiên - ĐHQG TPHCM (QST)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 81,
    "code": "QSX",
    "name": "Trường Đại học Khoa học xã hội và Nhân văn - ĐHQG TP.HCM",
    "displayName": "Trường Đại học Khoa học xã hội và Nhân văn - ĐHQG TP.HCM (QSX)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 82,
    "code": "QSQ",
    "name": "Trường Đại học Quốc tế - ĐH Quốc gia TP.HCM",
    "displayName": "Trường Đại học Quốc tế - ĐH Quốc gia TP.HCM (QSQ)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 83,
    "code": "QSK",
    "name": "Trường Đại học Kinh tế - Luật (ĐH Quốc gia TP.HCM)",
    "displayName": "Trường Đại học Kinh tế - Luật (ĐH Quốc gia TP.HCM) (QSK)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 84,
    "code": "HVC",
    "name": "Học viện Cán bộ TP.HCM",
    "displayName": "Học viện Cán bộ TP.HCM (HVC)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 85,
    "code": "BVS",
    "name": "Học viện Công nghệ Bưu chính Viễn thông – Cơ sở TP.HCM",
    "displayName": "Học viện Công nghệ Bưu chính Viễn thông – Cơ sở TP.HCM (BVS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 86,
    "code": "HHK",
    "name": "Học viện Hàng không Việt Nam",
    "displayName": "Học viện Hàng không Việt Nam (HHK)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 87,
    "code": "NVS",
    "name": "Nhạc viện TP.HCM",
    "displayName": "Nhạc viện TP.HCM (NVS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 88,
    "code": "DCT",
    "name": "Trường Đại học Công thương TP.HCM",
    "displayName": "Trường Đại học Công thương TP.HCM (DCT)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 89,
    "code": "IUH",
    "name": "Trường Đại học Công nghiệp TP.HCM",
    "displayName": "Trường Đại học Công nghiệp TP.HCM (IUH)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 90,
    "code": "GSA",
    "name": "Trường Đại học Giao thông vận tải - Cơ sở 2",
    "displayName": "Trường Đại học Giao thông vận tải - Cơ sở 2 (GSA)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 91,
    "code": "GTS",
    "name": "Trường Đại học Giao thông vận tải TP.HCM",
    "displayName": "Trường Đại học Giao thông vận tải TP.HCM (GTS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 92,
    "code": "HSU",
    "name": "Trường Đại học Hoa Sen (*)",
    "displayName": "Trường Đại học Hoa Sen (*) (HSU)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 93,
    "code": "KTS",
    "name": "Trường Đại học Kiến trúc TP.HCM",
    "displayName": "Trường Đại học Kiến trúc TP.HCM (KTS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 94,
    "code": "UEF",
    "name": "Trường Đại học Kinh tế - Tài chính TP.HCM (*)",
    "displayName": "Trường Đại học Kinh tế - Tài chính TP.HCM (*) (UEF)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 95,
    "code": "KSA",
    "name": "Đại học Kinh tế TP.HCM",
    "displayName": "Đại học Kinh tế TP.HCM (KSA)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 96,
    "code": "DLS",
    "name": "Trường Đại học Lao động Xã hội – Cơ sở TP.HCM",
    "displayName": "Trường Đại học Lao động Xã hội – Cơ sở TP.HCM (DLS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 97,
    "code": "LPS",
    "name": "Trường Đại học Luật TP.HCM",
    "displayName": "Trường Đại học Luật TP.HCM (LPS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 98,
    "code": "MBS",
    "name": "Trường Đại học Mở TP.HCM",
    "displayName": "Trường Đại học Mở TP.HCM (MBS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 99,
    "code": "MTS",
    "name": "Trường Đại học Mỹ thuật TP.HCM",
    "displayName": "Trường Đại học Mỹ thuật TP.HCM (MTS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 100,
    "code": "NHS",
    "name": "Trường Đại học Ngân hàng TP.HCM",
    "displayName": "Trường Đại học Ngân hàng TP.HCM (NHS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 101,
    "code": "NTS",
    "name": "Trường Đại học Ngoại thương – Cơ sở phía Nam",
    "displayName": "Trường Đại học Ngoại thương – Cơ sở phía Nam (NTS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 102,
    "code": "NTT",
    "name": "Trường Đại học Nguyễn Tất Thành (*)",
    "displayName": "Trường Đại học Nguyễn Tất Thành (*) (NTT)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 103,
    "code": "NLS",
    "name": "Trường Đại học Nông Lâm TP.HCM",
    "displayName": "Trường Đại học Nông Lâm TP.HCM (NLS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 104,
    "code": "HIU",
    "name": "Trường Đại học Quốc tế Hồng Bàng (*)",
    "displayName": "Trường Đại học Quốc tế Hồng Bàng (*) (HIU)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 105,
    "code": "SGD",
    "name": "Trường Đại học Sài Gòn",
    "displayName": "Trường Đại học Sài Gòn (SGD)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 106,
    "code": "DSD",
    "name": "Trường Đại học Sân khấu Điện ảnh TP.HCM",
    "displayName": "Trường Đại học Sân khấu Điện ảnh TP.HCM (DSD)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 107,
    "code": "SPK",
    "name": "Trường Đại học Sư phạm Kỹ thuật TP.HCM",
    "displayName": "Trường Đại học Sư phạm Kỹ thuật TP.HCM (SPK)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 108,
    "code": "SPS",
    "name": "Trường Đại học Sư phạm TP.HCM",
    "displayName": "Trường Đại học Sư phạm TP.HCM (SPS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 109,
    "code": "DMS",
    "name": "Trường Đại học Tài chính - Marketing",
    "displayName": "Trường Đại học Tài chính - Marketing (DMS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 110,
    "code": "DTM",
    "name": "Trường Đại học Tài nguyên và Môi trường TP.HCM",
    "displayName": "Trường Đại học Tài nguyên và Môi trường TP.HCM (DTM)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 111,
    "code": "TDS",
    "name": "Trường Đại học Thể dục Thể thao TP.HCM",
    "displayName": "Trường Đại học Thể dục Thể thao TP.HCM (TDS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 112,
    "code": "TLS",
    "name": "Trường Đại học Thủy lợi – Cơ sở 2",
    "displayName": "Trường Đại học Thủy lợi – Cơ sở 2 (TLS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 113,
    "code": "DTT",
    "name": "Trường Đại học Tôn Đức Thắng",
    "displayName": "Trường Đại học Tôn Đức Thắng (DTT)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 114,
    "code": "VHS",
    "name": "Trường Đại học Văn hóa TP.HCM",
    "displayName": "Trường Đại học Văn hóa TP.HCM (VHS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 115,
    "code": "VGU",
    "name": "Trường Đại học Việt - Đức",
    "displayName": "Trường Đại học Việt - Đức (VGU)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 116,
    "code": "YDS",
    "name": "Trường Đại học Y Dược TP.HCM",
    "displayName": "Trường Đại học Y Dược TP.HCM (YDS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 117,
    "code": "TYS",
    "name": "Trường Đại học Y khoa Phạm Ngọc Thạch",
    "displayName": "Trường Đại học Y khoa Phạm Ngọc Thạch (TYS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 118,
    "code": "DSG",
    "name": "Trường Đại học Công nghệ Sài Gòn (*)",
    "displayName": "Trường Đại học Công nghệ Sài Gòn (*) (DSG)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 119,
    "code": "GDU",
    "name": "Trường Đại học Gia Định (*)",
    "displayName": "Trường Đại học Gia Định (*) (GDU)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 120,
    "code": "DKC",
    "name": "Trường Đại học Công nghệ TP.HCM (*)",
    "displayName": "Trường Đại học Công nghệ TP.HCM (*) (DKC)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 121,
    "code": "DHV",
    "name": "Trường Đại học Hùng Vương TPHCM (*)",
    "displayName": "Trường Đại học Hùng Vương TPHCM (*) (DHV)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 122,
    "code": "SIU",
    "name": "Trường Đại học Quốc tế Sài Gòn (*)",
    "displayName": "Trường Đại học Quốc tế Sài Gòn (*) (SIU)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 123,
    "code": "DVH",
    "name": "Trường Đại học Văn Hiến (*)",
    "displayName": "Trường Đại học Văn Hiến (*) (DVH)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 124,
    "code": "DVL",
    "name": "Trường Đại học Văn Lang (*)",
    "displayName": "Trường Đại học Văn Lang (*) (DVL)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 125,
    "code": "STS",
    "name": "Trường Đại học Sư phạm TDTT TP.HCM",
    "displayName": "Trường Đại học Sư phạm TDTT TP.HCM (STS)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 126,
    "code": "DNT",
    "name": "Trường Đại học Ngoại ngữ - Tin học TP.HCM (*)",
    "displayName": "Trường Đại học Ngoại ngữ - Tin học TP.HCM (*) (DNT)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 127,
    "code": "UMT",
    "name": "Trường Đại học Quản lý và công nghệ TPHCM",
    "displayName": "Trường Đại học Quản lý và công nghệ TPHCM (UMT)",
    "region": "TP. Hồ Chí Minh"
  },
  {
    "stt": 128,
    "code": "TNU",
    "name": "Đại học Thái Nguyên",
    "displayName": "Đại học Thái Nguyên (TNU)",
    "region": "Miền Bắc"
  },
  {
    "stt": 129,
    "code": "DTF",
    "name": "Trường Ngoại ngữ (ĐH Thái Nguyên)",
    "displayName": "Trường Ngoại ngữ (ĐH Thái Nguyên) (DTF)",
    "region": "Miền Bắc"
  },
  {
    "stt": 130,
    "code": "DTQ",
    "name": "Khoa Quốc tế (ĐH Thái Nguyên)",
    "displayName": "Khoa Quốc tế (ĐH Thái Nguyên) (DTQ)",
    "region": "Miền Bắc"
  },
  {
    "stt": 131,
    "code": "DTP",
    "name": "Phân hiệu Đại học Thái Nguyên tại Lào Cai",
    "displayName": "Phân hiệu Đại học Thái Nguyên tại Lào Cai (DTP)",
    "region": "Miền Bắc"
  },
  {
    "stt": 132,
    "code": "DTC",
    "name": "Trường Đại học Công nghệ TT và Truyền thông (ĐH Thái Nguyên)",
    "displayName": "Trường Đại học Công nghệ TT và Truyền thông (ĐH Thái Nguyên) (DTC)",
    "region": "Miền Bắc"
  },
  {
    "stt": 133,
    "code": "DTZ",
    "name": "Trường Đại học Khoa học (ĐH Thái Nguyên)",
    "displayName": "Trường Đại học Khoa học (ĐH Thái Nguyên) (DTZ)",
    "region": "Miền Bắc"
  },
  {
    "stt": 134,
    "code": "DTE",
    "name": "Trường Đại học Kinh tế - Quản trị kinh doanh (ĐH Thái Nguyên)",
    "displayName": "Trường Đại học Kinh tế - Quản trị kinh doanh (ĐH Thái Nguyên) (DTE)",
    "region": "Miền Bắc"
  },
  {
    "stt": 135,
    "code": "DTK",
    "name": "Trường Đại học Kỹ thuật Công nghiệp (ĐH Thái Nguyên)",
    "displayName": "Trường Đại học Kỹ thuật Công nghiệp (ĐH Thái Nguyên) (DTK)",
    "region": "Miền Bắc"
  },
  {
    "stt": 136,
    "code": "DTN",
    "name": "Trường Đại học Nông lâm (ĐH Thái Nguyên)",
    "displayName": "Trường Đại học Nông lâm (ĐH Thái Nguyên) (DTN)",
    "region": "Miền Bắc"
  },
  {
    "stt": 137,
    "code": "DTS",
    "name": "Trường Đại học Sư phạm (ĐH Thái Nguyên)",
    "displayName": "Trường Đại học Sư phạm (ĐH Thái Nguyên) (DTS)",
    "region": "Miền Bắc"
  },
  {
    "stt": 138,
    "code": "DTY",
    "name": "Trường Đại học Y Dược (ĐH Thái Nguyên)",
    "displayName": "Trường Đại học Y Dược (ĐH Thái Nguyên) (DTY)",
    "region": "Miền Bắc"
  },
  {
    "stt": 139,
    "code": "DCA",
    "name": "Trường Đại học Chu Văn An (*)",
    "displayName": "Trường Đại học Chu Văn An (*) (DCA)",
    "region": "Miền Bắc"
  },
  {
    "stt": 140,
    "code": "DDA",
    "name": "Trường Đại học Công nghệ Đông Á (*)",
    "displayName": "Trường Đại học Công nghệ Đông Á (*) (DDA)",
    "region": "Miền Bắc"
  },
  {
    "stt": 141,
    "code": "DDM",
    "name": "Trường Đại học Công nghiệp Quảng Ninh",
    "displayName": "Trường Đại học Công nghiệp Quảng Ninh (DDM)",
    "region": "Miền Bắc"
  },
  {
    "stt": 142,
    "code": "VUI",
    "name": "Trường Đại học Công nghiệp Việt Trì",
    "displayName": "Trường Đại học Công nghiệp Việt Trì (VUI)",
    "region": "Miền Bắc"
  },
  {
    "stt": 143,
    "code": "DHP",
    "name": "Trường Đại học Quản lý và công nghệ Hải Phòng (*)",
    "displayName": "Trường Đại học Quản lý và công nghệ Hải Phòng (*) (DHP)",
    "region": "Miền Bắc"
  },
  {
    "stt": 144,
    "code": "DTV",
    "name": "Trường Đại học Lương Thế Vinh (*)",
    "displayName": "Trường Đại học Lương Thế Vinh (*) (DTV)",
    "region": "Miền Bắc"
  },
  {
    "stt": 145,
    "code": "YDD",
    "name": "Trường Đại học Điều dưỡng Nam Định",
    "displayName": "Trường Đại học Điều dưỡng Nam Định (YDD)",
    "region": "Miền Bắc"
  },
  {
    "stt": 146,
    "code": "HLU",
    "name": "Trường Đại học Hạ Long",
    "displayName": "Trường Đại học Hạ Long (HLU)",
    "region": "Miền Bắc"
  },
  {
    "stt": 147,
    "code": "DKT",
    "name": "Trường Đại học Hải Dương",
    "displayName": "Trường Đại học Hải Dương (DKT)",
    "region": "Miền Bắc"
  },
  {
    "stt": 148,
    "code": "THP",
    "name": "Trường Đại học Hải Phòng",
    "displayName": "Trường Đại học Hải Phòng (THP)",
    "region": "Miền Bắc"
  },
  {
    "stt": 149,
    "code": "HHA",
    "name": "Trường Đại học Hàng hải",
    "displayName": "Trường Đại học Hàng hải (HHA)",
    "region": "Miền Bắc"
  },
  {
    "stt": 150,
    "code": "DNB",
    "name": "Trường Đại học Hoa Lư",
    "displayName": "Trường Đại học Hoa Lư (DNB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 151,
    "code": "HDT",
    "name": "Trường Đại học Hồng Đức",
    "displayName": "Trường Đại học Hồng Đức (HDT)",
    "region": "Miền Bắc"
  },
  {
    "stt": 152,
    "code": "THV",
    "name": "Trường Đại học Hùng Vương",
    "displayName": "Trường Đại học Hùng Vương (THV)",
    "region": "Miền Bắc"
  },
  {
    "stt": 153,
    "code": "UKB",
    "name": "Trường Đại học Kinh Bắc (*)",
    "displayName": "Trường Đại học Kinh Bắc (*) (UKB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 154,
    "code": "DKY",
    "name": "Trường Đại học Kỹ thuật Y tế Hải Dương",
    "displayName": "Trường Đại học Kỹ thuật Y tế Hải Dương (DKY)",
    "region": "Miền Bắc"
  },
  {
    "stt": 155,
    "code": "DBG",
    "name": "Trường Đại học Nông Lâm Bắc Giang",
    "displayName": "Trường Đại học Nông Lâm Bắc Giang (DBG)",
    "region": "Miền Bắc"
  },
  {
    "stt": 156,
    "code": "DBH",
    "name": "Trường Đại học Quốc tế Bắc Hà (*)",
    "displayName": "Trường Đại học Quốc tế Bắc Hà (*) (DBH)",
    "region": "Miền Bắc"
  },
  {
    "stt": 157,
    "code": "SDU",
    "name": "Trường Đại học Sao Đỏ",
    "displayName": "Trường Đại học Sao Đỏ (SDU)",
    "region": "Miền Bắc"
  },
  {
    "stt": 158,
    "code": "SP2",
    "name": "Trường Đại học Sư phạm Hà Nội 2",
    "displayName": "Trường Đại học Sư phạm Hà Nội 2 (SP2)",
    "region": "Miền Bắc"
  },
  {
    "stt": 159,
    "code": "SKH",
    "name": "Trường Đại học Sư phạm Kỹ thuật Hưng Yên",
    "displayName": "Trường Đại học Sư phạm Kỹ thuật Hưng Yên (SKH)",
    "region": "Miền Bắc"
  },
  {
    "stt": 160,
    "code": "SKN",
    "name": "Trường Đại học Sư phạm Kỹ thuật Nam Định",
    "displayName": "Trường Đại học Sư phạm Kỹ thuật Nam Định (SKN)",
    "region": "Miền Bắc"
  },
  {
    "stt": 161,
    "code": "DFA",
    "name": "Trường Đại học Tài chính - Quản trị kinh doanh",
    "displayName": "Trường Đại học Tài chính - Quản trị kinh doanh (DFA)",
    "region": "Miền Bắc"
  },
  {
    "stt": 162,
    "code": "TQU",
    "name": "Trường Đại học Tân Trào",
    "displayName": "Trường Đại học Tân Trào (TQU)",
    "region": "Miền Bắc"
  },
  {
    "stt": 163,
    "code": "TTB",
    "name": "Trường Đại học Tây Bắc",
    "displayName": "Trường Đại học Tây Bắc (TTB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 164,
    "code": "DTB",
    "name": "Trường Đại học Thái Bình",
    "displayName": "Trường Đại học Thái Bình (DTB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 165,
    "code": "DDB",
    "name": "Trường Đại học Thành Đông (*)",
    "displayName": "Trường Đại học Thành Đông (*) (DDB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 166,
    "code": "TDB",
    "name": "Trường Đại học Thể dục Thể thao Bắc Ninh",
    "displayName": "Trường Đại học Thể dục Thể thao Bắc Ninh (TDB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 167,
    "code": "DVP",
    "name": "Trường Đại học Trưng Vương (*)",
    "displayName": "Trường Đại học Trưng Vương (*) (DVP)",
    "region": "Miền Bắc"
  },
  {
    "stt": 168,
    "code": "DVD",
    "name": "Trường Đại học Văn hóa Thể thao và Du lịch Thanh Hóa",
    "displayName": "Trường Đại học Văn hóa Thể thao và Du lịch Thanh Hóa (DVD)",
    "region": "Miền Bắc"
  },
  {
    "stt": 169,
    "code": "DVB",
    "name": "Trường Đại học Việt Bắc",
    "displayName": "Trường Đại học Việt Bắc (DVB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 170,
    "code": "YPB",
    "name": "Trường Đại học Y Dược Hải Phòng",
    "displayName": "Trường Đại học Y Dược Hải Phòng (YPB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 171,
    "code": "YTB",
    "name": "Trường Đại học Y Dược Thái Bình",
    "displayName": "Trường Đại học Y Dược Thái Bình (YTB)",
    "region": "Miền Bắc"
  },
  {
    "stt": 172,
    "code": "THU",
    "name": "Trường Đại học Y khoa Tokyo Việt Nam",
    "displayName": "Trường Đại học Y khoa Tokyo Việt Nam (THU)",
    "region": "Miền Bắc"
  },
  {
    "stt": 173,
    "code": "TAG",
    "name": "Đại học Cần Thơ",
    "displayName": "Đại học Cần Thơ (TAG)",
    "region": "Miền Nam"
  },
  {
    "stt": 174,
    "code": "BVU",
    "name": "Trường Đại học Bà Rịa - Vũng Tàu (*)",
    "displayName": "Trường Đại học Bà Rịa - Vũng Tàu (*) (BVU)",
    "region": "Miền Nam"
  },
  {
    "stt": 175,
    "code": "DBL",
    "name": "Trường Đại học Bạc Liêu",
    "displayName": "Trường Đại học Bạc Liêu (DBL)",
    "region": "Miền Nam"
  },
  {
    "stt": 176,
    "code": "DBD",
    "name": "Trường Đại học Bình Dương (*)",
    "displayName": "Trường Đại học Bình Dương (*) (DBD)",
    "region": "Miền Nam"
  },
  {
    "stt": 177,
    "code": "TCT",
    "name": "Trường Đại học An Giang (ĐHQG HCM)",
    "displayName": "Trường Đại học An Giang (ĐHQG HCM) (TCT)",
    "region": "Miền Nam"
  },
  {
    "stt": 178,
    "code": "DCD",
    "name": "Trường Đại học Công nghệ Đồng Nai (*)",
    "displayName": "Trường Đại học Công nghệ Đồng Nai (*) (DCD)",
    "region": "Miền Nam"
  },
  {
    "stt": 179,
    "code": "MIT",
    "name": "Trường Đại học Công nghệ Miền Đông (*)",
    "displayName": "Trường Đại học Công nghệ Miền Đông (*) (MIT)",
    "region": "Miền Nam"
  },
  {
    "stt": 180,
    "code": "DCL",
    "name": "Trường Đại học Cửu Long (*)",
    "displayName": "Trường Đại học Cửu Long (*) (DCL)",
    "region": "Miền Nam"
  },
  {
    "stt": 181,
    "code": "DLH",
    "name": "Trường Đại học Lạc Hồng (*)",
    "displayName": "Trường Đại học Lạc Hồng (*) (DLH)",
    "region": "Miền Nam"
  },
  {
    "stt": 182,
    "code": "PVU",
    "name": "Trường Đại học Dầu khí Việt Nam",
    "displayName": "Trường Đại học Dầu khí Việt Nam (PVU)",
    "region": "Miền Nam"
  },
  {
    "stt": 183,
    "code": "DNU",
    "name": "Trường Đại học Đồng Nai",
    "displayName": "Trường Đại học Đồng Nai (DNU)",
    "region": "Miền Nam"
  },
  {
    "stt": 184,
    "code": "SPD",
    "name": "Trường Đại học Đồng Tháp",
    "displayName": "Trường Đại học Đồng Tháp (SPD)",
    "region": "Miền Nam"
  },
  {
    "stt": 185,
    "code": "TKG",
    "name": "Trường Đại học Kiên Giang",
    "displayName": "Trường Đại học Kiên Giang (TKG)",
    "region": "Miền Nam"
  },
  {
    "stt": 186,
    "code": "DLA",
    "name": "Trường Đại học Kinh tế Công nghiệp Long An (*)",
    "displayName": "Trường Đại học Kinh tế Công nghiệp Long An (*) (DLA)",
    "region": "Miền Nam"
  },
  {
    "stt": 187,
    "code": "DKB",
    "name": "Trường Đại học Kinh tế Kỹ thuật Bình Dương (*)",
    "displayName": "Trường Đại học Kinh tế Kỹ thuật Bình Dương (*) (DKB)",
    "region": "Miền Nam"
  },
  {
    "stt": 188,
    "code": "KCC",
    "name": "Trường Đại học Kỹ thuật Công nghệ Cần Thơ",
    "displayName": "Trường Đại học Kỹ thuật Công nghệ Cần Thơ (KCC)",
    "region": "Miền Nam"
  },
  {
    "stt": 189,
    "code": "LNS",
    "name": "Trường Đại học Lâm nghiệp – Cơ sở 2",
    "displayName": "Trường Đại học Lâm nghiệp – Cơ sở 2 (LNS)",
    "region": "Miền Nam"
  },
  {
    "stt": 190,
    "code": "DNC",
    "name": "Trường Đại học Nam Cần Thơ (*)",
    "displayName": "Trường Đại học Nam Cần Thơ (*) (DNC)",
    "region": "Miền Nam"
  },
  {
    "stt": 191,
    "code": "EIU",
    "name": "Trường Đại học Quốc tế Miền Đông (*)",
    "displayName": "Trường Đại học Quốc tế Miền Đông (*) (EIU)",
    "region": "Miền Nam"
  },
  {
    "stt": 192,
    "code": "VLU",
    "name": "Trường Đại học Sư phạm Kỹ thuật Vĩnh Long",
    "displayName": "Trường Đại học Sư phạm Kỹ thuật Vĩnh Long (VLU)",
    "region": "Miền Nam"
  },
  {
    "stt": 193,
    "code": "TTU",
    "name": "Trường Đại học Tân Tạo (*)",
    "displayName": "Trường Đại học Tân Tạo (*) (TTU)",
    "region": "Miền Nam"
  },
  {
    "stt": 194,
    "code": "DTD",
    "name": "Trường Đại học Tây Đô (*)",
    "displayName": "Trường Đại học Tây Đô (*) (DTD)",
    "region": "Miền Nam"
  },
  {
    "stt": 195,
    "code": "TDM",
    "name": "Trường Đại học Thủ Dầu Một",
    "displayName": "Trường Đại học Thủ Dầu Một (TDM)",
    "region": "Miền Nam"
  },
  {
    "stt": 196,
    "code": "TTG",
    "name": "Trường Đại học Tiền Giang",
    "displayName": "Trường Đại học Tiền Giang (TTG)",
    "region": "Miền Nam"
  },
  {
    "stt": 197,
    "code": "DVT",
    "name": "Trường Đại học Trà Vinh",
    "displayName": "Trường Đại học Trà Vinh (DVT)",
    "region": "Miền Nam"
  },
  {
    "stt": 198,
    "code": "VGU",
    "name": "Trường Đại học Việt – Đức",
    "displayName": "Trường Đại học Việt – Đức (VGU)",
    "region": "Miền Nam"
  },
  {
    "stt": 199,
    "code": "VTT",
    "name": "Trường Đại học Võ Trường Toản (*)",
    "displayName": "Trường Đại học Võ Trường Toản (*) (VTT)",
    "region": "Miền Nam"
  },
  {
    "stt": 200,
    "code": "MTU",
    "name": "Trường Đại học Xây dựng Miền Tây",
    "displayName": "Trường Đại học Xây dựng Miền Tây (MTU)",
    "region": "Miền Nam"
  },
  {
    "stt": 201,
    "code": "YCT",
    "name": "Trường Đại học Y Dược Cần Thơ",
    "displayName": "Trường Đại học Y Dược Cần Thơ (YCT)",
    "region": "Miền Nam"
  },
  {
    "stt": 202,
    "code": "HueUni",
    "name": "Đại học HUẾ",
    "displayName": "Đại học HUẾ (HueUni)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 203,
    "code": "DHD",
    "name": "Trường Du lịch - ĐH Huế",
    "displayName": "Trường Du lịch - ĐH Huế (DHD)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 204,
    "code": "DHC",
    "name": "Khoa Giáo dục Thể chất - ĐH Huế",
    "displayName": "Khoa Giáo dục Thể chất - ĐH Huế (DHC)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 205,
    "code": "DHT",
    "name": "Trường Đại học Khoa học - ĐH Huế",
    "displayName": "Trường Đại học Khoa học - ĐH Huế (DHT)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 206,
    "code": "DHK",
    "name": "Trường Đại học Kinh tế - ĐH Huế",
    "displayName": "Trường Đại học Kinh tế - ĐH Huế (DHK)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 207,
    "code": "DHL",
    "name": "Trường Đại học Nông Lâm - ĐH Huế",
    "displayName": "Trường Đại học Nông Lâm - ĐH Huế (DHL)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 208,
    "code": "DHN",
    "name": "Trường Đại học Nghệ thuật - ĐH Huế",
    "displayName": "Trường Đại học Nghệ thuật - ĐH Huế (DHN)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 209,
    "code": "DHA",
    "name": "Trường Đại học Luật - ĐH Huế",
    "displayName": "Trường Đại học Luật - ĐH Huế (DHA)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 210,
    "code": "DHF",
    "name": "Trường Đại học Ngoại ngữ - ĐH Huế",
    "displayName": "Trường Đại học Ngoại ngữ - ĐH Huế (DHF)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 211,
    "code": "DHS",
    "name": "Trường Đại học Sư phạm - ĐH Huế",
    "displayName": "Trường Đại học Sư phạm - ĐH Huế (DHS)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 212,
    "code": "DHY",
    "name": "Trường Đại học Y Dược - ĐH Huế",
    "displayName": "Trường Đại học Y Dược - ĐH Huế (DHY)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 213,
    "code": "DHE",
    "name": "Khoa Kỹ thuật và công nghệ - ĐH Huế",
    "displayName": "Khoa Kỹ thuật và công nghệ - ĐH Huế (DHE)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 214,
    "code": "DHI",
    "name": "Khoa Quốc tế - ĐH Huế",
    "displayName": "Khoa Quốc tế - ĐH Huế (DHI)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 215,
    "code": "DHQ",
    "name": "Phân hiệu ĐH Huế tại quảng Trị",
    "displayName": "Phân hiệu ĐH Huế tại quảng Trị (DHQ)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 216,
    "code": "UDN",
    "name": "Đại học ĐÀ NẴNG",
    "displayName": "Đại học ĐÀ NẴNG (UDN)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 217,
    "code": "DDG",
    "name": "Khoa Giáo dục Thể chất – ĐH Đà Nẵng",
    "displayName": "Khoa Giáo dục Thể chất – ĐH Đà Nẵng (DDG)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 218,
    "code": "DDY",
    "name": "Khoa Y Dược – ĐH Đà Nẵng",
    "displayName": "Khoa Y Dược – ĐH Đà Nẵng (DDY)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 219,
    "code": "DDP",
    "name": "Phân hiệu Đại học Đà Nẵng tại Kon Tum",
    "displayName": "Phân hiệu Đại học Đà Nẵng tại Kon Tum (DDP)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 220,
    "code": "DDK",
    "name": "Trường Đại học Bách Khoa - ĐH Đà Nẵng",
    "displayName": "Trường Đại học Bách Khoa - ĐH Đà Nẵng (DDK)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 221,
    "code": "DDQ",
    "name": "Trường Đại học Kinh tế - ĐH Đà Nẵng",
    "displayName": "Trường Đại học Kinh tế - ĐH Đà Nẵng (DDQ)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 222,
    "code": "DDF",
    "name": "Trường Đại học Ngoại ngữ - ĐH Đà Nẵng",
    "displayName": "Trường Đại học Ngoại ngữ - ĐH Đà Nẵng (DDF)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 223,
    "code": "DDS",
    "name": "Trường Đại học Sư phạm - ĐH Đà nẵng",
    "displayName": "Trường Đại học Sư phạm - ĐH Đà nẵng (DDS)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 224,
    "code": "DSK",
    "name": "Trường Đại học Sư phạm Kỹ thuật – ĐH Đà Nẵng",
    "displayName": "Trường Đại học Sư phạm Kỹ thuật – ĐH Đà Nẵng (DSK)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 225,
    "code": "DDV",
    "name": "Viện nghiên cứu đào tạo Việt - Anh - ĐH Đà Nẵng",
    "displayName": "Viện nghiên cứu đào tạo Việt - Anh - ĐH Đà Nẵng (DDV)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 226,
    "code": "VKU",
    "name": "Khoa Công nghệ thông tin và Truyền thông – ĐH Đà Nẵng",
    "displayName": "Khoa Công nghệ thông tin và Truyền thông – ĐH Đà Nẵng (VKU)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 227,
    "code": "KTD",
    "name": "Trường Đại học Kiến trúc Đà Nẵng (*)",
    "displayName": "Trường Đại học Kiến trúc Đà Nẵng (*) (KTD)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 228,
    "code": "BMU",
    "name": "Trường Đại học Y dược Buôn Ma Thuột (*)",
    "displayName": "Trường Đại học Y dược Buôn Ma Thuột (*) (BMU)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 229,
    "code": "DVX",
    "name": "Trường Đại học Công nghệ Vạn Xuân (*)",
    "displayName": "Trường Đại học Công nghệ Vạn Xuân (*) (DVX)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 230,
    "code": "DCV",
    "name": "Trường Đại học Công nghiệp Vinh (*)",
    "displayName": "Trường Đại học Công nghiệp Vinh (*) (DCV)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 231,
    "code": "TDL",
    "name": "Trường Đại học Đà Lạt",
    "displayName": "Trường Đại học Đà Lạt (TDL)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 232,
    "code": "DDT",
    "name": "Đại học Duy Tân (*)",
    "displayName": "Đại học Duy Tân (*) (DDT)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 233,
    "code": "DPX",
    "name": "Trường Đại học Dân lập Phú Xuân (*)",
    "displayName": "Trường Đại học Dân lập Phú Xuân (*) (DPX)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 234,
    "code": "DYD",
    "name": "Trường Đại học Yersin Đà Lạt (*)",
    "displayName": "Trường Đại học Yersin Đà Lạt (*) (DYD)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 235,
    "code": "DAD",
    "name": "Trường Đại học Đông Á (*)",
    "displayName": "Trường Đại học Đông Á (*) (DAD)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 236,
    "code": "HHT",
    "name": "Trường Đại học Hà Tĩnh",
    "displayName": "Trường Đại học Hà Tĩnh (HHT)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 237,
    "code": "UKH",
    "name": "Trường Đại học Khánh Hòa",
    "displayName": "Trường Đại học Khánh Hòa (UKH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 238,
    "code": "CEA",
    "name": "Trường Đại học Kinh tế Nghệ An",
    "displayName": "Trường Đại học Kinh tế Nghệ An (CEA)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 239,
    "code": "YDN",
    "name": "Trường Đại học Kỹ thuật Y Dược Đà Nẵng",
    "displayName": "Trường Đại học Kỹ thuật Y Dược Đà Nẵng (YDN)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 240,
    "code": "HVA",
    "name": "Học viện Âm nhạc Huế",
    "displayName": "Học viện Âm nhạc Huế (HVA)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 241,
    "code": "TSN",
    "name": "Trường Đại học Nha Trang",
    "displayName": "Trường Đại học Nha Trang (TSN)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 242,
    "code": "DPQ",
    "name": "Trường Đại học Phạm Văn Đồng",
    "displayName": "Trường Đại học Phạm Văn Đồng (DPQ)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 243,
    "code": "DPC",
    "name": "Trường Đại học Phan Châu Trinh (*)",
    "displayName": "Trường Đại học Phan Châu Trinh (*) (DPC)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 244,
    "code": "DPT",
    "name": "Trường Đại học Phan Thiết (*)",
    "displayName": "Trường Đại học Phan Thiết (*) (DPT)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 245,
    "code": "DPY",
    "name": "Trường Đại học Phú Yên",
    "displayName": "Trường Đại học Phú Yên (DPY)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 246,
    "code": "DQB",
    "name": "Trường Đại học Quảng Bình",
    "displayName": "Trường Đại học Quảng Bình (DQB)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 247,
    "code": "DQU",
    "name": "Trường Đại học Quảng Nam",
    "displayName": "Trường Đại học Quảng Nam (DQU)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 248,
    "code": "DQT",
    "name": "Trường Đại học Quang Trung (*)",
    "displayName": "Trường Đại học Quang Trung (*) (DQT)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 249,
    "code": "DQN",
    "name": "Trường Đại học Quy Nhơn",
    "displayName": "Trường Đại học Quy Nhơn (DQN)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 250,
    "code": "SKV",
    "name": "Trường Đại học Sư phạm Kỹ thuật Vinh",
    "displayName": "Trường Đại học Sư phạm Kỹ thuật Vinh (SKV)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 251,
    "code": "UFA",
    "name": "Trường Đại học Tài chính Kế toán",
    "displayName": "Trường Đại học Tài chính Kế toán (UFA)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 252,
    "code": "TTN",
    "name": "Trường Đại học Tây Nguyên",
    "displayName": "Trường Đại học Tây Nguyên (TTN)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 253,
    "code": "TBD",
    "name": "Trường Đại học Thái Bình Dương (*)",
    "displayName": "Trường Đại học Thái Bình Dương (*) (TBD)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 254,
    "code": "TTD",
    "name": "Trường Đại học Thể dục Thể thao Đà Nẵng",
    "displayName": "Trường Đại học Thể dục Thể thao Đà Nẵng (TTD)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 255,
    "code": "TDV",
    "name": "Trường Đại học Vinh",
    "displayName": "Trường Đại học Vinh (TDV)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 256,
    "code": "XDT",
    "name": "Trường Đại học Xây dựng Miền Trung",
    "displayName": "Trường Đại học Xây dựng Miền Trung (XDT)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 257,
    "code": "YKV",
    "name": "Trường Đại học Y khoa Vinh",
    "displayName": "Trường Đại học Y khoa Vinh (YKV)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 258,
    "code": "BPH",
    "name": "Học viện Biên phòng",
    "displayName": "Học viện Biên phòng (BPH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 259,
    "code": "HQH",
    "name": "Học viện Hải Quân",
    "displayName": "Học viện Hải Quân (HQH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 260,
    "code": "HEH",
    "name": "Học viện Hậu cần",
    "displayName": "Học viện Hậu cần (HEH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 261,
    "code": "NQH",
    "name": "Học viện Khoa học Quân sự",
    "displayName": "Học viện Khoa học Quân sự (NQH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 262,
    "code": "KQH",
    "name": "Học viện Kỹ thuật Quân sự",
    "displayName": "Học viện Kỹ thuật Quân sự (KQH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 263,
    "code": "PKH",
    "name": "Học viện Phòng không - Không quân",
    "displayName": "Học viện Phòng không - Không quân (PKH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 264,
    "code": "YQH",
    "name": "Học viện Quân Y",
    "displayName": "Học viện Quân Y (YQH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 265,
    "code": "LCH",
    "name": "Trường Đại học Chính trị (Trường SĨ QUAN Chính trị)",
    "displayName": "Trường Đại học Chính trị (Trường SĨ QUAN Chính trị) (LCH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 266,
    "code": "ZNH",
    "name": "Trường Đại học Văn hóa - Nghệ thuật Quân đội",
    "displayName": "Trường Đại học Văn hóa - Nghệ thuật Quân đội (ZNH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 267,
    "code": "SNH",
    "name": "Trường SĨ QUAN Công binh",
    "displayName": "Trường SĨ QUAN Công binh (SNH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 268,
    "code": "DCH",
    "name": "Trường SĨ QUAN Đặc công",
    "displayName": "Trường SĨ QUAN Đặc công (DCH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 269,
    "code": "KGH",
    "name": "Trường SĨ QUAN không quân",
    "displayName": "Trường SĨ QUAN không quân (KGH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 270,
    "code": "VPH",
    "name": "Trường SĨ QUAN Kỹ thuật QS Vinhempich (ĐH Trần Đại Nghĩa)",
    "displayName": "Trường SĨ QUAN Kỹ thuật QS Vinhempich (ĐH Trần Đại Nghĩa) (VPH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 271,
    "code": "LAH",
    "name": "Trường SĨ QUAN Lục quân 1 (ĐH Trần Quốc Tuấn)",
    "displayName": "Trường SĨ QUAN Lục quân 1 (ĐH Trần Quốc Tuấn) (LAH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 272,
    "code": "LBH",
    "name": "Trường SĨ QUAN Lục quân 2 (ĐH Nguyễn Huệ)",
    "displayName": "Trường SĨ QUAN Lục quân 2 (ĐH Nguyễn Huệ) (LBH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 273,
    "code": "PBH",
    "name": "Trường SĨ QUAN Pháo binh",
    "displayName": "Trường SĨ QUAN Pháo binh (PBH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 274,
    "code": "HGH",
    "name": "Trường SĨ QUAN Phòng Hóa",
    "displayName": "Trường SĨ QUAN Phòng Hóa (HGH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 275,
    "code": "TGH",
    "name": "Trường SĨ QUAN Tăng - Thiết giáp",
    "displayName": "Trường SĨ QUAN Tăng - Thiết giáp (TGH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 276,
    "code": "TTH",
    "name": "Trường SĨ QUAN Thông tin",
    "displayName": "Trường SĨ QUAN Thông tin (TTH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 277,
    "code": "ANH",
    "name": "Học viện An ninh Nhân dân",
    "displayName": "Học viện An ninh Nhân dân (ANH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 278,
    "code": "CSH",
    "name": "Học viện Cảnh sát Nhân dân",
    "displayName": "Học viện Cảnh sát Nhân dân (CSH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 279,
    "code": "HCA",
    "name": "Học viện Chính trị Công an Nhân dân",
    "displayName": "Học viện Chính trị Công an Nhân dân (HCA)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 280,
    "code": "ANS",
    "name": "Trường Đại học An ninh nhân dân",
    "displayName": "Trường Đại học An ninh nhân dân (ANS)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 281,
    "code": "CSS",
    "name": "Trường Đại học Cảnh sát nhân dân",
    "displayName": "Trường Đại học Cảnh sát nhân dân (CSS)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 282,
    "code": "HCB",
    "name": "Trường Đại học Kỹ thuật - Hậu cần Công an nhân dân phía Bắc",
    "displayName": "Trường Đại học Kỹ thuật - Hậu cần Công an nhân dân phía Bắc (HCB)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 283,
    "code": "HCN",
    "name": "Trường Đại học Kỹ thuật - Hậu cần Công an nhân dân phía Nam",
    "displayName": "Trường Đại học Kỹ thuật - Hậu cần Công an nhân dân phía Nam (HCN)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 284,
    "code": "PCH",
    "name": "Trường Đại học Phòng cháy chữa cháy phía Bắc",
    "displayName": "Trường Đại học Phòng cháy chữa cháy phía Bắc (PCH)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 285,
    "code": "PCS",
    "name": "Trường Đại học Phòng cháy chữa cháy phía Nam",
    "displayName": "Trường Đại học Phòng cháy chữa cháy phía Nam (PCS)",
    "region": "Miền Trung & Tây Nguyên"
  },
  {
    "stt": 286,
    "code": "VinUni",
    "name": "Đại học VinUniversity",
    "displayName": "Đại học VinUniversity (VinUni)",
    "region": "Quốc tế tại VN"
  },
  {
    "stt": 287,
    "code": "BUV",
    "name": "British University Vietnam",
    "displayName": "British University Vietnam (BUV)",
    "region": "Quốc tế tại VN"
  },
  {
    "stt": 288,
    "code": "RMIT",
    "name": "Đại học Quốc Tế RMIT Việt Nam",
    "displayName": "Đại học Quốc Tế RMIT Việt Nam (RMIT)",
    "region": "Quốc tế tại VN"
  },
  {
    "stt": 289,
    "code": "FPT",
    "name": "Đại học FPT",
    "displayName": "Đại học FPT (FPT)",
    "region": "Hà Nội / TPHCM"
  },
  {
    "stt": 290,
    "code": "BK-THAI",
    "name": "Bangkok University",
    "displayName": "Bangkok University (Thái Lan)",
    "region": "Du học"
  },
  {
    "stt": 291,
    "code": "CHULA",
    "name": "Chulalongkorn University",
    "displayName": "Chulalongkorn University (Thái Lan)",
    "region": "Du học"
  },
  {
    "stt": 292,
    "code": "NUS",
    "name": "National University of Singapore",
    "displayName": "National University of Singapore (NUS)",
    "region": "Du học"
  },
  {
    "stt": 293,
    "code": "HARVARD",
    "name": "Harvard University",
    "displayName": "Harvard University (Hoa Kỳ)",
    "region": "Du học"
  },
  {
    "stt": 294,
    "code": "MELBOURNE",
    "name": "University of Melbourne",
    "displayName": "University of Melbourne (Úc)",
    "region": "Du học"
  }
];

    window.AURA_UNIVERSITIES = UNIVERSITIES;

    window.AURA_UNIVERSITY_REGIONS = [
        'Tất cả',
        'TP. Hồ Chí Minh',
        'Hà Nội',
        'Miền Bắc',
        'Miền Trung & Tây Nguyên',
        'Miền Nam',
        'Quốc tế tại VN',
        'Du học'
    ];

    // Hàm tìm kiếm trường đại học thông minh (tìm theo Tên, Mã trường, Khu vực)
    window.searchAuraUniversities = function(query, region) {
        if (!query && (!region || region === 'Tất cả')) return UNIVERSITIES;
        const q = (query || '').toLowerCase().trim();
        const r = (region && region !== 'Tất cả') ? region : null;

        return UNIVERSITIES.filter(u => {
            if (r && u.region !== r) return false;
            if (!q) return true;
            return (
                u.name.toLowerCase().includes(q) ||
                u.code.toLowerCase().includes(q) ||
                u.displayName.toLowerCase().includes(q)
            );
        });
    };

    // Hàm tự động nạp toàn bộ danh sách vào thẻ <datalist>
    window.populateUniversityDatalist = function(datalistId) {
        const dl = document.getElementById(datalistId);
        if (!dl) return;
        dl.innerHTML = UNIVERSITIES.map(u => 
            `<option value="${u.displayName}">[${u.region}] ${u.code}</option>`
        ).join('');
    };

    window.currentUniFilterRegion = 'Tất cả';
    window.filterUniversityRegion = function(region, btnElement) {
        window.currentUniFilterRegion = region;
        const dl = document.getElementById('list-partner-universities');
        if (dl) {
            let list = UNIVERSITIES;
            if (!region || region === 'Tất cả') {
                list = UNIVERSITIES;
            } else if (region === 'TP.HCM' || region === 'TP. Hồ Chí Minh' || region === 'TPHCM') {
                list = UNIVERSITIES.filter(u => u.region === 'TP. Hồ Chí Minh' || u.region.includes('TP'));
            } else if (region === 'Hà Nội') {
                list = UNIVERSITIES.filter(u => u.region === 'Hà Nội' || u.region.includes('Hà Nội'));
            } else if (region === 'Miền Bắc') {
                list = UNIVERSITIES.filter(u => u.region === 'Miền Bắc');
            } else if (region === 'Miền Trung' || region === 'Miền Trung & Tây Nguyên') {
                list = UNIVERSITIES.filter(u => u.region === 'Miền Trung & Tây Nguyên' || u.region.includes('Miền Trung'));
            } else if (region === 'Miền Nam') {
                list = UNIVERSITIES.filter(u => u.region === 'Miền Nam');
            } else if (region === 'Quốc tế' || region === 'Quốc tế / Du học' || region === 'Du học') {
                list = UNIVERSITIES.filter(u => u.region.includes('Quốc tế') || u.region.includes('Du học'));
            } else {
                list = UNIVERSITIES.filter(u => u.region === region);
            }
            dl.innerHTML = list.map(u => `<option value="${u.displayName}">[${u.region}] ${u.code}</option>`).join('');
        }
        // Update chip active classes
        document.querySelectorAll('.uni-region-chip').forEach(btn => {
            btn.classList.remove('bg-cerulean', 'text-white', 'font-bold', 'border-cerulean');
            btn.classList.add('bg-stone-100', 'text-ink-light', 'border-stone-200/80');
        });
        if (btnElement) {
            btnElement.classList.remove('bg-stone-100', 'text-ink-light', 'border-stone-200/80');
            btnElement.classList.add('bg-cerulean', 'text-white', 'font-bold', 'border-cerulean');
        }
        const uniInput = document.getElementById('input-partner-university');
        if (uniInput) {
            uniInput.placeholder = (!region || region === 'Tất cả') 
                ? 'Gõ tìm hoặc chọn trong 285+ trường (VD: UEH, BKA, NEU, FTU...)' 
                : `Chọn trường khu vực ${region}...`;
            uniInput.focus();
        }
    };

    window.AURA_UNIVERSITIES = UNIVERSITIES;

    // Tự động khởi chạy khi DOM sẵn sàng
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.populateUniversityDatalist('list-partner-universities');
            });
        } else {
            window.populateUniversityDatalist('list-partner-universities');
        }
    }
})();
