import { extractDomainInfo } from './domainHelpers';

describe('extractDomainInfo', () => {
  it('should extract subdomain and registrable domain correctly', () => {
    const result = extractDomainInfo('https://news.example.com/article');
    expect(result).toEqual({
      hostname: 'news.example.com',
      subdomain: 'news.example.com',
      registrableDomain: 'example.com',
    });
  });

  it('should return null subdomain for URLs without subdomain', () => {
    const result = extractDomainInfo('https://example.com/article');
    expect(result).toEqual({
      hostname: 'example.com',
      subdomain: null,
      registrableDomain: 'example.com',
    });
  });

  it('should handle multi-level TLDs correctly', () => {
    const result = extractDomainInfo('https://news.bbc.co.uk/article');
    expect(result).toEqual({
      hostname: 'news.bbc.co.uk',
      subdomain: 'news.bbc.co.uk',
      registrableDomain: 'bbc.co.uk',
    });
  });

  it('should handle URLs without subdomain on multi-level TLD', () => {
    const result = extractDomainInfo('https://bbc.co.uk/article');
    expect(result).toEqual({
      hostname: 'bbc.co.uk',
      subdomain: null,
      registrableDomain: 'bbc.co.uk',
    });
  });

  it('should handle deep subdomains', () => {
    const result = extractDomainInfo(
      'https://blog.tech.example.com/article',
    );
    expect(result).toEqual({
      hostname: 'blog.tech.example.com',
      subdomain: 'blog.tech.example.com',
      registrableDomain: 'example.com',
    });
  });

  it('should handle www prefix', () => {
    const result = extractDomainInfo('https://www.example.com/article');
    expect(result).toEqual({
      hostname: 'www.example.com',
      subdomain: null,
      registrableDomain: 'example.com',
    });
  });

  it('should handle invalid URLs gracefully', () => {
    const result = extractDomainInfo('not-a-valid-url');
    expect(result).toEqual({
      hostname: '',
      subdomain: null,
      registrableDomain: null,
    });
  });

  it('should handle URLs with port numbers', () => {
    const result = extractDomainInfo('https://news.example.com:8080/article');
    expect(result).toEqual({
      hostname: 'news.example.com',
      subdomain: 'news.example.com',
      registrableDomain: 'example.com',
    });
  });
});
