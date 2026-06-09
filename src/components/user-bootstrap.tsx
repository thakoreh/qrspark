"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function UserBootstrap() {
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);

  useEffect(() => {
    ensureCurrentUser().catch(() => {
      // Auth may still be loading; dashboard queries safely render empty states.
    });
  }, [ensureCurrentUser]);

  return null;
}
