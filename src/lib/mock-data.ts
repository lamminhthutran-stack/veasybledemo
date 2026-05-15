export const executor = {
  name: "John Doe",
  tier: "Standard",
  rating: 4.6,
  tasksCompleted: 23,
  city: "Ho Chi Minh City",
  earningsMonth: "3,420,000 VND",
};

export const ops = {
  name: "Linda Tran",
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
    store: "FamilyMart Nguyen Trai",
    district: "District 5, HCMC",
    date: "15/05/2026",
    time: "9:00–11:00 AM",
    pay: "180,000 VND",
    printStation: "Station #3",
    printAddress: "45 Lê Lai, District 1",
    badge: "available",
    brief:
      "Set up Pepsi Summer endcap display with promotional signage and product facing per planogram.",
  },
  {
    id: "t-002",
    campaign: "Vinamilk Back-to-School",
    brand: "Vinamilk",
    store: "Circle K Le Loi",
    district: "District 1, HCMC",
    date: "16/05/2026",
    time: "2:00–4:00 PM",
    pay: "150,000 VND",
    printStation: "Station #1",
    printAddress: "12 Pasteur, District 1",
    badge: "urgent",
    brief: "Replace shelf wobblers and install new POSM kit at checkout area.",
  },
  {
    id: "t-003",
    campaign: "Heineken Silver Launch",
    brand: "Heineken",
    store: "GS25 Pham Ngu Lao",
    district: "District 1, HCMC",
    date: "18/05/2026",
    time: "10:00 AM–12:00 PM",
    pay: "200,000 VND",
    printStation: "Station #3",
    printAddress: "45 Lê Lai, District 1",
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
    brief:
      "Refresh noodle bay POSM, capture before and after photos, and submit shelf compliance proof.",
  },
];

export const escalations = [
  {
    id: "e-1",
    phase: "Onboard",
    severity: "High",
    status: "Open",
    title: "Flagged application — unusual background, strong experience",
    executorId: "exec-001",
    createdAt: "2026-05-14T08:30:00Z",
    resolvedAt: null,
    resolvedNote: null,
  },
  {
    id: "e-2",
    phase: "Execute",
    severity: "Medium",
    status: "In Progress",
    title: "Late check-in — District 7, Lotte Mart",
    executorId: "exec-002",
    createdAt: "2026-05-14T07:15:00Z",
    resolvedAt: null,
    resolvedNote: null,
  },
  {
    id: "e-3",
    phase: "Verification",
    severity: "Medium",
    status: "Open",
    title: "PoP photos missing planogram angle",
    executorId: "exec-003",
    createdAt: "2026-05-14T06:00:00Z",
    resolvedAt: null,
    resolvedNote: null,
  },
  {
    id: "e-4",
    phase: "Quality",
    severity: "High",
    status: "Open",
    title: "Executor rating dropped below 4.0 (3 brands)",
    executorId: "exec-004",
    createdAt: "2026-05-14T05:00:00Z",
    resolvedAt: null,
    resolvedNote: null,
  },
  {
    id: "e-5",
    phase: "Dispatch",
    severity: "Low",
    status: "Resolved",
    title: "Coverage gap — Da Nang District 2",
    executorId: "exec-005",
    createdAt: "2026-05-14T04:00:00Z",
    resolvedAt: "2026-05-14T05:30:00Z",
    resolvedNote: "Assigned 2 backup executors.",
  },
];

export const reportEscalation = (issue: {
  title: string;
  phase: string;
  severity: string;
  executorId: string;
}) => {
  escalations.unshift({
    id: `e-${Date.now()}`,
    phase: issue.phase,
    severity: issue.severity,
    status: "Open",
    title: issue.title,
    executorId: issue.executorId,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    resolvedNote: null,
  });
};

export type CoverageZone = {
  district: string;
  executorCount: number;
  demandForecast: number;
  matchRate: number;
};

export const coverageZones: CoverageZone[] = [
  { district: "District 1", executorCount: 12, demandForecast: 10, matchRate: 120 },
  { district: "District 7", executorCount: 8, demandForecast: 10, matchRate: 80 },
  { district: "Binh Thanh", executorCount: 3, demandForecast: 8, matchRate: 38 },
  { district: "Thu Duc", executorCount: 5, demandForecast: 6, matchRate: 83 },
  { district: "Go Vap", executorCount: 1, demandForecast: 5, matchRate: 20 },
];

export const applications = {
  "e-1": {
    name: "Thomas Bao",
    age: 24,
    background: "Freelancer (2y field activation)",
    availability: "5 days/week, mornings + afternoons",
    experience:
      "2 years field marketing for FMCG brands. Previously with Unilever activation team.",
    flag: "Age within range but not a student — strong 2-year field activation experience.",
  },
};

export const campaigns = [
  {
    id: "c-1",
    name: "Pepsi Summer 2026",
    brand: "Pepsi",
    city: "HCMC",
    date: "15/05/2026",
    total: 48,
    filled: 42,
    status: "On Track",
    fillRate: 88,
    assignedCount: 42,
    totalSlots: 48,
    stalledExecutorCount: 0,
  },
  {
    id: "c-2",
    name: "Vinamilk Back-to-School",
    brand: "Vinamilk",
    city: "HCMC",
    date: "16/05/2026",
    total: 60,
    filled: 41,
    status: "At Risk",
    fillRate: 68,
    assignedCount: 41,
    totalSlots: 60,
    stalledExecutorCount: 3,
  },
  {
    id: "c-3",
    name: "Heineken Silver Launch",
    brand: "Heineken",
    city: "Hanoi",
    date: "18/05/2026",
    total: 30,
    filled: 12,
    status: "Urgent",
    fillRate: 40,
    assignedCount: 12,
    totalSlots: 30,
    stalledExecutorCount: 2,
  },
  {
    id: "c-4",
    name: "Coca-Cola Lunar New Year Wrap-up",
    brand: "Coca-Cola",
    city: "Da Nang",
    date: "01/03/2026",
    total: 25,
    filled: 25,
    status: "Completed",
    fillRate: 100,
    assignedCount: 25,
    totalSlots: 25,
    stalledExecutorCount: 0,
  },
];

export const executionTasks = [
  {
    id: "et-1",
    executorName: "John Doe",
    storeName: "FamilyMart Nguyen Trai",
    district: "District 5",
    checkInTime: "9:05 AM",
    campaign: "Pepsi Summer 2026",
    status: "on-site",
  },
  {
    id: "et-2",
    executorName: "Patricia Huong",
    storeName: "Circle K Le Loi",
    district: "District 1",
    checkInTime: "2:20 PM",
    campaign: "Vinamilk Back-to-School",
    status: "late",
  },
  {
    id: "et-3",
    executorName: "Leon Huy",
    storeName: "GS25 Pham Ngu Lao",
    district: "District 1",
    checkInTime: null as string | null,
    campaign: "Heineken Silver Launch",
    status: "not-checked-in",
  },
  {
    id: "et-4",
    executorName: "Mandy Linh",
    storeName: "WinMart Nguyen Van Linh",
    district: "District 7",
    checkInTime: "1:10 PM",
    campaign: "Unilever Perfect Store",
    status: "completed",
  },
];

export const executorProfile = {
  name: "Michael Tuan",
  initials: "NMT",
  rating: 4.3,
  monthlyEarnings: 3200000,
  campaignsThisMonth: 8,
  // availableDates is deprecated, keeping for backward compatibility if needed, but we use getWeeklyAvailability
  availableDates: ["2026-05-14", "2026-05-15", "2026-05-17", "2026-05-20", "2026-05-21"],
  availableDistricts: ["District 1", "District 3", "District 7", "Binh Thanh"],
  ratingBreakdown: [
    { label: "On-time check-in", score: 4.5 },
    { label: "PoP Quality", score: 4.2 },
    { label: "Follows SOP strictly", score: 4.1 },
    { label: "Attitude & Communication", score: 4.6 },
    { label: "Issue Resolution", score: 3.8 },
  ],
  feedback: [
    {
      from: "Retailer · Big C District 7",
      date: "12/05/2026",
      comment:
        "Executor arrived on time, took clear and beautiful product photos. Very professional.",
    },
    {
      from: "Brand · Milo",
      date: "08/05/2026",
      comment:
        "Placement matches planogram, photos cover all angles. However, check-in selfie is slightly blurry.",
    },
  ],
};

export type TimeSlot = "Morning" | "Afternoon" | "Evening";
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface WeeklyAvailability {
  day: DayOfWeek;
  slot: TimeSlot;
}

let _weeklyAvailability: WeeklyAvailability[] = [];

export const getWeeklyAvailability = (): WeeklyAvailability[] => {
  return _weeklyAvailability;
};

export const setWeeklyAvailability = (newAvailability: WeeklyAvailability[]) => {
  _weeklyAvailability = newAvailability;
};

export const executorsList = [
  {
    id: "u-1",
    name: "John Doe",
    tier: "Standard",
    city: "HCMC",
    rating: 4.6,
    tasks: 23,
    status: "Active",
    partnerFeedback: [
      {
        from: "Milo Brand Team",
        campaignName: "Summer Activation Q2",
        submittedAt: "2026-05-13",
        sentiment: "positive",
        comment: "Executor followed planogram perfectly, good quality photos. Very reliable.",
      },
      {
        from: "Big C District 7 — Store Manager",
        campaignName: "Summer Activation Q2",
        submittedAt: "2026-05-13",
        sentiment: "neutral",
        comment: "Arrived on time but had to ask about placement location. No major issues.",
      },
      {
        from: "Pepsi Campaign Team",
        campaignName: "Back to School Launch",
        submittedAt: "2026-04-29",
        sentiment: "negative",
        comment:
          "Missed 1 photo angle in the PoP set, had to remind them. Needs to improve proactiveness.",
      },
    ],
  },
  {
    id: "u-2",
    name: "Patricia Huong",
    tier: "Senior",
    city: "HCMC",
    rating: 4.8,
    tasks: 91,
    status: "Active",
    partnerFeedback: [],
  },
  {
    id: "u-3",
    name: "Leon Huy",
    tier: "Standard",
    city: "Hanoi",
    rating: 3.9,
    tasks: 14,
    status: "Warning",
    partnerFeedback: [],
  },
  {
    id: "u-4",
    name: "Mandy Linh",
    tier: "Senior",
    city: "Da Nang",
    rating: 4.5,
    tasks: 67,
    status: "Active",
    partnerFeedback: [],
  },
  {
    id: "u-5",
    name: "David Son",
    tier: "Standard",
    city: "HCMC",
    rating: 2.8,
    tasks: 9,
    status: "Suspended",
    partnerFeedback: [],
  },
  {
    id: "u-6",
    name: "Bella Ha",
    tier: "Standard",
    city: "HCMC",
    rating: 4.2,
    tasks: 31,
    status: "Dormant",
    partnerFeedback: [],
  },
];

export interface AvailableTask {
  id: string;
  brand: string;
  brandLogo?: string;
  campaignName: string;
  storeName: string;
  district: string;
  address?: string;
  scheduledTime: string;
  pay: number;
  date: string;
  status: string;
  printStation?: {
    pickupDate: string;
    address: string;
    materials: string;
    note?: string;
  };
  sopItems?: string[];
}

export const availableTasks: AvailableTask[] = [
  {
    id: "t-001",
    brand: "Pepsi",
    brandLogo: "",
    campaignName: "Pepsi Summer 2026",
    storeName: "FamilyMart Nguyen Trai",
    district: "District 5",
    address: "123 Main St, District 5",
    scheduledTime: "9:00–11:00 AM",
    pay: 180000,
    date: "2026-05-14",
    status: "accepted",
    printStation: {
      pickupDate: "2026-05-13",
      address: "123 Lê Lai, Q1",
      materials: "Banner A1, Shelf talker x5, Wobbler x2",
      note: "Pick up at least 1 day before execution.",
    },
    sopItems: [
      "Take photo of shelf BEFORE setup",
      "Setup according to attached planogram",
      "Take photo of shelf AFTER setup — all 4 angles",
      "Selfie at store in uniform",
    ],
  },
  {
    id: "t-002",
    brand: "Vinamilk",
    brandLogo: "",
    campaignName: "Vinamilk Back-to-School",
    storeName: "Circle K Le Loi",
    district: "District 1",
    scheduledTime: "2:00–4:00 PM",
    pay: 150000,
    date: "2026-05-15",
    status: "accepted",
  },
  {
    id: "t-003",
    brand: "Heineken",
    brandLogo: "",
    campaignName: "Heineken Silver Launch",
    storeName: "GS25 Pham Ngu Lao",
    district: "District 1",
    scheduledTime: "10:00 AM–12:00 PM",
    pay: 200000,
    date: "2026-05-18",
    status: "available",
  },
  {
    id: "t-004",
    brand: "Unilever",
    brandLogo: "",
    campaignName: "Unilever Perfect Store",
    storeName: "WinMart Nguyen Van Linh",
    district: "District 7",
    scheduledTime: "1:00–3:00 PM",
    pay: 190000,
    date: "2026-05-20",
    status: "available",
  },
  {
    id: "t-005",
    brand: "Masan",
    brandLogo: "",
    campaignName: "Masan Pantry Reset",
    storeName: "Bach Hoa Xanh Go Vap",
    district: "Go Vap",
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
