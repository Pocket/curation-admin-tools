import { AuthService, useAuth as pkceUseAuth } from 'react-oauth2-pkce';

/**
 * A helper interface that contains what is available to us to use in the application
 */
export interface IDToken {
  given_name: string;
  family_name: string;
  name: string;
  email: string;
  'cognito:groups': string[];
  'cognito:username': string;
  'custom:groups': string;
  groups: string[];
  picture: string;
  exp: number;
  iat: number;
  email_verified: string;
}

/**
 * A handy hook to expand on the pkce auth hook to include some Pocket specific helpers
 *
 */
export const useMozillaAuth = (): {
  authService: AuthService;
  parsedIdToken: IDToken;
  jwtIdToken: string;
  canAccessCollections: boolean;
  canAccessCuration: boolean;
  canAccessModeration: boolean;
} => {
  const isLocalDev = process.env.REACT_APP_LOCAL_DEV === 'true';

  if (isLocalDev) {
    // Mock authentication data for local development
    const mockIdToken: IDToken = {
      given_name: 'Local',
      family_name: 'Developer',
      name: 'Local Developer',
      email: 'local@example.com',
      'cognito:groups': ['developers'],
      'cognito:username': 'local-dev',
      'custom:groups': '["developers"]',
      groups: ['developers'],
      picture: '',
      exp: Date.now() / 1000 + 3600,
      iat: Date.now() / 1000,
      email_verified: 'true',
    };

    // Mock authService for local development
    const mockAuthService = {
      getUser: () => mockIdToken,
      logout: () => {
        console.log('Mock logout called');
        window.location.reload();
      },
      isAuthenticated: () => true,
      isPending: () => false,
    } as AuthService;

    // Use the dev JWT token if provided, otherwise use a mock token
    const devJwtToken = process.env.REACT_APP_DEV_JWT_TOKEN || 'mock-jwt-token';

    return {
      authService: mockAuthService,
      parsedIdToken: mockIdToken,
      jwtIdToken: devJwtToken,
      canAccessCollections: true,
      canAccessCuration: true,
      canAccessModeration: true,
    };
  }

  const { authService } = pkceUseAuth();
  const parsedIdToken = authService.getUser() as IDToken;

  //We need to custom parse out groups if they exist
  parsedIdToken.groups =
    'custom:groups' in parsedIdToken
      ? JSON.parse(parsedIdToken['custom:groups'])
      : [];

  // This pulls out the id_token string which is what we need
  // to provide cognito for validation
  const jwtIdToken = authService.getAuthTokens().id_token;

  return {
    authService,
    parsedIdToken,
    jwtIdToken,
    // Everyone at Pocket has read-only access to this tool
    // Access groups are checked on the backend when actions (mutations)
    // are performed.
    canAccessCollections: true, //parsedIdToken.groups.includes('asd'),
    canAccessCuration: true, //parsedIdToken.groups.includes('asd'),
    canAccessModeration: true,
  };
};
