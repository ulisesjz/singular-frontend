
'use server'

import { signIn, signOut } from "@/lib/auth";

export async function doSocialLogin(formData: FormData) {
  const action = formData.get('action') as string;
  await signIn(action, { redirectTo: "/" });
}

export async function doLogout() {
  await signOut({ redirectTo: "/login" });
}