'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    router.push('/login');
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-8 relative">
      <form onSubmit={handleRegister} className="space-y-4 w-full max-w-sm">
        <h2 className="text-2xl font-bold">Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}
