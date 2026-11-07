import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [isLoginView, setIsLoginView] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setMessage('');
    setMfaToken('');
    setStep(1);
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/register', { email, password });
      setQrCodeUrl(res.data.qrCodeUrl);
      setStep(2);
      setMessage('Registration successful! Scan the QR code below.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Server error during registration');
    } finally {
      setLoading(false);
    }
  };

  // Handle MFA Verification
  const handleVerifyMFA = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/verify-mfa', { email, token: mfaToken });
      setStep(3);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid 6-digit MFA Code');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        token: mfaToken
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>MFA Security App</h1>
          <p style={styles.subtitle}>Two-Factor Authentication System</p>
        </div>

        {/* Tab Switcher */}
        <div style={styles.tabContainer}>
          <button
            type="button"
            onClick={() => { setIsLoginView(false); resetForm(); }}
            style={{ ...styles.tab, ...(isLoginView ? {} : styles.activeTab) }}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginView(true); resetForm(); }}
            style={{ ...styles.tab, ...(isLoginView ? styles.activeTab : {}) }}
          >
            Login
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div style={{
            ...styles.alert,
            backgroundColor: message.toLowerCase().includes('successful') || message.toLowerCase().includes('verified') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: message.toLowerCase().includes('successful') || message.toLowerCase().includes('verified') ? '#4ade80' : '#f87171',
            borderColor: message.toLowerCase().includes('successful') || message.toLowerCase().includes('verified') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
          }}>
            {message}
          </div>
        )}

        {/* LOGIN VIEW */}
        {isLoginView ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>6-Digit Authenticator Code</label>
              <input
                type="text"
                placeholder="123456"
                maxLength="6"
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                style={{ ...styles.input, textAlign: 'center', letterSpacing: '4px', fontSize: '1.1rem' }}
                required
              />
            </div>
            <button type="submit" disabled={loading} style={styles.primaryButton}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* REGISTER VIEW */
          <div>
            {step === 1 && (
              <form onSubmit={handleRegister} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
                <button type="submit" disabled={loading} style={styles.primaryButton}>
                  {loading ? 'Creating Account...' : 'Continue to MFA Setup'}
                </button>
              </form>
            )}

            {step === 2 && (
              <div style={styles.qrSection}>
                <h3 style={styles.stepTitle}>Scan with Authenticator App</h3>
                <p style={styles.stepText}>Use Google Authenticator or Authy to scan this QR code:</p>
                {qrCodeUrl && (
                  <div style={styles.qrWrapper}>
                    <img src={qrCodeUrl} alt="MFA QR Code" style={styles.qrImage} />
                  </div>
                )}
                <form onSubmit={handleVerifyMFA} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Enter 6-Digit Verification Code</label>
                    <input
                      type="text"
                      placeholder="123456"
                      maxLength="6"
                      value={mfaToken}
                      onChange={(e) => setMfaToken(e.target.value)}
                      style={{ ...styles.input, textAlign: 'center', letterSpacing: '4px', fontSize: '1.1rem' }}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} style={styles.primaryButton}>
                    {loading ? 'Verifying...' : 'Verify & Enable MFA'}
                  </button>
                </form>
              </div>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={styles.successIcon}>✓</div>
                <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>Setup Complete!</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Your account is protected with Two-Factor Authentication.
                </p>
                <button
                  onClick={() => { setIsLoginView(true); resetForm(); }}
                  style={styles.primaryButton}
                >
                  Proceed to Login
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline CSS Design System
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    border: '1px solid #334155',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    color: '#f8fafc',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 6px 0',
    lineHeight: '1.2',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    margin: 0,
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    marginBottom: '20px',
    border: '1px solid',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'left',
  },
  label: {
    color: '#cbd5e1',
    fontSize: '0.825rem',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#f8fafc',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s ease',
  },
  qrSection: {
    textAlign: 'center',
  },
  stepTitle: {
    color: '#f8fafc',
    fontSize: '1.1rem',
    margin: '0 0 6px 0',
  },
  stepText: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    margin: '0 0 16px 0',
  },
  qrWrapper: {
    backgroundColor: '#ffffff',
    padding: '12px',
    borderRadius: '12px',
    display: 'inline-block',
    marginBottom: '16px',
  },
  qrImage: {
    width: '160px',
    height: '160px',
    display: 'block',
  },
  successIcon: {
    width: '50px',
    height: '50px',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    margin: '0 auto 16px auto',
  },
};

export default App;