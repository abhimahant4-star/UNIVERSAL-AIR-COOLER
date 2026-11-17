import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Flash } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const newEnquiries = await prisma.enquiry.count({ where: { status: "NEW" } });
  return (
    <AdminShell name={session.name} newEnquiries={newEnquiries}>
      <Suspense>
        <Flash />
      </Suspense>
      {children}
    </AdminShell>
  );
}
