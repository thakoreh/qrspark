import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-zinc-50 px-4 py-12 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto grid min-h-[calc(100dvh-6rem)] max-w-3xl place-items-center">
        <section className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
            Page not found
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            This QR campaign page is not available.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            The link may have moved, the campaign may not exist, or the URL may have been mistyped.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition active:scale-[0.98] dark:bg-white dark:text-zinc-950"
            >
              Go home
            </Link>
            <Link
              href="/generator"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition active:scale-[0.98] dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
            >
              Create a QR
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
