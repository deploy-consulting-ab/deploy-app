// Helper function to generate a week of timecard data
function generateWeekTimecard(weekStartDate, weekEndDate, isComplete = true) {
  // Generate realistic hours (8 hours weekdays, 0 on weekends)
  const hours = [
    Math.random() > 0.1 ? 8 : 6, // Monday (10% chance of 6 hours)
    Math.random() > 0.1 ? 8 : 7, // Tuesday
    Math.random() > 0.1 ? 8 : 6, // Wednesday
    Math.random() > 0.1 ? 8 : 7, // Thursday
    Math.random() > 0.1 ? 8 : 6, // Friday
    0, // Saturday
    0  // Sunday
  ];

  // If week is not complete, set some days to 0
  if (!isComplete) {
    const currentDay = new Date().getDay();
    for (let i = currentDay; i < 7; i++) {
      hours[i] = 0;
    }
  }

  return {
    weekStartDate,
    weekEndDate,
    hours
  };
}

// Generate timecards for the last 4 weeks
function generateAssignmentTimecards() {
  const timecards = [];
  const today = new Date();
  
  // Get Monday of current week
  const currentWeekMonday = new Date(today);
  currentWeekMonday.setDate(today.getDate() - today.getDay() + 1);
  
  // Generate last 4 weeks of data
  for (let i = 0; i < 20; i++) {
    const weekStart = new Date(currentWeekMonday);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    // Current week is incomplete, past weeks are complete
    const isComplete = i > 0;
    timecards.unshift(generateWeekTimecard(weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0], isComplete));
  }
  
  return timecards;
}

// Sample assignment data with timecards
export const sampleAssignmentData = {
  id: "a07Dn000002pUBBIA2",
  name: "Senior Developer",
  projectName: "Digital Transformation",
  projectStatus: "Ongoing",
  startDate: "2024-02-01",
  endDate: "2024-06-30",
  projectedHours: 800,
  actualHours: 320,
  timecards: generateAssignmentTimecards()
};

export const employeeData = {
  holidays: {
    totalHolidays: 30,
    currentFiscalUsedHolidays: 15,
    availableHolidays: 15,
    nextReset: "2025-04-01",
    recentHolidayPeriods: [
      { fromDate: "2025-02-15", toDate: "2025-02-20", days: 4 },
      { fromDate: "2025-01-02", toDate: "2025-01-05", days: 4 },
      { fromDate: "2025-12-27", toDate: "2025-12-29", days: 3 },
    ],
    allHolidaysRange: [
      "2025-07-15",
      "2025-07-16",
      "2025-07-17",
      "2025-07-18",
      "2025-07-19",
      "2025-07-20",
      "2025-08-02",
      "2025-08-03",
      "2025-08-04",
      "2025-08-05",
    ],
  },
  occupancy: {
    current: 85,
    history: [
      { month: "January", rate: 90 },
      { month: "February", rate: 85 },
      { month: "March", rate: 85 },
    ],
  },
  usefulLinks: [
    {
      title: "Pension Plans & Policies",
      description: "Check your pension plan and policies",
      href: "https://www.notion.so/deploy-consulting/Pension-Plans-Policy-71e54f641b104eeeb82915f8059c8481",
      icon: "Wallet",
      target: "_blank",
    },
    {
      title: "Insurance Policies",
      description: "View and manage your insurance policies",
      href: "https://www.notion.so/deploy-consulting/Insurance-Policies-6b66dea29d314304b178e78a9934e79a",
      icon: "Shield",
      target: "_blank",
    },
    {
      title: "Wellness",
      description: "Access learning materials and courses",
      href: "https://www.notion.so/deploy-consulting/Policy-Wellness-Friskv-rdsbidrag-222427198fd280bfaa02ccce51f52b92",
      icon: "Leaf",
      target: "_blank",
    },
    {
      title: "Flex",
      description: "Access flex for time reporting",
      href: "https://deploysweden.flexhosting.se/HRM/Home?f=b4253a61-f229-4ca9-9831-ad931d9a75a6",
      icon: "Clock",
      target: "_blank",
    },
  ],
};
