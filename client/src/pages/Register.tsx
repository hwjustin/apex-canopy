import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Nav } from "@/components/Nav";
import { useAuth } from "@/contexts/AuthProvider";

export default function Register() {
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(email, password, name);
      toast.success("Welcome to Canopy!");
      navigate("/submit");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Nav />
      <main className="container flex max-w-md flex-col gap-8 py-16">
        <div>
          <h1 className="text-3xl font-extrabold">Join Canopy</h1>
          <p className="mt-2 text-sm text-black/60">
            A directory of founders building cool things. Post your project, find your people.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Your name</Label>
            <Input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-black/50">At least 6 characters. No email verification for now.</p>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="text-sm text-black/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-black underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </main>
    </>
  );
}
