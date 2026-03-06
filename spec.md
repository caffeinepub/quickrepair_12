# QuickRepair

## Current State
- 4 page React SPA: Home, BookingPage, MechanicRegisterPage, ThankYouPage
- Brand colors: Yellow #FFD700, Orange #ff8c42, dark navy #1a1a2e background
- Forms submit to pandeyxkanha@gmail.com via FormSubmit
- Service cards on HomePage link to /book (no pre-selection)
- ThankYouPage plays a simple 2-tone beep sound
- No admin panel, no favicon, contact section shows only pandeyxkanha@gmail.com
- MechanicRegisterPage has no thank you animation/sound

## Requested Changes (Diff)

### Add
- Favicon: QuickRepair lightning bolt logo (generated image, referenced in index.html)
- Admin Panel page at /admin route:
  - Password-protected login (hardcoded local password, no backend needed)
  - Dashboard showing: total bookings count (localStorage), recent bookings list, mechanic registrations list
  - Bookings stored in localStorage when form is submitted (intercept submit via JS before FormSubmit)
  - Admin can view Name, Phone, Service, Address, Time for each booking
  - Admin can view mechanic registrations: Name, Phone, Service Type, Experience
  - Clean table UI with delete/clear functionality
  - Logout button
- Contact section: Add quickrepairhelp@gmail.com as a second visible email (support email)
- Success sound upgrade: Google Pay style — ascending 3-note chime (D5→F#5→A5), louder gain 0.5, sine wave with fast attack and smooth decay, energetic and punchy
- Service card "Book Now" button: pass selected service name via URL query param (?service=Basic+Electrician)
- BookingPage: read `?service=` query param, pre-fill service dropdown, make it read-only (disabled select or visual lock), hide the change option, show a lock badge "Service locked — go back to change"
- Mechanic ThankYou: MechanicRegisterPage submits to /thankyou (already does), ThankYouPage already plays sound + shows tick — this works for both. Confirm mechanic form _next also points to /thankyou.
- Website color enhancements: Add gradient accents, teal/cyan accent (#00d4aa) for stat highlights and "Available Now" badge, deep purple tint (#6c3ce1) for subtle section dividers, more vibrant card hover states

### Modify
- HomePage ServiceCard: "Book Now" button navigates to /book?service=<serviceName>
- BookingPage: read URL param, pre-select + lock service dropdown
- ThankYouPage: Upgrade sound function to Google Pay style chime
- Contact section: Add support email row with quickrepairhelp@gmail.com
- Footer: Also show quickrepairhelp@gmail.com as support email
- index.html: Add favicon link tag
- index.css: Add teal accent color tokens, more vibrant gradients, enhanced card shadows

### Remove
- Nothing removed

## Implementation Plan
1. Generate favicon image (lightning bolt on orange circle)
2. Add favicon link to index.html
3. Add Admin Panel page (AdminPage.tsx) with localStorage-based booking storage
4. Add /admin route to App.tsx
5. Modify ServiceCard Book Now to pass ?service= query param
6. Modify BookingPage to read and lock service from URL param
7. Update ThankYouPage sound to Google Pay 3-note ascending chime
8. Add quickrepairhelp@gmail.com to Contact section and Footer
9. Enhance CSS with teal accent, gradient improvements, color additions
10. Validate and deploy
