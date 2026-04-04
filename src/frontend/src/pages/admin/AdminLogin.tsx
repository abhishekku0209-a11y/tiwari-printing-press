import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Printer } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const ADMIN_ID = "1234tiwari";
const ADMIN_PASSWORD = "123456";

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuthenticated", "true");
      onLogin();
    } else {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mb-4 shadow-card">
              <Printer className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-extrabold text-navy tracking-tight">
              Tiwari Printing Press
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
                Admin ID
              </Label>
              <Input
                type="text"
                placeholder="Enter admin ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="username"
                data-ocid="admin.input"
                className="border-border focus:border-gold"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                data-ocid="admin.input"
                className="border-border focus:border-gold"
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                data-ocid="admin.error_state"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              data-ocid="admin.submit_button"
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl py-5 text-base"
            >
              {loading ? "Verifying..." : "Login to Dashboard"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            &copy; {new Date().getFullYear()} Tiwari Printing Press
          </p>
        </div>
      </motion.div>
    </div>
  );
}
