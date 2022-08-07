const domainsInformations = {};

export function storeDomainExpirationInMemory({ domain, expirationDate }) {
  domainsInformations[domain] = expirationDate;
}

export function getDomainExpirationFromMemory(domain) {
  return domainsInformations[domain] ?? undefined;
}
