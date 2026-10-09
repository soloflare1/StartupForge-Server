# StartupForge Backend Server

Node.js, Express, and MongoDB backend for StartupForge platform, handling authentication, startup registrations, opportunity postings, applications, and Stripe payment integration.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JWT (JSON Web Tokens) with Cookies
* **Payments:** Stripe API

## Environment Variables
Create a `.env` file in the root of the server directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=vercel_url