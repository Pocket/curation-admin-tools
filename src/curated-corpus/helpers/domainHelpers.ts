import { parse } from 'tldts';

export interface DomainInfo {
  /**
   * Full hostname without a leading "www" when a subdomain exists
   * (e.g., "news.example.com"), null if none.
   */
  subdomainHostname: string | null;
  /** Registrable domain (e.g., "example.com") */
  registrableDomain: string | null;
}

/**
 * Extracts domain information from a URL string.
 * Uses tldts library for accurate parsing of domains including multi-level TLDs.
 *
 * Note: IDN domains (internationalized domain names) are displayed in their
 * ASCII punycode form (e.g., "xn--trn-sna.de" instead of "törn.de").
 *
 * @param url - Full URL string (e.g., "https://news.example.com/article")
 * @returns DomainInfo object with subdomain hostname and registrable domain
 *
 * @example
 * extractDomainInfo("https://news.example.com/article")
 * // Returns: { subdomainHostname: "news.example.com", registrableDomain: "example.com" }
 *
 * @example
 * extractDomainInfo("https://example.com/article")
 * // Returns: { subdomainHostname: null, registrableDomain: "example.com" }
 *
 * @example
 * extractDomainInfo("https://news.bbc.co.uk/article")
 * // Returns: { subdomainHostname: "news.bbc.co.uk", registrableDomain: "bbc.co.uk" }
 */
export function extractDomainInfo(url: string): DomainInfo {
  try {
    // Parse URL to get hostname
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Use tldts to parse domain components
    const parsed = parse(hostname);

    const registrableDomain = parsed.domain ?? null;

    let subdomainHostname: string | null = null;
    const hostnameWithoutWww = hostname.startsWith('www.')
      ? hostname.slice(4)
      : hostname;

    if (
      registrableDomain &&
      hostnameWithoutWww !== registrableDomain &&
      hostnameWithoutWww.endsWith(registrableDomain)
    ) {
      subdomainHostname = hostnameWithoutWww;
    }

    return {
      subdomainHostname,
      registrableDomain,
    };
  } catch {
    // If URL parsing fails, return empty info
    return {
      subdomainHostname: null,
      registrableDomain: null,
    };
  }
}
