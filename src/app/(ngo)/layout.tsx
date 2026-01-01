import AppShell from "@/components/layout/AppShell";

export default function NgoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
