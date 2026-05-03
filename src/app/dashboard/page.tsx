import { getProjects, getUsers } from "@/app/actions";
import DashboardClient from "@/components/DashboardClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const projects = await getProjects();
  const users = await getUsers();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <DashboardClient projects={projects} users={users} currentUser={session.user} />
    </div>
  );
}
