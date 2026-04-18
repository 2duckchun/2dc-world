"use client"

import {
  LogInIcon,
  LogOutIcon,
  PencilLineIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react"
import Link from "next/link"
import { signIn, signOut } from "next-auth/react"
import type { ViewerSession } from "@/core/auth"
import { Button } from "@/shared/ui/button"

type AuthStatusControlsProps = {
  session: ViewerSession
}

export function AuthStatusControls({ session }: AuthStatusControlsProps) {
  if (!session.isAuthenticated) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => signIn("github")}
      >
        <LogInIcon />
        <span>Sign in with GitHub</span>
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {session.isOwner ? (
          <ShieldCheckIcon className="size-4 text-primary" />
        ) : (
          <UserIcon className="size-4" />
        )}
        <span className="font-medium text-foreground">
          {session.user?.name ?? session.user?.email}
        </span>
      </div>
      {session.isOwner ? (
        <Link
          href="/write"
          className="inline-flex h-7 items-center justify-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-all hover:bg-muted hover:text-foreground"
        >
          <PencilLineIcon className="size-3.5" />
          <span>Write</span>
        </Link>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => signOut()}
      >
        <LogOutIcon />
        <span>Sign out</span>
      </Button>
    </div>
  )
}
