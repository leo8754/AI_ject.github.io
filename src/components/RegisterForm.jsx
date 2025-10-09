import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import PositionSelect from './PositionSelect';
import { sendRegisterRequest } from '../api/register.js';

function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  //const [selectedPosition, setSelectedPosition] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  //const [sentCode, setSentCode] = useState('');
  //const [captchaInput, setCaptchaInput] = useState('');
  //const [simpleCaptcha, setSimpleCaptcha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [codeMsg, setCodeMsg] = useState('');
  const [registerMsg, setRegisterMsg] = useState('');


//  useEffect(() => {
//    generateCaptcha();
//  }, []);
//
//  const generateCaptcha = () => {
//    const code = Math.floor(100000 + Math.random() * 900000).toString();
//    setSimpleCaptcha(code);
//  };

  //Email認證
  const sendCode = async () => {
    if (!email) {
      setErrorMsg('請輸入 Email');
      return;
    }
      setIsSending(true); // 開始 loading
      setErrorMsg('');
      setSuccessMsg('');

    try {
      const res = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const text = await res.text();
      setSuccessMsg(text);
    } catch (err) {
      setErrorMsg('發送驗證碼失敗');
    }finally {
    setIsSending(false);
    }
  };
  


  const handleSubmit = async () => {
    if (!name || !email || !password || !phone  || !captchaInput) {
      setErrorMsg('請完整填寫所有欄位');
      return;
    }
    if (captchaInput.trim() !== simpleCaptcha) {
      setErrorMsg('驗證碼錯誤');
      return;
    }if (!verificationCode) {
    setErrorMsg('請輸入 Email 驗證碼');
    return;
    }


    const encryptedPassword = CryptoJS.SHA256(password).toString();

    try {
      await sendRegisterRequest({
        name,
        email,
        password: encryptedPassword,
        phone,
        selectedPosition,
        emailVerificationCode: verificationCode
      });
      setSuccessMsg('註冊成功！即將跳轉...');

      //清空表單
      
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setSelectedPosition('');
      setVerificationCode('');
      setCaptchaInput('');
      //generateCaptcha(); // 重新產生前端驗證碼

      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
    const text = await err.response?.text?.(); // 抓後端回傳的錯誤訊息
    setErrorMsg(text || '後端錯誤或資料不合法');
    console.error('❌ 註冊失敗:', err);
    } 
  };

  return (
    <div className="register-form">
      <input placeholder="使用者名稱" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="密碼" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <input placeholder="手機號碼" value={phone} onChange={e => setPhone(e.target.value)} />
      
      





      <div style={{ marginTop: '12px' }}>
      <input
      placeholder="請輸入 Email 驗證碼"
      value={verificationCode}
      onChange={e => setVerificationCode(e.target.value)}
      style={{ marginBottom: '8px' }}
      />

      <button type="button" onClick={sendCode} disabled={isSending}>
      {isSending ? '寄送中...' : '發送驗證碼到 Email'}
      </button>

      </div>


      {errorMsg && <p className="error">{errorMsg}</p>}
      {successMsg && <p className="success">{successMsg}</p>}

      <button onClick={handleSubmit}>提交註冊</button>
    </div>
  );
}
export default RegisterForm;