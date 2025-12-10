import { extractDomainInfo } from './domainHelpers';

describe('extractDomainInfo', () => {
  it('should extract subdomain and registrable domain correctly', () => {
    const result = extractDomainInfo('https://news.example.com/article');
    expect(result).toEqual({
      subdomainHostname: 'news.example.com',
      registrableDomain: 'example.com',
    });
  });

  it('should return null subdomain for URLs without subdomain', () => {
    const result = extractDomainInfo('https://example.com/article');
    expect(result).toEqual({
      subdomainHostname: null,
      registrableDomain: 'example.com',
    });
  });

  it('should handle multi-level TLDs correctly', () => {
    const result = extractDomainInfo('https://news.bbc.co.uk/article');
    expect(result).toEqual({
      subdomainHostname: 'news.bbc.co.uk',
      registrableDomain: 'bbc.co.uk',
    });
  });

  it('should handle URLs without subdomain on multi-level TLD', () => {
    const result = extractDomainInfo('https://bbc.co.uk/article');
    expect(result).toEqual({
      subdomainHostname: null,
      registrableDomain: 'bbc.co.uk',
    });
  });

  it('should handle deep subdomains', () => {
    const result = extractDomainInfo('https://blog.tech.example.com/article');
    expect(result).toEqual({
      subdomainHostname: 'blog.tech.example.com',
      registrableDomain: 'example.com',
    });
  });

  it('should handle www prefix', () => {
    const result = extractDomainInfo('https://www.example.com/article');
    expect(result).toEqual({
      subdomainHostname: null,
      registrableDomain: 'example.com',
    });
  });

  it('should strip www prefix but preserve nested subdomains', () => {
    const result = extractDomainInfo('https://www.news.example.com/article');
    expect(result).toEqual({
      subdomainHostname: 'news.example.com',
      registrableDomain: 'example.com',
    });
  });

  it('should handle URLs with port numbers', () => {
    const result = extractDomainInfo('https://news.example.com:8080/article');
    expect(result).toEqual({
      subdomainHostname: 'news.example.com',
      registrableDomain: 'example.com',
    });
  });

  // Note: IDN domains are displayed in their ASCII punycode form.
  // The URL constructor converts Unicode to punycode automatically.
  it('should handle IDN domains as punycode', () => {
    // URL constructor converts törn.de to xn--trn-sna.de
    const result = extractDomainInfo('https://törn.de/article');
    expect(result).toEqual({
      subdomainHostname: null,
      registrableDomain: 'xn--trn-sna.de',
    });
  });

  it('should handle IDN with subdomain as punycode', () => {
    const result = extractDomainInfo('https://blog.törn.de/article');
    expect(result).toEqual({
      subdomainHostname: 'blog.xn--trn-sna.de',
      registrableDomain: 'xn--trn-sna.de',
    });
  });
});
