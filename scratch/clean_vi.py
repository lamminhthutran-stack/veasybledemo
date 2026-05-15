import os
import re
import glob

# 1. Clean up `false ? "Vi" : "En"` in files
files = glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.ts", recursive=True)

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()
    
    original_content = content
    
    # regex to match `false ? "vi string" : "en string"` -> `"en string"`
    # Note: sometimes it's inside {}, sometimes it's not.
    # {false ? "VI" : "EN"} -> {"EN"} -> "EN"
    content = re.sub(r'\{\s*false\s*\?\s*["\'][^"\']*["\']\s*:\s*(["\'][^"\']*["\'])\s*\}', r'\1', content)
    content = re.sub(r'false\s*\?\s*["\'][^"\']*["\']\s*:\s*(["\'][^"\']*["\'])', r'\1', content)

    # Some variables like `{"Find policies & SOPs" ?? "Tìm policy & SOP"}`
    content = re.sub(r'\{\s*(["\'][^"\']*["\'])\s*\?\?\s*["\'][^"\']*["\']\s*\}', r'\1', content)
    content = re.sub(r'(["\'][^"\']*["\'])\s*\?\?\s*["\'][^"\']*["\']', r'\1', content)

    # Specific replacements
    content = content.replace("Nguyễn Minh Khoa", "John Doe")
    content = content.replace("Không có công việc nào đang duyệt.", "No tasks currently in review.")
    content = content.replace("Lý do từ chối:", "Rejection reason:")
    content = content.replace("Cần cập nhật lại hình ảnh PoP rõ nét hơn.", "Need to update with clearer PoP image.")
    content = content.replace('245 Nguyễn Trãi, Quận 5', '123 Main St, District 5')
    content = content.replace('Hồ Chí Minh', 'Ho Chi Minh City')
    content = content.replace('Hà Nội', 'Hanoi')
    content = content.replace('Đà Nẵng', 'Da Nang')
    content = content.replace('Cần Thơ', 'Can Tho')
    content = content.replace('Quận 1', 'District 1')
    content = content.replace('Quận 3', 'District 3')
    content = content.replace('Quận 5', 'District 5')
    content = content.replace('Quận 7', 'District 7')
    content = content.replace('Quận 10', 'District 10')
    content = content.replace('Bình Thạnh', 'Binh Thanh')
    content = content.replace('Phú Nhuận', 'Phu Nhuan')
    content = content.replace('Tân Bình', 'Tan Binh')
    content = content.replace('Hoàn Kiếm', 'Hoan Kiem')
    content = content.replace('Ba Đình', 'Ba Dinh')
    content = content.replace('Đống Đa', 'Dong Da')
    content = content.replace('Hai Bà Trưng', 'Hai Ba Trung')
    content = content.replace('Cầu Giấy', 'Cau Giay')
    content = content.replace('Hải Châu', 'Hai Chau')
    content = content.replace('Thanh Khê', 'Thanh Khe')
    content = content.replace('Sơn Trà', 'Son Tra')
    content = content.replace('Ninh Kiều', 'Ninh Kieu')
    content = content.replace('Bình Thủy', 'Binh Thuy')
    content = content.replace('Sáng', 'Morning')
    content = content.replace('Chiều', 'Afternoon')
    content = content.replace('Tối', 'Evening')

    if content != original_content:
        with open(file_path, "w") as f:
            f.write(content)
        print(f"Cleaned {file_path}")

print("Done cleaning remaining vi strings.")
