"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { login, type LoginState } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-light-sm.webp" alt="Universal Air Cooler logo" width={520} height={325} className="h-20 w-auto" />
          <h1 className="mt-4 text-xl font-extrabold">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500">Universal Air Cooler</p>
        </div>
        <form action={action} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="username" className="input" />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
          </div>
          {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{state.error}</p>}
          <button className="btn-primary w-full py-3" disabled={pending}>
            <Lock className="h-4 w-4" /> {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
