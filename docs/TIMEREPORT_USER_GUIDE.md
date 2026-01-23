# Time Report User Guide

Welcome to the Time Report feature! This guide will walk you through all the functionality available for logging your working hours.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Navigating Between Weeks](#navigating-between-weeks)
3. [Adding Projects](#adding-projects)
4. [Entering Hours](#entering-hours)
5. [Quick Actions](#quick-actions)
6. [Saving Your Time Report](#saving-your-time-report)
7. [Checkmarking Your Hours](#checkmarking-your-hours)
8. [Visual Indicators Guide](#visual-indicators-guide)
9. [Mobile Usage](#mobile-usage)

---

## Getting Started

When you open the Time Report page, you'll see:

- **Week Navigation** at the top to select which week to report
- **Time Entries Card** where you add projects and enter hours
- **Quick Stats** showing your totals at the bottom

---

## Navigating Between Weeks

### Week Selection

```
┌─────────────────────────────────────────────────────────────┐
│  [◀]  📅 Week 4 (20 Jan - 26 Jan)  [▶]                     │
│                                       [Go to current week]  │
└─────────────────────────────────────────────────────────────┘
```

| Action | How to Do It |
|--------|--------------|
| **Previous Week** | Click the `◀` (left arrow) button |
| **Next Week** | Click the `▶` (right arrow) button |
| **Return to Current Week** | Click "Go to current week" button (only visible when viewing past/future weeks) |

> **Note:** You can view past weeks in read-only mode, but you can only edit the current week and future weeks.

---

## Adding Projects

### When No Projects Are Selected

If you haven't added any projects yet, you'll see this empty state:

```
┌─────────────────────────────────────────────────────────────┐
│  💼 No projects added                                        │
│     Select a project to start logging hours                  │
│                                                              │
│     [📋 Copy from last week]    [➕ Add project ▾]          │
└─────────────────────────────────────────────────────────────┘
```

### Adding a New Project

1. Click the **"Add project"** dropdown
2. Select a project from the list
3. The project will appear in the hours grid ready for time entry

### Copy from Last Week

Save time by copying your previous week's time entries:

1. Click **"Copy from last week"** button
2. All projects and hours from the previous week will be copied
3. The copied data is **NOT automatically saved** - you need to review and save it

> **Tip:** This is great for consistent weekly schedules!

---

## Entering Hours

### The Hours Grid (Desktop)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                   Mon   Tue   Wed   Thu   Fri   Sat   Sun   Total           │
│                   20    21    22    23    24    25    26                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ ✕ ● Project A     [8]   [8]   [8]   [8]   [8]   [ ]   [ ]   40h   ⏰ 🔄     │
│ ✕ ● Project B     [ ]   [ ]   [4]   [4]   [ ]   [ ]   [ ]    8h   ⏰ 🔄     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Total             8h    8h   12h   12h    8h    0h    0h    48h             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### How to Enter Hours

1. Click on any cell in the grid
2. Type the number of hours (supports decimals like 7.5)
3. Press Tab or click elsewhere to move to the next cell
4. Values are clamped between 0 and 24 hours per day

> **Tip:** Use comma (,) or dot (.) as decimal separator depending on your locale.

---

## Quick Actions

Each project row has quick action buttons on the right side:

### Fill Full Time (⏰ Clock Icon)

Quickly fill 8 hours for Monday through Friday:

```
Before:  [ ] [ ] [ ] [ ] [ ] [ ] [ ]  →  0h
After:   [8] [8] [8] [8] [8] [ ] [ ]  → 40h
```

- Fills only weekdays (Mon-Fri)
- Skips bank holidays automatically
- Existing values are overwritten with 8

### Reset Hours (🔄 Rotate Icon)

Clear all hours for a specific project:

```
Before:  [8] [8] [8] [8] [8] [ ] [ ]  → 40h
After:   [0] [0] [0] [0] [0] [ ] [ ]  →  0h
```

- Sets all days to 0 hours
- The project remains in the list
- You'll need to save to sync with Flex

### Remove Project (✕ X Icon)

Remove a project from your time report entirely:

- Removes all hours for that project
- The project is removed from the list
- You'll need to save to sync changes with Flex

---

## Saving Your Time Report

### The Save Button

Located in the bottom-right corner (desktop) or bottom action bar (mobile):

```
┌─────────────────────────────────────────────────────────────┐
│  🟢 8h  🟠 >8h   Target: 40/40h        [✓ Checkmark] [Save] │
└─────────────────────────────────────────────────────────────┘
```

| Button State | Meaning |
|--------------|---------|
| **Save** (active) | You have unsaved changes |
| **Save** (disabled/grayed) | No changes to save |
| **Saving...** | Currently syncing with Flex |

### When to Save

- After entering or modifying any hours
- After using "Fill Full Time" or "Reset"
- After removing a project
- After copying from last week

> **Important:** Unsaved changes will be lost if you navigate away!

---

## Checkmarking Your Hours

Checkmarking indicates you've finalized your hours for the week.

### How to Checkmark

1. Ensure all your hours are entered and saved
2. Click the **"Checkmark"** button
3. A confirmation will appear and your hours are locked

### Checkmark Status

```
┌────────────────────────────────────┐
│ ✓ All Checkmarked                  │  ← Green badge when checkmarked
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ ✕ Not checkmarked                  │  ← Gray badge when not checkmarked
└────────────────────────────────────┘
```

### Uncheckmarking

If you need to make changes after checkmarking:

1. Click the **"Uncheckmark"** button (appears red when checkmarked)
2. Your hours will be unlocked for editing
3. Make your changes and save
4. Checkmark again when done

> **Note:** When hours are checkmarked, the grid becomes read-only and you cannot make changes until you uncheckmark.

---

## Visual Indicators Guide

The time report uses colors and icons to help you understand the status of your entries at a glance.

### Cell Sync Status

| Indicator | Meaning |
|-----------|---------|
| ✓ (green checkmark in cell) | Hours are synced with Flex |
| Slightly faded cell | Hours entered but not yet saved |

### Daily Totals Colors

| Color | Meaning |
|-------|---------|
| 🟢 **Green** (8h) | Perfect! You've logged exactly 8 hours |
| 🟠 **Amber** (>8h) | Overtime - more than 8 hours logged |
| 🔵 **Blue** (<8h) | Under hours - less than 8 hours (weekday) |
| ⚫ **Gray** (0h) | No hours logged or weekend |

### Week Total Colors

| Color | Meaning |
|-------|---------|
| 🟢 **Green** (40h+) | Target reached! Full week logged |
| 🔵 **Blue** (<40h) | Hours logged but under weekly target |

### Special Day Indicators

| Visual Style | Meaning |
|--------------|---------|
| 🔴 **Red background** | Bank holiday - special highlighting |
| **Ring/highlight around cell** | Today's date |
| **Faded/gray background** | Weekend (Saturday/Sunday) |

### Project Row Colors

| Indicator | Meaning |
|-----------|---------|
| **Colored dot** (●) | Project color for easy identification |
| **Red highlighted hours** | Non-working time project (e.g., leave, absence) |

---

## Mobile Usage

On mobile devices, the layout adapts for touch-friendly use.

### Card-Based Layout

Each project appears as a card with its own row of day inputs:

```
┌─────────────────────────────────────────────┐
│ ● Project Name                    40h ⏰ 🔄 ✕│
├─────────────────────────────────────────────┤
│   M    T    W    T    F    S    S           │
│  [8]  [8]  [8]  [8]  [8]  [ ]  [ ]          │
└─────────────────────────────────────────────┘
```

### Fixed Bottom Action Bar

The main actions are always accessible at the bottom of the screen:

```
┌─────────────────────────────────────────────┐
│       [   Save   ] [Checkmark] [🔄]          │
└─────────────────────────────────────────────┘
```

### Touch-Friendly Inputs

- Number inputs open the numeric keyboard
- Supports decimal values (use 0.5 increments)
- Tap and type for quick entry

---

## Quick Stats

At the bottom of the page, you'll find summary statistics:

| Stat | Description |
|------|-------------|
| **Total Hours** | Sum of all hours logged this week |
| **Projects** | Number of projects with time entries |
| **Avg per Day** | Average hours per working day (weekTotal / 5) |
| **Target Progress** | Percentage toward 40-hour target |

---

## Tips & Best Practices

1. **Save frequently** - Don't lose your work!
2. **Use "Copy from last week"** for consistent schedules
3. **Use "Fill Full Time"** for full-day projects
4. **Check the sync indicators** - ensure the ✓ appears after saving
5. **Checkmark only when finished** - it locks your entries
6. **Review bank holidays** - they're highlighted in red
7. **Watch the colors** - green means you're on target

---

## Troubleshooting

### "Save button is disabled"
- You have no unsaved changes
- Check if hours are already synced (✓ indicator)

### "Cannot edit hours"
- You may have checkmarked the week - click "Uncheckmark"
- You may be viewing a past week (read-only)

### "Copy from last week shows no data"
- The previous week has no time entries
- Enter hours manually or check an earlier week

### "Hours not syncing"
- Ensure you clicked Save
- Check your internet connection
- Refresh the page and try again

---

## Legend Summary

| Icon | Name | Action |
|------|------|--------|
| ◀ ▶ | Navigation Arrows | Navigate between weeks |
| 📅 | Calendar | Current week indicator |
| ➕ | Plus | Add project dropdown |
| 📋 | Copy | Copy from last week |
| ⏰ | Clock | Fill 8h for Mon-Fri |
| 🔄 | Rotate | Reset all hours for project |
| ✕ | X | Remove project |
| 💾 | Save | Save changes to Flex |
| ✓ | Checkmark | Mark hours as final |

---

*Last updated: January 2026*
