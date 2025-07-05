This is the backend service for the docreader guide platform.

## About

This project is a RESTful backend API for the docreader guide platform.
It is built using Node.js, Express and Prisma.

---

## Getting Started

### Prerequisites

- `Node.js` >= 18.x or `bun` >=1.x
- `npm` >= 9.x
- `postgresql` running locally or remotely

### Installation

```
git clone https://github.com/asaber3030/nodejs-docreader-faculty
cd nodejs-docreader-faculty
npm install
npm run start:dev
# or
bun ./api/index.ts
```

---

## Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
APP_PORT=tcp_port
APP_USER_SECRET=secret_for_encrypting_JWTs
PASSCODE=passcode_for_creating_of_new_admins
DATABASE_DEPLOY=database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firebase_storage_bucket
FIREBASE_PRIVATE_KEY=firebase_private_key
FIREBASE_CLIENT_EMAIL=firebase_client_email
```
