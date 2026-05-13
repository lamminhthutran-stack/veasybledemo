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
  role: "Ops Member",
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
];

export const escalations = [
  { id: "e-1", type: "Application", desc: "Flagged application — unusual background, strong experience", time: "12m ago", priority: "High", status: "Open" },
  { id: "e-2", type: "Task", desc: "Late check-in — Quận 7, Lotte Mart", time: "38m ago", priority: "Medium", status: "In Progress", assignee: "Linh T." },
  { id: "e-3", type: "Verification", desc: "PoP photos missing planogram angle", time: "1h ago", priority: "Medium", status: "Open" },
  { id: "e-4", type: "Quality", desc: "Executor rating dropped below 4.0 (3 brands)", time: "2h ago", priority: "High", status: "Open" },
  { id: "e-5", type: "Network", desc: "Coverage gap — Đà Nẵng District 2", time: "3h ago", priority: "Low", status: "Resolved" },
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
  { id: "c-1", name: "Pepsi Summer 2026", brand: "Pepsi", city: "HCMC", date: "15/05/2026", total: 48, filled: 42, status: "On Track" },
  { id: "c-2", name: "Vinamilk Back-to-School", brand: "Vinamilk", city: "HCMC", date: "16/05/2026", total: 60, filled: 41, status: "At Risk" },
  { id: "c-3", name: "Heineken Silver Launch", brand: "Heineken", city: "Hà Nội", date: "18/05/2026", total: 30, filled: 12, status: "Urgent" },
  { id: "c-4", name: "Coca-Cola Tết Wrap-up", brand: "Coca-Cola", city: "Đà Nẵng", date: "01/03/2026", total: 25, filled: 25, status: "Completed" },
];

export const executorsList = [
  { id: "u-1", name: "Nguyễn Minh Khoa", tier: "Standard", city: "HCMC", rating: 4.6, tasks: 23, status: "Active" },
  { id: "u-2", name: "Phạm Thị Hương", tier: "Senior", city: "HCMC", rating: 4.8, tasks: 91, status: "Active" },
  { id: "u-3", name: "Lê Quang Huy", tier: "Standard", city: "Hà Nội", rating: 3.9, tasks: 14, status: "Warning" },
  { id: "u-4", name: "Trần Mỹ Linh", tier: "Senior", city: "Đà Nẵng", rating: 4.5, tasks: 67, status: "Active" },
  { id: "u-5", name: "Đỗ Văn Sơn", tier: "Standard", city: "HCMC", rating: 2.8, tasks: 9, status: "Suspended" },
  { id: "u-6", name: "Bùi Thanh Hà", tier: "Standard", city: "HCMC", rating: 4.2, tasks: 31, status: "Dormant" },
];
