import os
import glob

files = glob.glob("src/**/*.tsx", recursive=True) + glob.glob("src/**/*.ts", recursive=True)

replacements = {
    # format.ts
    '// 3,200,000 → "3.2M"  (giả định VND, hiển thị M cho gọn)': '// 3,200,000 → "3.2M"  (VND assumption, using M for brevity)',
    # executor.home.tsx
    'toLocaleString()}đ': 'toLocaleString()} VND',
    'label: "Đã nhận"': 'label: "Accepted"',
    'label: "Đang làm"': 'label: "In Progress"',
    'label: "Đã nộp"': 'label: "Submitted"',
    '<!-- spacer để căn đều chiều cao -->': '{/* spacer for even height */}',
    # login.tsx
    'Linh Trần': 'Linda Tran',
    # ops.submissions.tsx
    'Không có kết quả nào cần duyệt.': 'No results to review.',
    'Huỷ': 'Cancel',
    'Xác nhận yêu cầu': 'Confirm request',
    # ops.dashboard.tsx
    'Trần Thị Lan': 'Tracy Lan',
    'Phạm Thu Hương': 'Patricia Huong',
    'Hoàng Thanh Sơn': 'Henry Son',
    # executor.tasks.tsx
    'toLocaleString()}đ': 'toLocaleString()} VND',
    '300,000đ': '300,000 VND',
    # executor.profile.index.tsx
    'Lịch sử': 'History',
    'Đã từ chối': 'Rejected',
}

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()

    for vi, en in replacements.items():
        content = content.replace(vi, en)

    with open(file_path, "w") as f:
        f.write(content)

print("Done translating remaining strings.")
