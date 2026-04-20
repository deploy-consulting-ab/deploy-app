-- =============================================================================
-- Seed script: FinancialRecord fake data
-- Fiscal year: Feb 1 → Jan 31  (FY 2024 = Feb 2024 – Jan 2025)
-- Quarters:
--   Q1 = Feb–Apr   (quarter = 1)
--   Q2 = May–Jul   (quarter = 2)
--   Q3 = Aug–Oct   (quarter = 3)
--   Q4 = Nov–Jan   (quarter = 4)
--   Total Year      (quarter = 0)
-- Currency: SEK
-- =============================================================================

-- Clear existing records before seeding (safe to remove if you want to append)
DELETE FROM "FinancialRecord";

-- ---------------------------------------------------------------------------
-- FY 2023  (Feb 2023 – Jan 2024)
-- ---------------------------------------------------------------------------

-- Q1
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy23q1', 2023, 1, 4200000, 2800000, 1400000, 420000, NOW(), NOW());

-- Q2
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy23q2', 2023, 2, 5100000, 3200000, 1900000, 510000, NOW(), NOW());

-- Q3
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy23q3', 2023, 3, 4750000, 3050000, 1700000, 475000, NOW(), NOW());

-- Q4
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy23q4', 2023, 4, 5600000, 3400000, 2200000, 560000, NOW(), NOW());

-- Total Year (stored)
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy23ty', 2023, 0, 19650000, 12450000, 7200000, 1965000, NOW(), NOW());


-- ---------------------------------------------------------------------------
-- FY 2024  (Feb 2024 – Jan 2025)
-- ---------------------------------------------------------------------------

-- Q1
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy24q1', 2024, 1, 5300000, 3100000, 2200000, 530000, NOW(), NOW());

-- Q2
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy24q2', 2024, 2, 6100000, 3600000, 2500000, 610000, NOW(), NOW());

-- Q3
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy24q3', 2024, 3, 5800000, 3400000, 2400000, 580000, NOW(), NOW());

-- Q4
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy24q4', 2024, 4, 6700000, 3900000, 2800000, 670000, NOW(), NOW());

-- Total Year (stored)
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy24ty', 2024, 0, 23900000, 14000000, 9900000, 2390000, NOW(), NOW());


-- ---------------------------------------------------------------------------
-- FY 2025  (Feb 2025 – Jan 2026)
-- ---------------------------------------------------------------------------

-- Q1
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy25q1', 2025, 1, 6400000, 3700000, 2700000, 640000, NOW(), NOW());

-- Q2
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy25q2', 2025, 2, 7200000, 4100000, 3100000, 720000, NOW(), NOW());

-- Q3
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy25q3', 2025, 3, 6900000, 3900000, 3000000, 690000, NOW(), NOW());

-- Q4
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy25q4', 2025, 4, 7800000, 4400000, 3400000, 780000, NOW(), NOW());

-- Total Year (stored)
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy25ty', 2025, 0, 28300000, 16100000, 12200000, 2830000, NOW(), NOW());


-- ---------------------------------------------------------------------------
-- FY 2026  (Feb 2026 – Jan 2027) — partial, Q1 and Q2 only (current year)
-- ---------------------------------------------------------------------------

-- Q1
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy26q1', 2026, 1, 7500000, 4200000, 3300000, 750000, NOW(), NOW());

-- Q2
INSERT INTO "FinancialRecord" (id, "fiscalYear", quarter, revenue, cost, profit, taxes, "createdAt", "updatedAt")
VALUES ('fy26q2', 2026, 2, 8100000, 4600000, 3500000, 810000, NOW(), NOW());
