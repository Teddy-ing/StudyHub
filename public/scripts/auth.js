const COGNITO_DOMAIN = 'https://us-west-2jjpqyv3az.auth.us-west-2.amazoncognito.com';
const CLIENT_ID      = '4bj04na9rjlm5vvkbvqj2hp76v';
const REDIRECT_URI   = 'https://d2u0gildovsjhr.cloudfront.net/calendar.html';

export async function login() {
  // PKCE: create random verifier + challenge
  const codeVerifier  = btoa(crypto.getRandomValues(new Uint8Array(32))).replace(/=/g,'');
  const codeChallenge = await pkceChallenge(codeVerifier);          // helper below
  sessionStorage.codeVerifier = codeVerifier;

  const url = new URL(`${COGNITO_DOMAIN}/oauth2/authorize`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('code_challenge_method','S256');
  url.searchParams.set('code_challenge', codeChallenge);
  window.location.href = url.toString();
}

export async function handleRedirect() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('code')) return;      // not a callback
  const code = params.get('code');

  // swap code → tokens
  const body = new URLSearchParams({
    grant_type   : 'authorization_code',
    client_id    : CLIENT_ID,
    redirect_uri : REDIRECT_URI,
    code,
    code_verifier: sessionStorage.codeVerifier
  });

  const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const tokens = await res.json();      // { id_token, access_token, refresh_token? }
  sessionStorage.idToken = tokens.id_token;
  window.history.replaceState({}, '', '/');   // clean URL
}

async function pkceChallenge(verifier) {
  const buf   = new TextEncoder().encode(verifier);
  const hash  = await crypto.subtle.digest('SHA-256', buf);
  const base64= btoa(String.fromCharCode(...new Uint8Array(hash)))
                 .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  return base64;
}