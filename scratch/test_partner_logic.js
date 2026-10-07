// Validate Partner JS block logic
function calculateAge(dobStr) {
    if (!dobStr) return '';
    const birthDate = new Date(dobStr);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age > 0 ? `${age} tuổi` : '';
}

const mockPartner = {
    name: "Quốc Bảo",
    avatar: "https://example.com/avatar.jpg",
    relation: "Bạn trai (Boyfriend)",
    dob: "1998-05-14",
    phone: "0908 123 456",
    permanentAddr: "Quận 1, TP. HCM",
    temporaryAddr: "Thảo Điền, TP. Thủ Đức",
    prepStatus: "PrEP hàng ngày (Daily PrEP)",
    stds: "08/2026 (HIV/STDs Âm tính)",
    role: "Versatile (Linh hoạt)",
    gallery: [
        { url: "https://example.com/img1.jpg", type: "image", caption: "Ảnh 1" },
        { url: "https://example.com/vid1.mp4", type: "video", caption: "Video 1" }
    ]
};

console.log('Age test:', calculateAge(mockPartner.dob));
console.log('Initials:', mockPartner.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase());
console.log('Partner JS test passed!');
