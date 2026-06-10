const LOCAL_CONVEX_URL = "http://127.0.0.1:3210";

type EnvLike = {
  NODE_ENV?: string;
  NEXT_PUBLIC_CONVEX_URL?: string;
};

export function isProductionRuntime(env: EnvLike = process.env) {
  return env.NODE_ENV === "production";
}

export function getPublicConvexUrl(env: EnvLike = process.env) {
  const url = env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (url) return url;
  if (isProductionRuntime(env)) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is required in production");
  }
  return LOCAL_CONVEX_URL;
}
