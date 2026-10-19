import fitz
import json
import re

doc = fitz.open('Danh sách các trường đại học ở VN.pdf')
current_region = 'KHU VỰC HÀ NỘI'
unis = []

region_map = {
    'KHU VỰC HÀ NỘI': 'Hà Nội',
    'KHU VỰC TPHCM': 'TP. Hồ Chí Minh',
    'KHU VỰC CÁC TỈNH, THÀNH MIỀN BẮC': 'Miền Bắc',
    'KHU VỰC MIỀN TRUNG VÀ CAO NGUYÊN TRUNG BỘ': 'Miền Trung & Tây Nguyên',
    'KHU VỰC CÁC TỈNH, THÀNH MIỀN NAM': 'Miền Nam'
}

def clean_title(name):
    name = re.sub(r'\bĐẠI HỌC\b', 'Đại học', name)
    name = re.sub(r'\bHỌC VIỆN\b', 'Học viện', name)
    name = re.sub(r'\bKHOA\b', 'Khoa', name)
    name = re.sub(r'\bTRƯỜNG\b', 'Trường', name)
    name = re.sub(r'\bTP\.HCM\b', 'TP.HCM', name)
    return ' '.join(name.split())

for page in doc:
    tabs = page.find_tables()
    for tab in tabs:
        rows = tab.extract()
        for r in rows:
            if not r or len(r) < 3:
                continue
            col0, col1, col2 = r[0], r[1], r[2]
            if col0 and 'KHU VỰC' in str(col0):
                current_region = str(col0).strip()
                continue
            if col0 and str(col0).strip().upper() == 'STT':
                continue
            if col0 and str(col0).strip().isdigit() and col2:
                stt = int(str(col0).strip())
                code = str(col1).strip() if col1 else ''
                raw_name = str(col2).replace('\n', ' ').strip()
                name = clean_title(raw_name)
                reg = region_map.get(current_region, current_region)
                
                display = f"{name} ({code})" if code else name
                
                unis.append({
                    'stt': stt,
                    'code': code,
                    'name': name,
                    'displayName': display,
                    'region': reg
                })

print(f"Total extracted: {len(unis)}")

# Also add popular international universities as a separate global category
international_unis = [
    {"stt": 286, "code": "VinUni", "name": "Đại học VinUniversity", "displayName": "Đại học VinUniversity (VinUni)", "region": "Quốc tế tại VN"},
    {"stt": 287, "code": "BUV", "name": "British University Vietnam", "displayName": "British University Vietnam (BUV)", "region": "Quốc tế tại VN"},
    {"stt": 288, "code": "RMIT", "name": "Đại học Quốc Tế RMIT Việt Nam", "displayName": "Đại học Quốc Tế RMIT Việt Nam (RMIT)", "region": "Quốc tế tại VN"},
    {"stt": 289, "code": "FPT", "name": "Đại học FPT", "displayName": "Đại học FPT (FPT)", "region": "Hà Nội / TPHCM"},
    {"stt": 290, "code": "BK-THAI", "name": "Bangkok University", "displayName": "Bangkok University (Thái Lan)", "region": "Du học"},
    {"stt": 291, "code": "CHULA", "name": "Chulalongkorn University", "displayName": "Chulalongkorn University (Thái Lan)", "region": "Du học"},
    {"stt": 292, "code": "NUS", "name": "National University of Singapore", "displayName": "National University of Singapore (NUS)", "region": "Du học"},
    {"stt": 293, "code": "HARVARD", "name": "Harvard University", "displayName": "Harvard University (Hoa Kỳ)", "region": "Du học"},
    {"stt": 294, "code": "MELBOURNE", "name": "University of Melbourne", "displayName": "University of Melbourne (Úc)", "region": "Du học"},
]

# Avoid duplicates if RMIT/FPT or VinUni already exist
existing_names = {u['name'].lower() for u in unis}
for iu in international_unis:
    if iu['name'].lower() not in existing_names:
        unis.append(iu)

# Generate universities.js
js_code = "/**\n * AURA SYSTEM — DANH SÁCH 285+ TRƯỜNG ĐẠI HỌC & HỌC VIỆN VIỆT NAM\n * Trích xuất từ tệp chính thức: 'Danh sách các trường đại học ở VN.pdf'\n */\n"
js_code += "(function() {\n"
js_code += "    const UNIVERSITIES = " + json.dumps(unis, ensure_ascii=False, indent=2) + ";\n\n"
js_code += """    window.AURA_UNIVERSITIES = UNIVERSITIES;

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

    // Tự động khởi chạy khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.populateUniversityDatalist('list-partner-universities');
        });
    } else {
        window.populateUniversityDatalist('list-partner-universities');
    }
})();
"""

with open('universities.js', 'w', encoding='utf-8') as f:
    f.write(js_code)
print("Saved to universities.js successfully! Total items:", len(unis))
