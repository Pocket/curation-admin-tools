'use strict';

const fs = require('fs');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
  return {
    // Port configuration
    port: parseInt(process.env.PORT, 10) || 3000,
    // Allow any host in development
    allowedHosts: allowedHost === 'all' ? 'all' : [allowedHost].filter(Boolean),
    // Enable gzip compression of generated files.
    compress: true,
    // Serve static files from public directory
    static: {
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      // Watch for changes in public directory
      watch: {
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    // Enable hot module replacement
    hot: true,
    // Configure the client overlay and logging
    client: {
      webSocketURL: {
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
      // Only show errors in the browser overlay
      overlay: false,
      logging: 'none',
    },
    // Use 'ws' for WebSocket server
    webSocketServer: 'ws',
    // HTTPS configuration
    server: getHttpsConfig() ? 'https' : 'http',
    host,
    // History API fallback for SPAs
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    // Proxy configuration
    proxy,
    // Dev middleware options
    devMiddleware: {
      // Public path should be same as webpack config
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },
    // Setup middlewares using the new API
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Add middlewares before the dev server's own middlewares
      middlewares.unshift(
        {
          name: 'eval-source-map-middleware',
          middleware: evalSourceMapMiddleware(devServer),
        },
        {
          name: 'error-overlay-middleware',
          middleware: errorOverlayMiddleware(),
        }
      );

      // Add custom proxy setup if exists
      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app);
      }

      // Add middlewares after the dev server's own middlewares
      middlewares.push(
        {
          name: 'redirect-served-path-middleware',
          middleware: redirectServedPath(paths.publicUrlOrPath),
        },
        {
          name: 'noop-service-worker-middleware',
          middleware: noopServiceWorkerMiddleware(paths.publicUrlOrPath),
        }
      );

      return middlewares;
    },
  };
};
