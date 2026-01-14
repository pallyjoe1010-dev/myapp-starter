export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ color: "red" }}>
        🔴 DEBUG MODE — Layout is rendering
      </h2>
      {children}
    </div>
  );
}
