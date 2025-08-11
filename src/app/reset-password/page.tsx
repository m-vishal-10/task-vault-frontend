'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Grab the hash part of the URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    console.log('Hash:', window.location.hash);
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    if (!accessToken || !refreshToken) {
      setError('Invalid or expired password reset link.');
      return;
    }

    // Set the session for Supabase
    supabase.auth
      .setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .then((res) => {
        console.log('setSession response:', res);
        if (res.error) {
          setError(res.error.message);
        } else {
          setSessionReady(true);
        }
      });

    // Log the current session for debugging
    supabase.auth.getSession().then(console.log);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('✅ Password updated successfully! Please log in with your new password.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch {
      setError('Something went wrong while resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>🔑 Reset Password</h1>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
          disabled={!sessionReady || loading}
        />
        <button
          type="submit"
          disabled={loading || !sessionReady}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            backgroundColor: loading || !sessionReady ? '#ccc' : '#0070f3',
            color: '#fff',
            cursor: loading || !sessionReady ? 'not-allowed' : 'pointer',
            border: 'none',
          }}
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
