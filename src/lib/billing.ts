export function billingPortalCustomerForUser(user: {
  stripeCustomerId?: string | null;
  requestedCustomerId?: string | null;
}) {
  const customerId = user.stripeCustomerId?.trim();
  return customerId || null;
}
