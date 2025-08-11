'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [sessionReady, setSessionReady] = useState(false);

  // Extract tokens from URL hash and set session
  useEffect(() => {
    const hash = window.location.hash.substring(1); // remove '#'
    const params = new URLSearchParams(hash);
    console.log(window.location.hash);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    console.log(params.get('access_token'), params.get('refresh_token'));

    if (!accessToken || !refreshToken) {
      setError('Invalid or expired password reset link.');
      return;
    }

    // Set the auth session in Supabase so updateUser works
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
      supabase.auth.getSession().then(console.log);

  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Update password using supabase
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('✅ Password updated successfully! Please log in with your new password.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
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
