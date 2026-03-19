# Blood & Organ Donation Platform

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Authentication: Sign up / Sign in with user profile (name, email, password, blood type, age, contact info)
- Donor Registration Form: Full form with personal info, donation type (blood/organ/both), blood type, organ selection, medical history acknowledgment, emergency contact
- Nearby Locations Page: Browse/search blood banks and organ donation centers; filter by donation type and city; show name, address, phone, hours, available blood types
- Donor Directory Page: Public listing of donors with privacy-safe info (first name, blood type, donation type, date, center); filter/search by blood type, organ type, date
- Dashboard: Post-login view with donation history, upcoming appointments, profile summary
- Home Page: Hero with live stats (total donors, lives saved, blood units), CTAs to register or find a center, info sections on blood and organ donation importance
- Sample data pre-populated for locations, donors, and donation records

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend (Motoko):
   - User store: register, login (via authorization component), profile get/update
   - Donor registration: create and get donor profiles
   - Donation records: create, list by user, list all (public/filtered)
   - Donation centers: create, list, filter by city and type
   - Stats query: total donors, lives saved, blood units
   - Seed sample data (centers, donors, records)

2. Frontend:
   - Home page with hero stats, CTAs, info sections
   - Auth pages (sign in / sign up)
   - Donor registration form (multi-section)
   - Nearby locations page with search and filters
   - Donor directory page with search and filters
   - Dashboard (history, appointments, profile)
   - Navigation with auth state awareness
