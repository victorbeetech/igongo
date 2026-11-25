# Roles spec

These are the pre-made roles for the Igongo app. **Roles are data, not code.** Each one is a starting template that the super admin can rename, edit, clone or delete in [Roles & Permissions](../modules/02-roles-permissions.md), and new roles (any name, any department) can be created the same way. Nothing here needs a developer to change.

## One app, one entry point

- There is **one Igongo app** for everyone: the board, the CEO, managers, staff, riders and clients. There is no separate staff app, rider app or guest app.
- Everyone opens the same app and uses the **same login screen**. Accounts are registered through the super admin's rules: staff from HR records, clients by sign-up, at the front desk or from a booking.
- After login, the app reads the person's roles and **builds their interface**: menus, home tiles, screens and actions. Two people with different roles see two different apps.
- A person can hold **several roles**, such as Receptionist plus Cashier, or Pool Attendant plus Museum Guide. Their permissions, menus and home tiles add together, so one person sees the pool work and the museum work in one app.
- **The super admin makes the final roles.** These pre-made roles are starting points. The super admin can create any new role, combine duties, split them, rename them and give one person any mix of roles, because only the hotel knows who really does what.
- **Every staff role can switch to the client view** to see the app exactly as a guest sees it, then switch back. Orders made there are marked as staff orders.
- The web portal uses the same roles, for work that suits a big screen.

## How to read a role file

Each role file lists:

- **Purpose**: what the role is for.
- **Reports to**: the role above it, used for approvals and the organisation chart.
- **Home screen tiles**: what the person sees first in the app.
- **Modules, screens and default permissions**: which modules the role can use, which actions, and on whose records.
- **Approval limits**: what it can approve, using tiers.
- **Extra rules**: 2FA, devices, time limits and other conditions.

Every staff role also includes the [Every Staff Member (base role)](staff-base.md), which gives self-service: my attendance, shifts, leave, payslips, meals, notices, chat and fault reporting.

### Actions

view, create, edit, approve, delete, export, comment, like. These are the same in every module.

### Data scope

| Scope | Meaning |
| --- | --- |
| Everything | All records in the module |
| Own department | Records of the role's department |
| Own team | Records of the people who report to this person |
| Assigned to them | Only records assigned to this person, such as their deliveries |
| Own records | Only this person's own records |
| Public items | Items open to the public, such as the menu |

### Approval tiers

Amounts are not written into the code. The super admin sets the amount behind each tier in [Roles & Permissions](../modules/02-roles-permissions.md), and can change them at any time.

| Tier | Meaning |
| --- | --- |
| Tier 1 | Small amounts, such as a small discount or advance |
| Tier 2 | Medium amounts, for department managers |
| Tier 3 | Large amounts, for the GM and CEO |
| Unlimited | Board level |

## The 121 pre-made roles

### System

| Role | Purpose |
| --- | --- |
| [Super Admin](super-admin.md) | Controls and configures the whole system: modules, roles, permissions, screens, forms, workflows, prices, wording and integrations. |
| [Internal Auditor](system-auditor.md) | Reviews records, the audit trail and money flows across all modules without being able to change anything. |

### Leadership

| Role | Purpose |
| --- | --- |
| [Board of Directors](board-of-directors.md) | Oversees the hotel at the highest level with summary reports, board papers and big decisions, including members who represent the shareholders. |
| [Chief Executive Officer](ceo.md) | Leads the whole business, sets direction, and approves the largest decisions below the board. |
| [Senior Manager](senior-manager.md) | Runs a group of departments for the CEO, such as all guest services or all support services, and steps in for the GM when needed. |
| [General Manager (GM)](general-manager.md) | Runs the hotel every day: staff, guests, operations and money. |
| [Assistant General Manager](assistant-gm.md) | Supports the GM and runs the hotel when the GM is away. |

### Department managers

| Role | Purpose |
| --- | --- |
| [Restaurant & F&B Manager](fnb-manager.md) | Runs the restaurants, bars, coffee shops, room service and buffets: menus, service quality, staff and sales. |
| [Executive Chef (Kitchen Head)](executive-chef.md) | Leads the kitchen: menus, food quality, hygiene, prep planning, kitchen staff and food waste. |
| [Events & Conferences Manager](events-manager.md) | Sells and runs weddings, conferences, parties and retreats, from enquiry to post-event report, including wristbands. |
| [Museum & Cultural Centre Manager](museum-manager.md) | Runs the Eriijukiro Museum, the cultural village, tours, performances and school visits. |
| [Front Office Manager](front-office-manager.md) | Runs reception, reservations, guest relations, concierge and porters, working alongside APEX. |
| [Executive Housekeeper](housekeeping-manager.md) | Keeps every room and public area clean, inspected and ready, and runs laundry. |
| [Pool Supervisor](pool-manager.md) | Runs the pools safely: passes, memberships, lifeguards, water quality and lessons. |
| [Spa Manager (Humura)](spa-manager.md) | Runs the Humura spa: treatments, therapists, bookings and memberships. |
| [Crafts & Bookshop Manager](crafts-manager.md) | Runs the craft shop and bookshop: products, artisans, sales and online orders. |
| [Security Manager](security-manager.md) | Keeps people and property safe: gates, guards, patrols, zones, visitors, keys and incidents. |
| [Maintenance Manager (Chief Engineer)](maintenance-manager.md) | Keeps the buildings, power, water, plumbing, equipment and vehicles working, and plans preventive maintenance. |
| [HR Manager](hr-manager.md) | Runs everything about people: enrolment, contracts, attendance rules, leave, training, discipline, welfare and exits. |
| [Finance & Accounts Manager](finance-manager.md) | Controls money: payments, receipts, cash-ups, petty cash, payroll review, accounting exports and credit accounts. |
| [IT Manager](it-manager.md) | Looks after devices, networks, cards and printers, and supports the super admin. |
| [Sales & Marketing Manager](sales-marketing-manager.md) | Brings in business: corporate clients, packages, campaigns, promotions, website content and reviews. |
| [Delivery & Transport Manager](logistics-manager.md) | Runs food delivery, riders, dispatch, hotel vehicles and guest transfers. |

### Supervisors and officers

| Role | Purpose |
| --- | --- |
| [Department Supervisor (template)](department-supervisor.md) | A starting point for any shift or section supervisor. |
| [Sous Chef](sous-chef.md) | Runs the kitchen on a shift and stands in for the Executive Chef. |
| [Restaurant Supervisor](restaurant-supervisor.md) | Runs the dining room on a shift: tables, waiters, voids and guest issues. |
| [Housekeeping Supervisor](housekeeping-supervisor.md) | Assigns rooms to attendants and inspects rooms before they are released. |
| [Security Supervisor](security-supervisor.md) | Runs a security shift: guards, patrols, gate and incidents. |
| [Events Coordinator](events-coordinator.md) | Runs individual events on the day: setup, run sheet, wristbands, guest list and teams. |
| [HR Officer](hr-officer.md) | Does daily HR work: enrolling staff, documents, cards, leave records and attendance corrections. |
| [Payroll Officer](payroll-officer.md) | Prepares payroll, advances and statements, for review and approval by others. |
| [Accountant](accountant.md) | Records and checks money: receipts, invoices, credit accounts, petty cash and exports. |
| [Reservations Officer](reservations-officer.md) | Handles room, table, museum, pool, spa and event bookings from all channels. |
| [Guest Relations Officer](guest-relations-officer.md) | Looks after guests' happiness: VIPs, feedback, complaints and loyalty. |
| [IT Support Officer](it-support.md) | Sets up devices and printers, prints cards and helps staff with app problems. |
| [Delivery Dispatcher](dispatcher.md) | Assigns deliveries to riders and watches them until delivered. |
| [Sales Executive](sales-executive.md) | Finds and looks after corporate, event and group clients. |
| [Museum Curator](museum-curator.md) | Looks after the collection and exhibits, writes exhibit content and audio guides. |
| [Night Auditor](night-auditor.md) | Checks the day's takings, bills and room charges overnight and closes the day. |
| [Health and Safety Officer](health-safety-officer.md) | Runs safety inspections, fire drills and incident follow-up. |
| [Procurement Officer](procurement-officer.md) | Buys for the hotel: quotes, purchase orders and supplier follow-up. |
| [Credit Controller](credit-controller.md) | Follows up corporate balances, invoices and deposits. |
| [Social Media and Content Officer](social-media-officer.md) | Posts on social media, answers reviews and runs campaigns. |
| [Personal Assistant to the GM](personal-assistant.md) | Manages the GM's diary, meetings and correspondence. |
| [Board Secretary](company-secretary.md) | Prepares board papers, minutes and resolutions. |
| [Tours and Experiences Coordinator](tour-coordinator.md) | Plans tours and cultural experiences and books guides and performers. |

### Everyone

| Role | Purpose |
| --- | --- |
| [Every Staff Member (base role)](staff-base.md) | The base role that every staff account gets automatically. |

### Frontline staff

| Role | Purpose |
| --- | --- |
| [Receptionist](receptionist.md) | Welcomes guests, handles front desk requests, registers walk-in clients and visitors, and takes payments at reception. |
| [Concierge Agent (WhatsApp and chat)](concierge-agent.md) | Answers guests on WhatsApp and in-app chat, books and orders for them, and passes requests to departments. |
| [Porter / Bell Attendant](porter.md) | Carries luggage, escorts guests and handles small guest requests. |
| [Room Attendant](room-attendant.md) | Cleans and prepares guest rooms and updates each room's status. |
| [Cleaner (public areas)](cleaner.md) | Cleans public areas, offices, washrooms and grounds paths on a schedule. |
| [Laundry Attendant](laundry-attendant.md) | Washes linen, uniforms and guest laundry, and keeps linen counts. |
| [Chef (Chef de Partie)](chef.md) | Runs a kitchen station, such as grill or pastry, and prepares orders from the kitchen display. |
| [Cook](cook.md) | Prepares food, including staff meals and buffets, following the kitchen display and production lists. |
| [Kitchen Steward](kitchen-steward.md) | Keeps the kitchen, dishes and equipment clean and reports broken equipment. |
| [Waiter / Waitress](waiter.md) | Serves guests at tables, by the pool and at events, taking orders and payments on their phone. |
| [Bartender](bartender.md) | Prepares and sells drinks at the bars, which are sold as menu items. |
| [Barista](barista.md) | Makes and sells coffee and snacks at the coffee shops. |
| [Cashier](cashier.md) | Takes payments at an outlet, issues receipts and does the end-of-shift cash-up. |
| [Delivery Rider](delivery-rider.md) | Picks up orders from the kitchen and delivers them, using the rider screens in the same Igongo app. |
| [Driver](driver.md) | Drives hotel vehicles for guest transfers, staff and errands. |
| [Gatekeeper](gatekeeper.md) | Controls the main gate: staff clock-in station, visitors, vehicles and deliveries. |
| [Security Guard](security-guard.md) | Patrols the grounds, guards zones and events, and reports incidents. |
| [Electrician](electrician.md) | Fixes and maintains power, lighting, the generator and electrical equipment. |
| [Plumber](plumber.md) | Fixes leaks, drains, taps, toilets and pipework. |
| [Water Systems Technician](water-technician.md) | Looks after water supply, tanks, pumps, boreholes, water treatment and the pool plant. |
| [Carpenter](carpenter.md) | Repairs doors, windows, furniture and wooden structures. |
| [General Maintenance Technician](maintenance-technician.md) | Handles general repairs, painting, glass, AC and anything not covered by a specialist. |
| [Groundskeeper / Gardener](groundskeeper.md) | Keeps the gardens, lawns, compound and cultural village grounds tidy. |
| [Lifeguard](lifeguard.md) | Keeps swimmers safe, checks entries and records water tests and incidents. |
| [Spa Therapist](spa-therapist.md) | Gives treatments and keeps the treatment rooms ready. |
| [Museum Guide](museum-guide.md) | Leads tours of the museum, cultural village and monuments, and checks tickets. |
| [Cultural Performer](cultural-performer.md) | Performs dance, music and cultural experiences for guests and events. |
| [Shop Attendant](shop-attendant.md) | Sells crafts, books and souvenirs and packs online orders. |
| [Store Keeper](store-keeper.md) | Keeps the stores: receives deliveries, issues stock against approved requisitions, runs counts, and signs assets, uniforms, linen and keys in and out. |
| [Casual Worker](casual-worker.md) | A short-term or daily worker, such as extra event staff. |
| [Intern / Trainee](intern.md) | A learner placed in a department, with view access to their department's work and their training plan. |
| [Pool Attendant](pool-attendant.md) | Keeps the pool area clean and ready: towels, loungers, entry checks and pool-side orders. |
| [Pool Plant Operator](pool-plant-operator.md) | Runs pumps, filters and dosing, and records water tests and plant checks. |
| [Swimming Instructor](swimming-instructor.md) | Teaches swimming lessons and keeps lesson registers. |
| [Museum Ticket Attendant](museum-attendant.md) | Sells and scans museum tickets and welcomes visitors at the entrance. |
| [Craftsperson / Artisan in Residence](craftsperson.md) | Makes and demonstrates crafts, runs craft experiences for guests. |
| [Bookshop Assistant](bookshop-assistant.md) | Sells books and souvenirs and keeps the shelves. |
| [Switchboard / Call Centre Agent](switchboard-operator.md) | Answers calls, takes phone orders and bookings, and passes messages. |
| [Room Service Attendant](room-service-attendant.md) | Takes room service orders and delivers them to rooms. |
| [Food Runner](food-runner.md) | Carries food from the pass to tables, rooms and events. |
| [Restaurant Host / Hostess](host-hostess.md) | Greets diners, manages reservations, the waiting list and seating. |
| [Buffet Attendant](buffet-attendant.md) | Checks buffet entry, refills the buffet and records waste. |
| [Staff Canteen Attendant](canteen-attendant.md) | Serves staff meals and confirms each claim with a card tap. |
| [Pastry Chef / Baker](pastry-chef.md) | Makes bread, pastries and desserts for outlets and events. |
| [Butcher](butcher.md) | Prepares meat and keeps the cold room in order. |
| [Dishwasher / Kitchen Porter](dishwasher.md) | Washes dishes and pots and keeps the kitchen clean. |
| [Banquet and Setup Crew](banquet-staff.md) | Sets up and clears venues for events and conferences. |
| [Sound and AV Technician](av-technician.md) | Runs sound, lights, projectors and microphones for events. |
| [Decorator](decorator.md) | Decorates venues and rooms for events and special stays. |
| [Wristband Desk Attendant](wristband-desk.md) | Hands out, links and collects event wristbands at the desk. |
| [Linen Keeper](linen-keeper.md) | Issues and counts linen and uniforms between the laundry and departments. |
| [Tailor](tailor.md) | Repairs and alters uniforms, linen and guest clothing. |
| [Minibar Attendant](minibar-attendant.md) | Checks and refills minibars and amenities in rooms. |
| [Pest Control Officer](pest-control.md) | Carries out pest control rounds and records treatments. |
| [Generator and Power Operator](generator-operator.md) | Runs and checks generators, solar, power changeovers and fuel levels. |
| [Refrigeration and AC Technician](refrigeration-technician.md) | Maintains fridges, cold rooms, freezers and air conditioning. |
| [Painter / Mason](painter-mason.md) | Paints, plasters and repairs walls, floors and buildings. |
| [Mechanic](mechanic.md) | Services and repairs hotel vehicles, mowers and machines. |
| [Parking Attendant](parking-attendant.md) | Directs and records vehicles in the car park. |
| [Night Watchman](night-watchman.md) | Patrols at night and reports incidents. |
| [CCTV Operator](cctv-operator.md) | Watches the cameras and raises incidents and alerts. |
| [Nurse / First Aider](first-aider.md) | Gives first aid to guests and staff and records each case. |
| [Photographer](photographer.md) | Takes photos and videos of events, rooms and food for marketing. |
| [Office Assistant / Messenger](office-assistant.md) | Runs errands, delivers documents and helps offices. |
| [Kids Club Attendant](kids-club-attendant.md) | Looks after children in the play area and kids' activities. |
| [Volunteer](volunteer.md) | A short-term helper with access only to assigned tasks and events. |

### Guests and clients

| Role | Purpose |
| --- | --- |
| [Guest / Client](guest.md) | Any visitor or customer: hotel guests, diners, museum visitors, swimmers, spa clients, shoppers and event guests. |
| [Corporate Booker](corporate-client.md) | A person who books for a company, NGO, government office or school, using the company's account and agreed terms. |
| [Event Client / Organiser](event-organiser.md) | The client who booked an event, such as a wedding or conference, who manages their own guest list and follows the plan. |

### Partners and suppliers

| Role | Purpose |
| --- | --- |
| [Supplier](supplier.md) | An outside supplier who sees their purchase orders, deliveries and payments, and books deliveries. |
| [Contractor](contractor.md) | An outside company or worker doing a job on site, with a pass, work orders and safety briefing. |
| [Event Vendor](event-vendor.md) | A caterer, decorator, DJ or photographer working at an event booked at Igongo. |
| [Artisan / Consignor](artisan-partner.md) | A maker who sells through the crafts shop and sees their sales and balance. |
| [Delivery Partner Rider](delivery-partner.md) | A rider from an outside delivery company, with the same rider screens limited to assigned orders. |

