function initializeSnowplow(environment) {
  console.log(`initializing snowplow in the ${environment} environment...`);
  // script is provided by Snowplow, published by web-discover CI deploy step.
  (function (p, l, o, w, i, n, g) {
    if (!p[i]) {
      p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
      p.GlobalSnowplowNamespace.push(i);
      p[i] = function () {
        (p[i].q = p[i].q || []).push(arguments);
      };
      p[i].q = p[i].q || [];
      n = l.createElement(o);
      g = l.getElementsByTagName(o)[0];
      n.async = 1;
      n.src = w;
      g.parentNode.insertBefore(n, g);
    }
  })(
    window,
    document,
    'script',
    'https://assets.getpocket.com/web-utilities/public/static/te-2.18.js',
    'snowplow'
  );

  // DO WE NEED THIS?
  const SNOWPLOW_CONFIG = {
    appId:
      environment === 'Prod' ? 'collections-admin' : 'collections-admin-dev',
    platform: 'web',
    eventMethod: 'post',
    respectDoNotTrack: false,
    stateStorageStrategy: 'none',
    postPath:
      environment === 'Prod' ? '/t/e/' : '/com.snowplowanalytics.snowplow/tp2',
  };

  const connectorUrl =
    environment === 'Prod'
      ? 'd.getpocket.com'
      : 'com-getpocket-prod1.mini.snplow.net';

  window.snowplow('newTracker', 'sp', connectorUrl, {
    appId:
      environment === 'Prod' ? 'collections-admin' : 'collections-admin-dev',
    platform: 'web',
    eventMethod: 'post',
    respectDoNotTrack: false,
    stateStorageStrategy: 'none',
    postPath:
      environment === 'Prod' ? '/t/e/' : '/com.snowplowanalytics.snowplow/tp2',
    contexts: {
      webPage: true,
      performanceTiming: true,
    },
  });

  window.snowplow('addGlobalContexts', [
    {
      schema: `iglu:com.pocket/collection/jsonschema/1-0-0`,
    },
  ]);

  window.snowplow(
    'enableActivityTracking',
    10, // heartbeat delay
    10 // heartbeat interval
  );

  //window.snowplow('enableLinkClickTracking');
  //window.snowplow('enableFormTracking');
  //window.snowplow('trackPageView');
}
