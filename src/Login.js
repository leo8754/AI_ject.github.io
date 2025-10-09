import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from './components/background.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 固定帳號密碼
    const ROOT_USERNAME = '0';
    const ROOT_PASSWORD = '0';

    if (username === ROOT_USERNAME && password === ROOT_PASSWORD) {
      localStorage.setItem('loggedIn', 'true');
      navigate('/dashboard'); // 登入成功跳轉後台
    } else {
      alert('帳號或密碼錯誤');
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '0 10px'
  };

  const boxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '350px',
    textAlign: 'center',
    boxSizing: 'border-box'
  };

  const inputStyle = {
    display: 'block',
    marginBottom: '10px',
    width: '100%',
    padding: '8px',
    fontSize: '1em',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '1em',
    marginBottom: '10px',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>後台登入平台</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>登入</button>
        </form>

        
      </div>
    </div>
  );
}

export default Login;
