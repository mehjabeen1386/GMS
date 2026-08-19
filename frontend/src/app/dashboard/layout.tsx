
// Purpose: Simple pass-through layout for dashboard (since global layout handles navbar & sidebar)
// Path: frontend/src/app/dashboard/layout.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}