# Smart Shift Scheduler

A Smart Shift Scheduler that provides role-based access to different pages for admins and employees. This project is built with Vue 3, Vue Router, and uses Pinia for state management.

## Features

- **Login and Registration**: Users can register and log in.
- **Role-Based Access Control (RBAC)**:
  - Admin users can access the admin panel, manage shifts and employees.
  - Employee users can only access the employee dashboard.
- **API Integration**: The application communicates with backend APIs to fetch and post data, including employee details and shift assignments.
- **Authorization**: Users are authenticated with JWT tokens stored in `localStorage`.

## Technologies Used

- [Vue 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) for state management
- [PrimeVue](https://primevue.org/) for UI components and notifications
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Project Structure

```plaintext
src/
├── api/
│   ├── api.js          # API utility functions for GET, POST requests
├── components/
│   └── admin/
│       └── Layout.vue  # Admin layout component
├── pages/
│   ├── Login.vue       # Login page
│   ├── Register.vue    # Registration page
│   ├── admin/
│       ├── Shifts.vue      # Admin shifts management page
│       └── Employees.vue   # Admin employees management page
│   └── employee/
│       └── Dashboard.vue   # Employee dashboard page
├── router/
│   └── index.js        # Vue Router configuration
├── stores/
│   └── auth.js         # Pinia store for authentication
└── App.vue             # Main application component

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn

### Installation
```

1. Clone the repository:
```
git clone https://github.com/hariceiocod/smart-shift-scheduler.git
cd smart-shift-scheduler
```

2. Install dependencies:
```
npm install
```
3. Set up environment variables:

Create a `.env` file in the root directory and configure the necessary API keys and base URLs:

```
VITE_API_BASE_URL=https://your-api-url.com
```

4. Run the application:

```
npm run dev
# or
yarn dev
```
