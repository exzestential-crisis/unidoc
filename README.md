# UniDoc

UniDoc is a web-based doctor appointment booking platform designed to help patients find and book appointments with local doctors easily. It supports features like doctor search by location and specialization, appointment scheduling, patient reviews, and a subscription model for enhanced functionality.

## Features

### For Patients

- Symptom-based doctor specialization suggestions (basic onboarding checklist)
- Search doctors by geolocation, rating, specialization, and hospital affiliation
- Book available appointment slots
- Leave reviews and ratings for doctors
- Subscription options for requesting unavailable slots, priority bookings, and ad-free experience

### For Doctors

- Dashboard to manage patient appointments
- Accept or decline appointment requests
- Manage availability with a calendar scheduler
- Subscription options for enhanced features like analytics and featured profile badges

### For Admins

- Manage doctor verifications
- Oversee users and appointments
- Promote doctors and manage platform content

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Authentication, Realtime)
- **Deployment:** Vercel or other hosting provider

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project setup

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/exzestential-crisis/unidoc.git
   cd unidoc
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---

_UniDoc — Simplifying healthcare, one appointment at a time._

```

---
```
