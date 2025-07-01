This is the backend service for the docreader guide platform.

## About

This project is a RESTful backend API for the docreader guide platform.
It is built using Node.js, Express and Prisma.

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- postgresql running locally or remotely

### Installation

```
git clone https://github.com/asaber3030/nodejs-docreader-faculty
cd nodejs-docreader-faculty
npm install
```

---

## Environment Variables

`APP_PORT` The port on which the server listens.

`APP_USER_SECRET` The secret used for signing the JWT.

`PASSCODE` The passcode that a user needs to provide to be authorized to create new admins.

Create a `.env` file in the root directory and configure the following:

```env
APP_PORT=port
APP_USER_SECRET=JWT_secret
PASSCODE=passcode
```
