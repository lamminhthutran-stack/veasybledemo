import re

def replace_in_file(file_path, old, new):
    with open(file_path, "r") as f:
        content = f.read()
    content = content.replace(old, new)
    with open(file_path, "w") as f:
        f.write(content)

replace_in_file("src/routes/executor.home.tsx", "{/* Card Thu nhập */}", "{/* Earnings Card */}")
replace_in_file("src/routes/executor.home.tsx", "{/* spacer để căn đều chiều cao */}", "{/* spacer for even height */}")

replace_in_file("src/routes/executor.knowledge.tsx", "// ── Knowledge base tĩnh", "// ── Static Knowledge Base")
replace_in_file("src/routes/executor.knowledge.tsx", '["check-in", "trễ", "late", "muộn", "penalty"]', '["check-in", "late", "penalty"]')
replace_in_file("src/routes/executor.knowledge.tsx", '["cửa hàng", "từ chối", "store", "refuse", "entry", "vào", "dispute"]', '["store", "refuse", "entry", "dispute"]')
replace_in_file("src/routes/executor.knowledge.tsx", '["pop", "proof", "photo", "ảnh", "chụp", "placement", "mờ", "blurry"]', '["pop", "proof", "photo", "placement", "blurry"]')
replace_in_file("src/routes/executor.knowledge.tsx", '["rating", "điểm", "score", "đánh giá", "healthy", "warning", "suspended"]', '["rating", "score", "healthy", "warning", "suspended"]')
replace_in_file("src/routes/executor.knowledge.tsx", '["print", "in", "tài liệu", "material", "station", "trạm", "nhận", "pickup", "lỗi", "defective"]', '["print", "material", "station", "pickup", "defective"]')
replace_in_file("src/routes/executor.knowledge.tsx", '{false ? `Không tìm thấy kết quả cho "${query}"` : `No results for "${query}"`}', '{`No results for "${query}"`}')

replace_in_file("src/lib/academy-data.ts", "PoP là viết tắt của?", "What does PoP stand for?")
replace_in_file("src/lib/academy-data.ts", "It's fine cả", "Nothing happens")

print("Done cleaning final strings")
