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
- **Database**: Prisma ORM with SQLite.

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

## Deployment to Railway (with SQLite)

This application is configured to use **SQLite** and deploy instantly on Railway.

> **Important**: Since SQLite saves data to a file, you must add a Persistent Volume in Railway so your database doesn't reset on every deployment.

1. Go to [Railway](https://railway.app/).
2. Create a new project and select **Deploy from GitHub repo**.
3. Choose your repository.
4. **Add a Volume**:
   - Go to your app's **Settings** > **Volumes**.
   - Create a volume and mount it to `/app/data`.
5. Add the following environment variables in your Railway web service settings:
   - `DATABASE_URL="file:/app/data/sqlite.db"`
   - `NEXTAUTH_SECRET="your-random-secure-string"`
   - `NEXTAUTH_URL="https://your-app.up.railway.app"` (Replace with your actual Railway domain).
6. Deploy! The start script will automatically configure the SQLite database inside the persistent volume.
