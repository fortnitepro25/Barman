BARMAN

A modern bar management platform.

BARMAN is a full-stack web application designed to help bar owners manage their business in one place. The project aims to bring bar management, reservations, menu management, and events together in a single platform.

    🚧 Status: In development

Features

    User accounts — Registration, login, and secure authentication.

    Bar management — Create and customize a bar profile.

    Reservations — Manage customer bookings and reservation statuses.

    Menu management — Manage drinks, food items, prices, categories, and availability.

    Events — Create, schedule, and publish bar events.

    Dashboard — Access bar management features from one place.

Features are planned and will be marked as complete as they are implemented.
Tech Stack
Technology	Purpose
React	Frontend UI
Vite	Frontend development server and build tool
Node.js	JavaScript runtime
Express	Backend API
Prisma	Database ORM
SQLite	Database
Project Structure

Barman/
├── client/       # React frontend
├── server/       # Express backend and Prisma
└── .gitignore

Getting Started
Prerequisites

    Node.js

    npm

1. Clone the repository

git clone https://github.com/fortnitepro25/Barman.git
cd Barman

2. Set up the backend

cd server
npm install

Create a .env file inside server/:

DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-with-a-long-random-secret"
PORT=3000

Initialize the database:

npm exec -- prisma migrate dev --name init

Start the backend:

npm run dev

The API runs at http://localhost:3000.
3. Set up the frontend

Open a second terminal:

cd client
npm install
npm run dev

Open the local URL displayed by Vite, usually http://localhost:5173.
Environment Variables
Variable	Description
DATABASE_URL	SQLite database connection string
SESSION_SECRET	Secret used to secure session cookies
PORT	Backend server port

Development

BARMAN is actively being developed. Features, API endpoints, database models, and the user interface may change as the project evolves.
Contributors

Developed collaboratively by a team of two.
