type Logger = (message: string) => void;

export function logPublicScan(
  {
    slug,
    destination,
  }: {
    slug: string;
    destination: URL;
    userAgent?: string;
  },
  logger: Logger = console.info,
) {
  logger(JSON.stringify({ event: "scan", slug, destinationHost: destination.hostname }));
}

export function logPublicConversion(
  {
    slug,
    eventName,
  }: {
    slug: string;
    eventName: string;
    value?: number;
  },
  logger: Logger = console.info,
) {
  logger(JSON.stringify({ event: "conversion", slug, name: eventName }));
}
