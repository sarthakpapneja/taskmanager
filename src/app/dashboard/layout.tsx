import NextAuthProvider from "@/components/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </main>
      </div>
    </NextAuthProvider>
  );
}
