"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { getPublicConvexUrl } from "@/lib/env";
import { ThemeProvider } from "@/components/theme-provider";

const convexUrl = getPublicConvexUrl();
const convex = new ConvexReactClient(convexUrl);
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function ConvexClerkBridge({ children }: { children: ReactNode }) {
  return <ConvexProviderWithClerk client={convex} useAuth={useAuth}>{children}</ConvexProviderWithClerk>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const themed = <ThemeProvider>{children}</ThemeProvider>;

  if (!clerkKey) {
    return <ConvexProvider client={convex}>{themed}</ConvexProvider>;
  }

  return (
    <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
      <ConvexClerkBridge>{themed}</ConvexClerkBridge>
    </ClerkProvider>
  );
}
