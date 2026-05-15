import os

with open("src/lib/mock-data.ts", "r") as f:
    content = f.read()

replacements = {
    "Linh Trần": "Linda Tran",
    "Nguyễn Trãi": "Nguyen Trai",
    "Lê Lợi": "Le Loi",
    "Phạm Ngũ Lão": "Pham Ngu Lao",
    "Thủ Đức": "Thu Duc",
    "Gò Vấp": "Go Vap",
    "Trần Văn Bảo": "Thomas Bao",
    "Tết": "Lunar New Year",
    "Phạm Thị Hương": "Patricia Huong",
    "Lê Quang Huy": "Leon Huy",
    "Trần Mỹ Linh": "Mandy Linh",
    "Nguyễn Minh Tuấn": "Michael Tuan",
    "Đúng giờ check-in": "On-time check-in",
    "Chất lượng PoP": "PoP Quality",
    "Thực hiện đúng SOP": "Follows SOP strictly",
    "Thái độ & giao tiếp": "Attitude & Communication",
    "Xử lý sự cố": "Issue Resolution",
    "Executor đến đúng giờ, chụp ảnh sản phẩm đẹp và rõ ràng. Rất chuyên nghiệp.": "Executor arrived on time, took clear and beautiful product photos. Very professional.",
    "Placement đúng theo planogram, ảnh đủ góc. Tuy nhiên selfie check-in hơi mờ.": "Placement matches planogram, photos cover all angles. However, check-in selfie is slightly blurry.",
    "Executor thực hiện đúng planogram, ảnh chất lượng tốt. Rất đáng tin cậy.": "Executor followed planogram perfectly, good quality photos. Very reliable.",
    "Đến đúng giờ nhưng cần hỏi thêm về vị trí đặt hàng. Không có vấn đề lớn.": "Arrived on time but had to ask about placement location. No major issues.",
    "Thiếu 1 góc chụp trong bộ PoP, phải nhắc lại. Cần cải thiện độ chủ động.": "Missed 1 photo angle in the PoP set, had to remind them. Needs to improve proactiveness.",
    "Đỗ Văn Sơn": "David Son",
    "Bùi Thanh Hà": "Bella Ha",
    "Nhận trước ngày thực hiện ít nhất 1 ngày.": "Pick up at least 1 day before execution.",
    "Chụp ảnh kệ TRƯỚC khi setup": "Take photo of shelf BEFORE setup",
    "Setup theo planogram đính kèm": "Setup according to attached planogram",
    "Chụp ảnh kệ SAU khi setup — đủ 4 góc": "Take photo of shelf AFTER setup — all 4 angles",
    "Selfie tại store với đồng phục": "Selfie at store in uniform"
}

for vi, en in replacements.items():
    content = content.replace(vi, en)

with open("src/lib/mock-data.ts", "w") as f:
    f.write(content)

print("Translated mock-data.ts")
