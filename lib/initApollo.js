import { ApolloClient } from 'apollo-client';
import { ApolloLink, concat } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-fetch';
import { endpoint } from '../config';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState) {
  // First we create three peices of middleware

  // 1. Create a link for local state to be managed in Apollo


  // 1. connect to our GraphQL API
  const httpLink = new HttpLink({
    uri: endpoint, // Server URL (must be absolute)
    opts: {
      credentials: 'same-origin',
    },
  });

  // 2. One to tack on our auth token on each request
  const authMiddleware = new ApolloLink((operation, forward) => {
    const headers = {};

    if (typeof localStorage !== 'undefined' && localStorage.getItem('auth0IdToken')) {
      headers.authorization = `Bearer ${localStorage.getItem('auth0IdToken')}`;
    }

    operation.setContext({ headers });
    return forward(operation);
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
