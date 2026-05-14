import os
import re

files = [
  "src/routes/executor.knowledge.tsx",
  "src/routes/executor.task.$id.index.tsx",
  "src/routes/ops.dashboard.tsx",
  "src/routes/ops.escalations.tsx",
  "src/routes/ops.executors.index.tsx",
  "src/routes/ops.executors.$id.tsx"
]

replacements = {
  '"Tìm policy & SOP" : "Find policies & SOPs"': 't("sml_subtitle")',
  '"Tìm kiếm policy, SOP..." : "Search policies, SOPs..."': 't("sml_search_placeholder")',
  '"Chủ đề phổ biến" : "Popular topics"': 't("popular_topics")',
  '"kết quả" : "results"': 't("sml_results")',
  '"Hỏi AI thêm →" : "Ask AI →"': 't("ask_ai")',
  '"Hỏi AI →" : "Ask AI →"': 't("ask_ai")',
  '"Vẫn chưa rõ? Hỏi Ops team →" : "Still unclear? Ask Ops team →"': 't("ask_ops")',
  '"Gửi đến Ops team" : "Send to Ops team"': 't("send_to_ops")',
  '"Đã gửi đến Ops team" : "Sent to Ops team"': 't("ops_sent")',
  '"Ops sẽ phản hồi trong vòng 1 ngày làm việc." : "Ops will respond within 1 business day."': 't("ops_sent_sub")',
  '"Thêm thông tự (không bắt buộc)" : "Additional context (optional)"': 't("additional_context")',
  '"Mô tả tình huống cụ thể..." : "Describe your specific situation..."': 't("describe_situation")',
  '"Quay lại kết quả" : "Back to results"': 't("back_to_results")',
  '"Quay lại" : "Back"': 't("back")',

  '"Thông tin chiến dịch" : "Campaign Info"': 't("campaign_info")',
  '"Thương hiệu" : "Brand"': 't("brand")',
  '"Ngày thực hiện" : "Date"': 't("date")',
  '"Giờ bắt đầu" : "Start time"': 't("start_time")',
  '"Thu nhập" : "Pay"': 't("pay")',
  '"Địa điểm" : "Location"': 't("location")',
  '"Cửa hàng" : "Store"': 't("store")',
  '"Địa chỉ" : "Address"': 't("address")',
  '"Khu vực" : "District"': 't("district")',
  '"Trạm in ấn" : "Print Station"': 't("print_station")',
  '"Ngày nhận tài liệu" : "Materials pickup date"': 't("pickup_date")',
  '"Địa chỉ trạm in" : "Print station address"': 't("print_address")',
  '"Tài liệu cần nhận" : "Materials to collect"': 't("materials")',
  '"Yêu cầu thực hiện" : "Execution Requirements"': 't("execution_req")',
  '"Bắt đầu thực hiện hôm nay" : "Start Day-of Flow"': 't("start_day_of")',

  '"Hàng đợi xử lý" : "Escalation Queue"': 't("escalation_queue")',
  '"Cần xử lý" : "Open"': 't("open_cases")',
  '"Đã xử lý" : "Resolved"': 't("resolved_cases")',
  '"Tất cả" : "All"': 't("all")',
  '"Cao" : "High"': 't("severity_high")',
  '"Trung bình" : "Med"': 't("severity_med")',
  '"Thấp" : "Low"': 't("severity_low")',

  '"Feedback từ Brand & Retailer" : "Brand & Retailer Feedback"': 't("partner_feedback")',
  '"đánh giá" : "reviews"': 't("reviews")',
  '"Đủ executor" : "Sufficient"': 't("sufficient")',
  '"Cần thêm" : "Needs more"': 't("needs_more")',
  '"Thiếu executor" : "Shortage"': 't("shortage")',
}

for file_path in files:
  if not os.path.exists(file_path):
    print(f"Skipping {file_path}")
    continue
  with open(file_path, "r") as f:
    content = f.read()

  if 'useTranslation' not in content:
    content = content.replace('import { useLang', 'import { useTranslation } from "react-i18next";\nimport { useLang')

  # Insert const { t } = useTranslation(); after const { lang } = useLang();
  if 'const { t } = useTranslation();' not in content:
    content = content.replace('const { lang } = useLang();', 'const { lang } = useLang();\n  const { t } = useTranslation();')

  # Also replace useLang() if no {lang} is needed, but just let it be.

  # Replace texts
  for old, new_key in replacements.items():
      # Matches {lang === "vi" ? "text1" : "text2"} or {lang === 'vi' ? 'text1' : 'text2'}
      # But sometimes it spans lines, let's just do regex
      pattern = r'\{lang\s*===\s*"vi"\s*\?\s*' + old.replace(' : ', r'\s*:\s*') + r'\}'
      content = re.sub(pattern, f'{{{new_key}}}', content)
      
      # Also inside strings: `lang === "vi" ? "A" : "B"`
      pattern2 = r'lang\s*===\s*"vi"\s*\?\s*' + old.replace(' : ', r'\s*:\s*')
      content = re.sub(pattern2, new_key, content)

  # Check buttons for rounded-full -> rounded-[5px]
  content = re.sub(r'bg-\[\#1A3557\] text-white text-sm font-semibold p[x|y]-\d+\s*rounded-full', lambda m: m.group(0).replace('rounded-full', 'rounded-[5px]'), content)
  content = re.sub(r'bg-white text-gray-600 text-xs font-semibold py-2 rounded-full', lambda m: m.group(0).replace('rounded-full', 'rounded-[5px]'), content)
  
  with open(file_path, "w") as f:
    f.write(content)
  print(f"Processed {file_path}")

