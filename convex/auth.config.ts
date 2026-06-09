const clerkJwtIssuerDomain = process.env["CLERK_JWT_ISSUER_DOMAIN"];

const providers = clerkJwtIssuerDomain
  ? [
      {
        domain: clerkJwtIssuerDomain,
        applicationID: "convex",
      },
    ]
  : [];

const authConfig = { providers };

export default authConfig;
