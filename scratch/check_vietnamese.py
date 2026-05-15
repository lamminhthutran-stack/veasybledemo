import glob
import re

files = glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.ts", recursive=True)
vietnamese_chars = set("áàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵđĐÁÀẢÃẠẤẦẨẪẬẮẰẲẴẶÉÈẺẼẸẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴ")

found_files = []
for f in files:
    with open(f, "r") as file:
        content = file.read()
        for char in content:
            if char in vietnamese_chars:
                found_files.append(f)
                break

if found_files:
    print("Found Vietnamese characters in:")
    for f in found_files:
        print(f)
else:
    print("No Vietnamese characters found!")
