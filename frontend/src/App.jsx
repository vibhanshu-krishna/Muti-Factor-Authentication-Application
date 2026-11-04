import React, {useState} from 'react';
import axios from 'axios';

function App() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [mfaSecret, setMfaSecret] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  //1
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {await axios.post('http://localhost:5000/register', { email, password });

    const res = await axios.post('http://localhost:5000/mfa/setup', { email });
    setQrCode(res.data.qrCode);
    setMfaSecret(res.data.mfaSecret);
    setStep(2);
  } catch (err) {
    setError(err.response?.data?.error || 'Registration failed. Try again.');
  }
};

const handleMfaVerify = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  try{
    const res = await axios.post('http://localhost:5000/mfa/verify', { 
      email,
      token: mfaToken });

    setMessage(res.data.message);
    setStep(3);
  } catch (err) {
    setError(err.response?.data?.error || 'Invalid MFA code.');
  }
};

return (
  <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px' }}>
    <h2>MFA Authentication App</h2>

    {error && <p style={{ color: 'red' }}>{error}</p>}
    {message && <p style={{ color: 'green' }}>{message}</p>}
    
    {/*step 1*/}
      {step === 1 && (
      <form onSubmit={handleRegister}>
        <h3> Register account</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input type="email"
           value={email}
            onChange={(e) => setEmail(e.target.value)}
            required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label> <br/>
          <input type="password"
           value={password}
            onChange={(e) => setPassword(e.target.value)}
            required style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>
        <button type="submit">Register & Setup MFA</button>
      </form>
    )}

    {step === 2 && (
      <form onSubmit={handleMfaVerifyMfa}>
        <h3> Step 2: Scan QR code</h3>
        <p>Scan the QR code below with your authenticator app (like Google Authenticator or Authy) and enter the generated code.</p>
        {qrCode && <img src={qrCodeUrl} alt="MFA QR Code" style={{ display: 'block', margin: '0 auto 15px' }} />}
        <p><strong>Manual Secret Key: </strong> <code style = {{background: '#eee', padding: '2px 6px'}}>{mfaSecret}
          </code></p>

        <div style={{ marginBottom: '15px' }}>
          <label>Enter 6-digit Authenticator Code:</label>
          <input type="text"
           value={mfaToken}
            onChange={(e) => setMfaToken(e.target.value)}
            maxLength='6'
            required placeholder = '123456'style={{ width: '100%', padding: '8px', marginTop: '4px', textAlign: 'center', fontSize: '18px', letterSpacing: '4px',}} />
        </div>
        <button type="submit">Verify MFA Code</button>
      </form>
    )}

    
    {step === 3 && (
      <div style={{ textAlign: 'center' }}>
        <h3>Step 3: MFA Setup Success</h3>
        <p>Your account has been successfully registered and MFA is enabled.</p>
        <p>You can now log in using your email, password, and the authenticator code.</p>
        <button onClick={() => setStep(1)}
         style= {{ padding: '8px 16px', cursor: 'pointer'}}>
         Start Over
         </button>

      </div>
    )}
  </div>
);
}

export default App;
