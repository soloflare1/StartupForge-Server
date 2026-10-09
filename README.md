# StartupForge Backend Server

StartupForge is a platform where startup founders can publish startup ideas, build teams, and recruit collaborators. Developers, designers, marketers, and other professionals can explore startup opportunities and apply to join teams. The server backend acts as the core engine connecting startup founders and talented collaborators.

## Tech Stack

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JWT (JSON Web Tokens) with HTTPOnly Cookies & Better Auth
* **Payments:** Stripe API

## Key Features

* **Role-Based Access Control (RBAC):** Secure API endpoints tailored for Founders, Collaborators, and Admins.
* **Stripe Payment Integration:** Automated checkout session creation and transaction logging into the `payments` collection.
* **Advanced Search & Filtering:** Implementation of MongoDB `$regex` for role titles/skills and `$in` operators for work types and industries.
* **Server-Side Pagination:** Efficient data retrieval and pagination for opportunity browsing endpoints.
* **Secure Authentication & Middleware:** Protected routes using JWT verification and isolated environment variables.

## Environment Variables

Create a `.env` file in the root of the server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173

```

## Installation & Running

```bash
npm install
npm run dev

```