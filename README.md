# Team Task Manager

A full-stack web application for managing projects and tasks with role-based access control (RBAC).

## Features

- **Authentication**: Custom Signup and Login with Credentials using NextAuth.js.
- **Role-Based Access Control**: Admins can manage projects and delete tasks, while Members can view projects and manage their assigned tasks.
- **Projects & Tasks**: Full CRUD operations for project and task management.
- **Dashboard**: High-level overview of total projects, tasks, and overdue items.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui.
- **Backend**: Next.js Server Actions, NextAuth.js.
- **Database**: Prisma ORM with PostgreSQL (or SQLite locally).

## Local Development

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your `.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Run Prisma database push: `npx prisma db push`.
5. Start the development server: `npm run dev`.

## Deployment to Railway

This application is ready to be deployed to Railway out-of-the-box.

1. Go to [Railway](https://railway.app/).
2. Create a new project and provision a **PostgreSQL** database.
3. Connect your GitHub repository to Railway to deploy the web application.
4. Add the following environment variables in your Railway web service settings:
   - `DATABASE_URL` (use the connection string from your provisioned Postgres database).
   - `NEXTAUTH_SECRET` (generate a random string).
   - `NEXTAUTH_URL` (the production URL provided by Railway, e.g., `https://your-app.up.railway.app`).
5. Railway will automatically run `npm install`, then trigger the `postinstall` script (`prisma generate`), and finally run `npm run build` to start the app.
