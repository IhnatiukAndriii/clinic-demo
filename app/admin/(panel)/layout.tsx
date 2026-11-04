import Link from "next/link";
import { signOut } from "@/app/admin/login/actions";
import { secondaryButton } from "@/components/admin/styles";
import { requireUser } from "@/lib/auth";

export const metadata = { robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { user } = await requireUser();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <nav aria-label="Admin" className="mb-10 flex flex-wrap items-center gap-6 border-b border-line pb-4">
        <Link href="/admin/clinics" className="font-medium hover:text-accent">Clinics</Link>
        <Link href="/admin/enquiries" className="font-medium hover:text-accent">Quote requests</Link>
        <span className="ml-auto text-sm text-muted">{user.email}</span>
        <form action={signOut}>
          <button type="submit" className={secondaryButton}>Sign out</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
