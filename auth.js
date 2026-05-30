// ── SUPABASE AUTH ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://kgtbdfeztaovdryxpkay.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtndGJkZmV6dGFvdmRyeXhwa2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzM4NTYsImV4cCI6MjA5NTcwOTg1Nn0.hyg2MgDfvt1bGDF9QgkdZFj-PU7MNkRNy0nNwOJgUlE';

async function supabaseFetch(endpoint, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      ...options.headers
    }
  });
  return res.json();
}

function getSession() {
  const s = localStorage.getItem('sb_session');
  return s ? JSON.parse(s) : null;
}

function saveSession(session) {
  localStorage.setItem('sb_session', JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem('sb_session');
}

async function signUp(email, password, name) {
  const data = await supabaseFetch('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, data: { full_name: name } })
  });
  if (data.error) throw new Error(data.error.message || data.msg);
  if (data.access_token) saveSession(data);
  return data;
}

async function signIn(email, password) {
  const data = await supabaseFetch('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data.error) throw new Error(data.error.message || data.msg);
  if (data.access_token) saveSession(data);
  return data;
}

async function signOut() {
  const session = getSession();
  if (session?.access_token) {
    await supabaseFetch('/auth/v1/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    });
  }
  clearSession();
  showAuthPage();
}

function getUserName() {
  const session = getSession();
  return session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'User';
}

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
function showAuthPage() {
  document.getElementById('auth-page').style.display = 'flex';
  document.getElementById('main-app').style.display = 'none';
}

function showApp() {
  document.getElementById('auth-page').style.display = 'none';
  document.getElementById('main-app').style.display = 'block';
  // Update user name
  const name = getUserName();
  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = name;
}

function toggleAuthMode() {
  const isLogin = document.getElementById('auth-title').textContent === 'Sign in';
  document.getElementById('auth-title').textContent = isLogin ? 'Create account' : 'Sign in';
  document.getElementById('auth-btn').textContent = isLogin ? 'Sign up' : 'Sign in';
  document.getElementById('auth-toggle').textContent = isLogin ? 'Already have an account? Sign in' : "Don't have an account? Sign up";
  document.getElementById('auth-name-row').style.display = isLogin ? 'block' : 'none';
  document.getElementById('auth-error').textContent = '';
}

async function handleAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const name = document.getElementById('auth-name').value.trim();
  const isSignup = document.getElementById('auth-title').textContent === 'Create account';
  const btn = document.getElementById('auth-btn');
  const err = document.getElementById('auth-error');

  if (!email || !password) { err.textContent = 'Please fill in all fields.'; return; }
  if (isSignup && !name) { err.textContent = 'Please enter your name.'; return; }

  btn.textContent = 'Please wait...';
  btn.disabled = true;
  err.textContent = '';

  try {
    if (isSignup) {
      await signUp(email, password, name);
    } else {
      await signIn(email, password);
    }
    showApp();
  } catch (e) {
    err.textContent = e.message;
  } finally {
    btn.textContent = isSignup ? 'Sign up' : 'Sign in';
    btn.disabled = false;
  }
}

// ── INIT AUTH ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  if (session?.access_token) {
    showApp();
  } else {
    showAuthPage();
  }
});
