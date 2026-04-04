import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("adminAuthenticated") === "true",
  );

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}
