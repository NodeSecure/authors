// Import Third-party Dependencies
import dayjs from "dayjs";

const domainsInformations = {};
const kMaxLastActivityDiffInYears = 2;

export function storeDomainExpirationInMemory({ domain, expirationDate }) {
  domainsInformations[domain] = expirationDate;
}

export function getDomainExpirationFromMemory(domain) {
  return domainsInformations[domain] ?? undefined;
}

export function hasBeenActive(date) {
  const diffTimeInYears = dayjs(new Date()).diff(dayjs(new Date(date)), "year");

  return diffTimeInYears <= kMaxLastActivityDiffInYears;
}
