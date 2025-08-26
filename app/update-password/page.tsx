'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Failed to update password.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/agents"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-8 relative">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <h2 className="text-2xl font-bold">Update Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">Password updated!</p>}
        <Button type="submit" className="w-full">Update</Button>
      </form>
    </div>
  );
}
