"use server"

import { signIn, signOut } from "@/auth"

export const signInWithGitHub = async () => {
  await signIn("github", { redirectTo: "/" })
}

export const signOutCurrentUser = async () => {
  await signOut({ redirectTo: "/" })
}
