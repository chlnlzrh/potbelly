### **Website: Restaurant Build - Command Center**



This website is a private, single-user dashboard for Arushi to manage the restaurant build. It is designed to be a personal command center, not a collaborative tool.

------



### **Global Elements**



- **Login:** A simple, full-screen password prompt.
- **Header:** A persistent header at the top of every page.
  - **Left:** Project Title ("Restaurant Build: Command Center")
  - **Right:** Current Date (e.g., "October 21, 2025")
- **Navigation:** A simple text-based menu in the header.
  - `Dashboard` (Home Page)
  - `All Tasks`
  - `Project Library`

------



### **Page 1: Dashboard (Home Page)**



This is the landing page, providing an immediate overview of project health and personal priorities.



#### **Module 1: AI Proactive Assistant**



This module is at the very top of the page. It dynamically displays 1-3 critical, text-based alerts.

- **Smart Priority Alert:** "ACTION NEEDED: You must finalize the **Terrace glass frame material (MS vs aluminum)**. This decision is blocking the vendor order and is on the critical path."
- **Risk Detection Alert:** "RISK DETECTED: Scaffolding installation (Vishal) and Kitchen ducting (Pradeep) are both high-priority and scheduled for Oct 24-25. I recommend confirming with both that this sequence is on track."
- **Dependency Alert:** "ATTENTION: Painting is scheduled to start Friday. Please confirm your decision on the **Terrace wall treatment (paint vs tiles)** before then."



#### **Module 2: My Decision Hub**



This module lists *only* tasks assigned to "Arushi" that are pending a decision.

- **Pending Decisions (High Priority):**
  - Finalize material selection for terrace glass frame (MS vs aluminum)
  - Coordinate kitchen equipment layout meeting
- **Pending Decisions (Medium Priority):**
  - Finalize bar back shell rack design
  - Finalize liquor storage room finishes
  - Decide terrace wall treatment (paint vs tiles)
  - Finalize stairwell wall treatment (wallpaper/photos)



#### **Module 3: Critical Path Watchlist**



A simple, read-only checklist showing the core project sequence.

- `[ ]` Install scaffolding for ceiling work (Vishal - Due Oct 24)
- `[ ]` Complete kitchen ducting to terrace (Pradeep - Due Oct 25)
- `[ ]` Commence painting (Vishal - Due Oct 25)
- `[ ]` Install acoustic panels post-painting (Vishal - Due Nov 1)
- `[ ]` Install electrical fixtures and final fittings (Sandeep - Due Nov 1-2)
- `[ ]` Deliver kitchen equipment post-Diwali (Vendor - Due Nov 5)



#### **Module 4: Urgent Task View**



A dynamic list of all tasks, from all owners, due in the next 3 days.

- (Example for Oct 21):
  - `Due Oct 23:` Finalize terrace glass frame (Arushi)
  - `Due Oct 23:` Finalize liquor storage room finishes (Arushi)
  - `Due Oct 23:` Decide terrace wall treatment (Arushi)
  - `Due Oct 23:` Coordinate kitchen equipment layout meeting (Arushi + Vishal + Team)

------



### **Page 2: All Tasks (The Master List)**



This is the interactive version of the full action item spreadsheet, designed for Arushi to update and filter.



#### **Controls (Top of Page):**



- **Dropdown:** "Filter by Owner:"
  - Options: All, Arushi, Vishal, Sabharwal, Sandeep, Pradeep, Kitchen Equipment Vendor, Bhargav.
- **Dropdown:** "Filter by Status:"
  - Options: All, Not Started, In Progress, Awaiting Decision, Scheduled, Awaiting Prerequisites, Awaiting Vendor, Done.
- **Dropdown:** "Sort by:"
  - Options: Due Date (Default), Priority, Owner.
- **Button:** "Generate Meeting Prep Brief"



#### **AI Function: "Generate Meeting Prep Brief"**



When Arushi selects an owner (e.g., "Vishal") from the filter and clicks this button, a text box appears with a generated summary:

- **"Meeting Brief: Vishal**
  - **High Priority / Critical:** 2 items (Commence painting, Install scaffolding).
  - **In Progress:** 6 items (Handmade tiles, Bathroom fixtures, Terrace waterproofing, etc.).
  - **Not Started:** 8 items (Kota stone flooring, Kitchen layout meeting, Signage, etc.).
  - **Action Needed:** Please get a status update on the 6 'In Progress' items and confirm the 'Not Started' items are on schedule."



#### **Task List:**



A full table of all action items. The "Status" field is interactive.

- **Columns:** Action Item | Owner(s) | Due Date | Priority | Status
- **Interaction:** Arushi can click on any task's "Status" (e.g., "In Progress"). A simple dropdown appears, allowing her to change it to "Not Started," "In Progress," "Blocked," "Awaiting Prerequisites," or "Done."

------



### **Page 3: Project Library (The Reference Binder)**



This page is a clean, read-only repository of all critical project specifications, fronted by an AI Q&A tool.



#### **Module 1: AI Project Librarian**



A simple text input box at the top of the page.

- **Prompt:** "Ask a question about the project..."
- **Example 1:**
  - Arushi types: "What is the roofing material for the terrace?"
  - AI response: "The terrace roofing is a **tensile fabric**. It is being installed by Sandeep and is due Oct 31."
- **Example 2:**
  - Arushi types: "Why is the RO system in the bathroom?"
  - AI response: "The RO (reverse osmosis) system is being installed in the terrace bathroom **due to space constraints**."
- **Example 3:**
  - Arushi types: "What is the finish for the liquor storage room?"
  - AI response: "The approved concept is **black lacquer glass with a decorative design curtain**. Your final approval is pending."



#### **Module 2: Static Reference Library**



Below the AI, the full "Critical Build Information" is organized by clear headings.

- **Bar Area**
  - Tile Type: Handmade custom tiles
  - Bar Back: POV design, integrated wallpaper, shell racks
  - ...etc.
- **Liquor Storage Room**
  - Wall Treatment: Black lacquer glass
  - Shelving: Stainless steel (SS)
  - ...etc.
- **Kitchen Specifications**
  - Ducting Route: Kitchen to terrace level
  - Equipment Status: New equipment fabricated; existing equipment to be reconditioned
  - ...etc.
- **Washing Area (Critical Operational Zone)**
  - Function: Primary washing station
  - Enclosure: Bison board
  - Flooring: Kota stone
  - Ventilation: Two wall-mounted fans
  - ...etc.
- **Bathroom Configuration**
  - Downstairs, Upstairs, and Terrace bathroom details
- **Terrace Level Specifications**
  - Structural/Waterproofing (Fire fighting tank issue)
  - Roofing System (Tensile fabric)
  - Glass Enclosure (Sliding aluminum or MS)
  - ...etc.
- **Sequencing & Dependencies**
  - Critical Path Sequence (Scaffolding -> Ducting -> Painting...)
- **Vendor Coordination Requirements**
  - Joint Finishes Meeting
  - Kitchen Layout Meeting
  - ...etc.