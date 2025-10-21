// Senior-level note: Jest no longer goes through the CRA bootstrap script, so we
// mirror the minimum env plumbing here to keep legacy REACT_APP_* values working.
process.env.BABEL_ENV = process.env.BABEL_ENV || 'test';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';

require('../env');
