import { AuthPanel } from "@/components/auth-panel";
import { Nav } from "@/components/nav";
import { Panel } from "@/components/ui";
export default function AuthPage(){return <div className="min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950"><Nav/><main className="mx-auto grid max-w-md px-4 py-16"><Panel><h1 className="text-3xl font-semibold tracking-tight">Sign in to QRSpark</h1><p className="mt-2 text-sm text-zinc-500">Use magic link or Google OAuth to access your private QR workspace.</p><div className="mt-6"><AuthPanel/></div></Panel></main></div>}
