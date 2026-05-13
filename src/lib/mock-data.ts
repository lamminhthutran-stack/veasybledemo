export const executor = {
  name: "Nguyễn Minh Khoa",
  tier: "Standard",
  rating: 4.6,
  tasksCompleted: 23,
  city: "Ho Chi Minh City",
  earningsMonth: "3,420,000 VND",
};

export const ops = {
  name: "Linh Trần",
  role: "Ops Lead",
};

export type Task = {
  id: string;
  campaign: string;
  brand: string;
  store: string;
  district: string;
  date: string;
  time: string;
  pay: string;
  printStation: string;
  printAddress: string;
  badge?: "available" | "urgent" | "outside";
  brief: string;
};

export const tasks: Task[] = [
  {
    id: "t-001",
    campaign: "Pepsi Summer 2026",
    brand: "Pepsi",
    store: "FamilyMart Nguyễn Trãi",
    district: "Quận 5, HCMC",
    date: "15/05/2026",
    time: "9:00–11:00 AM",
    pay: "180,000 VND",
    printStation: "Station #3",
    printAddress: "45 Lê Lai, Quận 1",
    badge: "available",
    brief: "Set up Pepsi Summer endcap display with promotional signage and product facing per planogram.",
  },
  {
    id: "t-002",
    campaign: "Vinamilk Back-to-School",
    brand: "Vinamilk",
    store: "Circle K Lê Lợi",
    district: "Quận 1, HCMC",
    date: "16/05/2026",
    time: "2:00–4:00 PM",
    pay: "150,000 VND",
    printStation: "Station #1",
    printAddress: "12 Pasteur, Quận 1",
    badge: "urgent",
    brief: "Replace shelf wobblers and install new POSM kit at checkout area.",
  },
  {
    id: "t-003",
    campaign: "Heineken Silver Launch",
    brand: "Heineken",
    store: "GS25 Phạm Ngũ Lão",
    district: "Quận 1, HCMC",
    date: "18/05/2026",
    time: "10:00 AM–12:00 PM",
    pay: "200,000 VND",
    printStation: "Station #3",
    printAddress: "45 Lê Lai, Quận 1",
    badge: "outside",
    brief: "Build floor display with 3 cases. Photograph from 3 angles.",
  },
  {
    id: "t-004",
    campaign: "Unilever Perfect Store",
    brand: "Unilever",
    store: "WinMart Nguyen Van Linh",
    district: "Quan 7, HCMC",
    date: "20/05/2026",
    time: "1:00-3:00 PM",
    pay: "190,000 VND",
    printStation: "Station #2",
    printAddress: "88 Nguyen Hue, Quan 1",
    badge: "available",
    brief: "Install shelf talkers and verify product block visibility for personal care display.",
  },
  {
    id: "t-005",
    campaign: "Masan Pantry Reset",
    brand: "Masan",
    store: "Bach Hoa Xanh Go Vap",
    district: "Go Vap, HCMC",
    date: "22/05/2026",
    time: "9:30-11:30 AM",
    pay: "170,000 VND",
    printStation: "Station #4",
    printAddress: "19 Phan Van Tri, Go Vap",
    badge: "outside",
    brief: "Refresh noodle bay POSM, capture before and after photos, and submit shelf compliance proof.",
  },
];

export const escalations = [
  { id: "e-1", type: "Application", phase: "Onboard", desc: "Flagged application — unusual background, strong experience", time: "12m ago", priority: "High", status: "Open" },
  { id: "e-2", type: "Task", phase: "Execute", desc: "Late check-in — Quận 7, Lotte Mart", time: "38m ago", priority: "Medium", status: "In Progress", assignee: "Linh T." },
  { id: "e-3", type: "Verification", phase: "Verification", desc: "PoP photos missing planogram angle", time: "1h ago", priority: "Medium", status: "Open" },
  { id: "e-4", type: "Quality", phase: "Quality", desc: "Executor rating dropped below 4.0 (3 brands)", time: "2h ago", priority: "High", status: "Open" },
  { id: "e-5", type: "Network", phase: "Dispatch", desc: "Coverage gap — Đà Nẵng District 2", time: "3h ago", priority: "Low", status: "Resolved" },
];

export const applications = {
  "e-1": {
    name: "Trần Văn Bảo",
    age: 24,
    background: "Freelancer (2y field activation)",
    availability: "5 days/week, mornings + afternoons",
    experience: "2 years field marketing for FMCG brands. Previously with Unilever activation team.",
    flag: "Age within range but not a student — strong 2-year field activation experience.",
  },
};

export const campaigns = [
  { id: "c-1", name: "Pepsi Summer 2026", brand: "Pepsi", city: "HCMC", date: "15/05/2026", total: 48, filled: 42, status: "On Track", fillRate: 88, assignedCount: 42, totalSlots: 48, stalledExecutorCount: 0 },
  { id: "c-2", name: "Vinamilk Back-to-School", brand: "Vinamilk", city: "HCMC", date: "16/05/2026", total: 60, filled: 41, status: "At Risk", fillRate: 68, assignedCount: 41, totalSlots: 60, stalledExecutorCount: 3 },
  { id: "c-3", name: "Heineken Silver Launch", brand: "Heineken", city: "Hà Nội", date: "18/05/2026", total: 30, filled: 12, status: "Urgent", fillRate: 40, assignedCount: 12, totalSlots: 30, stalledExecutorCount: 2 },
  { id: "c-4", name: "Coca-Cola Tết Wrap-up", brand: "Coca-Cola", city: "Đà Nẵng", date: "01/03/2026", total: 25, filled: 25, status: "Completed", fillRate: 100, assignedCount: 25, totalSlots: 25, stalledExecutorCount: 0 },
];

export const executionTasks = [
  { id: "et-1", executorName: "Nguyễn Minh Khoa", storeName: "FamilyMart Nguyễn Trãi", district: "Quận 5", checkInTime: "9:05 AM", campaign: "Pepsi Summer 2026", status: "on-site" },
  { id: "et-2", executorName: "Phạm Thị Hương", storeName: "Circle K Lê Lợi", district: "Quận 1", checkInTime: "2:20 PM", campaign: "Vinamilk Back-to-School", status: "late" },
  { id: "et-3", executorName: "Lê Quang Huy", storeName: "GS25 Phạm Ngũ Lão", district: "Quận 1", checkInTime: null as string | null, campaign: "Heineken Silver Launch", status: "not-checked-in" },
  { id: "et-4", executorName: "Trần Mỹ Linh", storeName: "WinMart Nguyen Van Linh", district: "Quận 7", checkInTime: "1:10 PM", campaign: "Unilever Perfect Store", status: "completed" },
];

export const executorProfile = {
  name: "Nguyễn Minh Tuấn",
  initials: "NMT",
  rating: 4.3,
  monthlyEarnings: 3200000,
  campaignsThisMonth: 8,
  availableDates: [
    "2026-05-14", "2026-05-15", "2026-05-17", "2026-05-20", "2026-05-21",
  ],
  availableDistricts: ["Quận 1", "Quận 3", "Quận 7", "Bình Thạnh"],
  ratingBreakdown: [
    { label: "Đúng giờ check-in",   score: 4.5 },
    { label: "Chất lượng PoP",       score: 4.2 },
    { label: "Thực hiện đúng SOP",   score: 4.1 },
    { label: "Thái độ & giao tiếp",  score: 4.6 },
    { label: "Xử lý sự cố",          score: 3.8 },
  ],
  feedback: [
    {
      from: "Retailer · Big C Quận 7",
      date: "12/05/2026",
      comment: "Executor đến đúng giờ, chụp ảnh sản phẩm đẹp và rõ ràng. Rất chuyên nghiệp.",
    },
    {
      from: "Brand · Milo",
      date: "08/05/2026",
      comment: "Placement đúng theo planogram, ảnh đủ góc. Tuy nhiên selfie check-in hơi mờ.",
    },
  ],
};

export const executorsList = [
  { id: "u-1", name: "Nguyễn Minh Khoa", tier: "Standard", city: "HCMC", rating: 4.6, tasks: 23, status: "Active" },
  { id: "u-2", name: "Phạm Thị Hương", tier: "Senior", city: "HCMC", rating: 4.8, tasks: 91, status: "Active" },
  { id: "u-3", name: "Lê Quang Huy", tier: "Standard", city: "Hà Nội", rating: 3.9, tasks: 14, status: "Warning" },
  { id: "u-4", name: "Trần Mỹ Linh", tier: "Senior", city: "Đà Nẵng", rating: 4.5, tasks: 67, status: "Active" },
  { id: "u-5", name: "Đỗ Văn Sơn", tier: "Standard", city: "HCMC", rating: 2.8, tasks: 9, status: "Suspended" },
  { id: "u-6", name: "Bùi Thanh Hà", tier: "Standard", city: "HCMC", rating: 4.2, tasks: 31, status: "Dormant" },
];

export interface AvailableTask {
  id: string;
  brand: string;
  brandLogo?: string;
  campaignName: string;
  storeName: string;
  district: string;
  scheduledTime: string;
  pay: number;
  date: string;
  status: string;
}

export const availableTasks: AvailableTask[] = [
  {
    id: "t-001",
    brand: "Pepsi",
    brandLogo: "🥤",
    campaignName: "Pepsi Summer 2026",
    storeName: "FamilyMart Nguyễn Trãi",
    district: "Quận 5",
    scheduledTime: "9:00–11:00 AM",
    pay: 180000,
    date: "2026-05-14",
    status: "accepted",
  },
  {
    id: "t-002",
    brand: "Vinamilk",
    brandLogo: "🥛",
    campaignName: "Vinamilk Back-to-School",
    storeName: "Circle K Lê Lợi",
    district: "Quận 1",
    scheduledTime: "2:00–4:00 PM",
    pay: 150000,
    date: "2026-05-15",
    status: "accepted",
  },
  {
    id: "t-003",
    brand: "Heineken",
    brandLogo: "🍺",
    campaignName: "Heineken Silver Launch",
    storeName: "GS25 Phạm Ngũ Lão",
    district: "Quận 1",
    scheduledTime: "10:00 AM–12:00 PM",
    pay: 200000,
    date: "2026-05-18",
    status: "available",
  },
  {
    id: "t-004",
    brand: "Unilever",
    brandLogo: "🧴",
    campaignName: "Unilever Perfect Store",
    storeName: "WinMart Nguyen Van Linh",
    district: "Quận 7",
    scheduledTime: "1:00–3:00 PM",
    pay: 190000,
    date: "2026-05-20",
    status: "available",
  },
  {
    id: "t-005",
    brand: "Masan",
    brandLogo: "🍜",
    campaignName: "Masan Pantry Reset",
    storeName: "Bach Hoa Xanh Go Vap",
    district: "Gò Vấp",
    scheduledTime: "9:30–11:30 AM",
    pay: 170000,
    date: "2026-05-22",
    status: "available",
  },
];

export interface UpcomingCampaign {
  id: string;
  brand: string;
  name: string;
  dateRange: string;
  daysUntilStart: number;
  taskCount: number;
  payPerTask: number;
}

export const upcomingCampaigns: UpcomingCampaign[] = [
  {
    id: "uc-001",
    brand: "Milo",
    name: "Summer Activation Q2",
    dateRange: "20/05 – 25/05",
    daysUntilStart: 3,
    taskCount: 48,
    payPerTask: 150000,
  },
  {
    id: "uc-002",
    brand: "Pepsi",
    name: "Back to School Launch",
    dateRange: "01/06 – 07/06",
    daysUntilStart: 15,
    taskCount: 120,
    payPerTask: 180000,
  },
  {
    id: "uc-003",
    brand: "Vinamilk",
    name: "Mid-Year Campaign",
    dateRange: "10/06 – 15/06",
    daysUntilStart: 24,
    taskCount: 75,
    payPerTask: 130000,
  },
];
