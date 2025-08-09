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
