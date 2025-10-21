/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

interface ImportMetaEnv {
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly VITE_APP_VERSION?: string;
  readonly REACT_APP_ENV?: string;
  readonly REACT_APP_GIT_SHA?: string;
  readonly REACT_APP_ADMIN_API_ENDPOINT?: string;
  readonly REACT_APP_OAUTH2_PROVIDER?: string;
  readonly REACT_APP_OAUTH2_CLIENT_ID?: string;
  readonly REACT_APP_OAUTH2_LOGOUT_ENDPOINT?: string;
  readonly REACT_APP_OAUTH2_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global polyfills provided by webpack
declare const process: NodeJS.Process;
declare const Buffer: typeof import('buffer').Buffer;

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
