const fs = require('fs');

const path = 'src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const viKeys = `
      // Additional
      "executor_portal": "Executor Portal",
      "tbd": "Chưa xác định",
      "no_reqs": "Không có yêu cầu cụ thể.",
      "profile_setup": "Thiết lập Profile",
      "step_academy": "Academy",
      "step_profile": "Profile",
      "step_done": "Hoàn tất",
      "setup_profile_title": "Thiết lập Profile của bạn",
      "setup_profile_subtitle": "Chỉ còn một bước nữa để bắt đầu nhận task!",
      "personal_info": "Thông tin cá nhân",
      "upload_photo": "Tải ảnh lên",
      "full_name": "Họ và tên",
      "operation_area": "Khu vực hoạt động",
      "city": "Thành phố",
      "district_label": "Quận / Huyện",
      "work_schedule": "Lịch làm việc",
      "schedule_hint": "Chọn càng nhiều khung giờ, bạn càng được ưu tiên nhận task tốt hơn!",
      "finish_and_pool": "Hoàn tất & Vào Pool →",
      "nav_dashboard": "Dashboard",
      "nav_escalations": "Hàng đợi xử lý",
      "nav_campaigns": "Chiến dịch",
      "nav_execution": "Theo dõi thực thi",
      "nav_executors": "Mạng lưới Executor",
      "ops_portal": "Ops Portal",
`;

const enKeys = `
      // Additional
      "executor_portal": "Executor Portal",
      "tbd": "TBD",
      "no_reqs": "No specific requirements.",
      "profile_setup": "Profile Setup",
      "step_academy": "Academy",
      "step_profile": "Profile",
      "step_done": "Done",
      "setup_profile_title": "Set up your Profile",
      "setup_profile_subtitle": "Just one more step before you can start taking tasks!",
      "personal_info": "Personal Information",
      "upload_photo": "Upload photo",
      "full_name": "Full Name",
      "operation_area": "Operation Area",
      "city": "City",
      "district_label": "District",
      "work_schedule": "Work Schedule",
      "schedule_hint": "Select as many slots as possible to get higher priority for tasks!",
      "finish_and_pool": "Finish & Enter Pool →",
      "nav_dashboard": "Dashboard",
      "nav_escalations": "Escalation Queue",
      "nav_campaigns": "Campaign Monitor",
      "nav_execution": "Execution Live",
      "nav_executors": "Executor Network",
      "ops_portal": "Ops Portal",
`;

// Inject into vi
content = content.replace(
  /"match_rate": "% match",/g,
  \`"match_rate": "% match",\n\${viKeys}\`
);

// Note: match_rate is also in EN. But wait, we have two instances of match_rate.
// I will use regex to be precise.
content = content.replace(
  /(vi:\s*\{\s*translation:\s*\{[\s\S]*?)"match_rate": "% match",/g,
  \`$1"match_rate": "% match",\n\${viKeys}\`
);

content = content.replace(
  /(en:\s*\{\s*translation:\s*\{[\s\S]*?)"match_rate": "% match",/g,
  \`$1"match_rate": "% match",\n\${enKeys}\`
);

fs.writeFileSync(path, content);
console.log('Done');
