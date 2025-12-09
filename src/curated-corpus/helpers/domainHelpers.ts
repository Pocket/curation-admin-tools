import { parse } from 'tldts';

export interface DomainInfo {
  /** Full hostname (e.g., "news.example.com") */
  hostname: string;
  /** Subdomain if present (e.g., "news.example.com"), null if none */
  subdomain: string | null;
  /** Registrable domain (e.g., "example.com") */
  registrableDomain: string | null;
}

/**
 * Extracts domain information from a URL string.
 * Uses tldts library for accurate parsing of domains including multi-level TLDs.
 *
 * @param url - Full URL string (e.g., "https://news.example.com/article")
 * @returns DomainInfo object with hostname, subdomain, and registrable domain
 *
 * @example
 * extractDomainInfo("https://news.example.com/article")
 * // Returns: { hostname: "news.example.com", subdomain: "news.example.com", registrableDomain: "example.com" }
 *
 * @example
 * extractDomainInfo("https://example.com/article")
 * // Returns: { hostname: "example.com", subdomain: null, registrableDomain: "example.com" }
 *
 * @example
 * extractDomainInfo("https://news.bbc.co.uk/article")
 * // Returns: { hostname: "news.bbc.co.uk", subdomain: "news.bbc.co.uk", registrableDomain: "bbc.co.uk" }
 */
export function extractDomainInfo(url: string): DomainInfo {
  try {
    // Parse URL to get hostname
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Use tldts to parse domain components
    const parsed = parse(hostname);

    let subdomain: string | null = null;

    if (parsed.domain && hostname !== parsed.domain) {
      // Strip the registrable domain part (e.g., ".example.com")
      const prefix = hostname.slice(0, -(parsed.domain.length + 1));

      // Treat a bare "www" prefix as no subdomain
      if (prefix && prefix !== 'www') {
        subdomain = hostname;
      }
    }

    return {
      hostname,
      subdomain,
      registrableDomain: parsed.domain,
    };
  } catch (error) {
    // If URL parsing fails, return empty info
    return {
      hostname: '',
      subdomain: null,
      registrableDomain: null,
    };
  }
}
