"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("global_error_boundary", { digest: error.digest, message: error.message });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-[100dvh] bg-zinc-50 text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <main className="grid min-h-[100dvh] place-items-center px-4 py-12">
          <section className="max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
              Something went wrong
            </p>
            <title>QRSpark error</title>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              QRSpark hit an unexpected problem.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Try again in a moment. If this keeps happening, the error digest can help us find the server log.
            </p>
            {error.digest ? (
              <p className="mt-4 rounded-md bg-zinc-100 px-3 py-2 font-mono text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {error.digest}
              </p>
            ) : null}
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => unstable_retry()}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition active:scale-[0.98] dark:bg-white dark:text-zinc-950"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition active:scale-[0.98] dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
              >
                Go home
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
