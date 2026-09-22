const serverless = require('serverless-http');
const app = require('../../server/app');

const expressHandler = serverless(app);

exports.handler = (event, context) => {
  let path = event.path || '/';
  const functionPrefix = '/.netlify/functions/api';

  if (path.startsWith(functionPrefix)) {
    path = path.slice(functionPrefix.length) || '/';
  }

  // Netlify passes the part after /api to the function; Express owns /api.
  if (!path.startsWith('/api')) {
    path = `/api${path.startsWith('/') ? '' : '/'}${path}`;
  }

  event.path = path;

  return expressHandler(event, context);
};
