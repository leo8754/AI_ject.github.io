import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from './components/background.jpg';

function About() {
  const navigate = useNavigate();
  const aboutwe = useRef(null);
  const productRef = useRef(null);
  const teamRef = useRef(null);

  const scrollToRef = (ref) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  // ===== 響應式監聽 (來自組員的版本) =====
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 600;
  const isTablet = windowWidth >= 600 && windowWidth < 900;

  // ===== 狀態管理 (您的版本) =====
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCode, setRegCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [regErrorMsg, setRegErrorMsg] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // ===== 註冊功能 (您的版本) =====
  const handleRegister = () => {
    if (!regUsername || !regPassword || !regEmail || !regCode) {
      setRegErrorMsg('請完整填寫所有欄位');
      return;
    }
    if (regCode !== sentCode) {
      setRegErrorMsg('驗證碼錯誤');
      return;
    }
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (users.some((u) => u.username === regUsername)) {
      setRegErrorMsg('此使用者已註冊');
      return;
    }
    users.push({ username: regUsername, password: regPassword, email: regEmail });
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    setRegSuccessMsg('註冊成功！即將跳轉登入...');
    setTimeout(() => {
      setShowRegister(false);
      setShowLogin(true);
      setRegUsername('');
      setRegPassword('');
      setRegEmail('');
      setRegCode('');
      setRegErrorMsg('');
      setRegSuccessMsg('');
    }, 2000);
  };

  const sendVerificationCode = () => {
    if (!regEmail) {
      setRegErrorMsg('請輸入 Email');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    alert(`驗證碼已寄送至 ${regEmail}\n(測試用代碼: ${code})`);
  };

  // ===== 登入功能 (您的版本) =====
  const handleLogin = () => {
    if (!loginUsername || !loginPassword) {
      setLoginErrorMsg('請輸入使用者名稱與密碼');
      return;
    }
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = users.find(
      user => user.username === loginUsername && user.password === loginPassword
    );
    if (user) {
      setLoginSuccessMsg(`登入成功！歡迎 ${loginUsername}`);
      setShowLogin(false);
      setLoginUsername('');
      setLoginPassword('');
      setLoginErrorMsg('');
      navigate('/first', { state: { username: loginUsername } });
    } else {
      setLoginErrorMsg('使用者名稱或密碼錯誤');
    }
  };

  const handleGuestLogin = () => {
    setLoginSuccessMsg('以訪客身份登入');
    setShowLogin(false);
    navigate('/Visitors', { state: { username: "訪客" } });
  };

  // ===== 樣式 (已加入組員的響應式邏輯) =====
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#333',
    position: 'relative'
  };

  const headerStyle = {
    display: 'flex',
    // 響應式修改
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // 響應式修改
    padding: isMobile ? '10px 20px' : '20px 50px',
    backgroundColor: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottom: '1px solid rgba(255,255,255,0.3)'
  };

  const navStyle = {
    display: 'flex',
    // 響應式修改
    flexDirection: isMobile ? 'column' : 'row',
    // 響應式修改
    gap: isMobile ? '10px' : '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#6F4E37',
    // 響應式修改
    alignItems: isMobile ? 'flex-start' : 'center',
    marginTop: isMobile ? '10px' : '0' // 響應式修改
  };

  const buttonStyle = {
    // 響應式修改
    padding: isMobile ? '6px 12px' : '10px 20px',
    marginLeft: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const loginButton = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: '#6F4E37',
    border: '1px solid #6F4E37'
  };

  const registerButton = {
    ...buttonStyle,
    backgroundColor: '#6F4E37',
    color: 'white'
  };

  const mainStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // 響應式修改
    padding: isMobile ? '140px 20px 50px' : '120px 50px 50px'
  };

  const contentStyle = {
    maxWidth: '850px',
    textAlign: 'left'
  };

  // ===== 卡片玻璃風格 (已加入組員的響應式邏輯) =====
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: '20px',
    // 響應式修改
    padding: isMobile ? '20px 20px' : '30px 35px',
    marginBottom: '25px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, boxShadow 0.3s',
    lineHeight: '1.7',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  };

  const teamContainerStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '20px'
  };

  const teamCardStyle = {
    ...cardStyle,
    flex: '1 1 220px',
    textAlign: 'center',
    minWidth: '200px'
  };

  const teamCardHover = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  };

  const h2Style = {
    color: '#6F4E37',
    // 響應式修改
    fontSize: isMobile ? '1.5rem' : isTablet ? '1.8rem' : '2rem'
  };

  const footerStyle = {
    // 響應式修改
    padding: isMobile ? '10px 0' : '20px 0',
    backgroundColor: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    // 響應式修改
    fontSize: isMobile ? '0.75em' : '0.9em',
    color: '#171514ff',
    borderRadius: '10px',
    boxShadow: '0 -4px 10px rgba(255,255,255,0.3)',
    backdropFilter: 'blur(6px)',
    marginTop: 'auto'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    // 響應式修改
    padding: isMobile ? '20px' : '30px',
    borderRadius: '15px',
    // 響應式修改
    width: isMobile ? '85%' : '400px',
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
    color: '#333',
    // 響應式修改
    fontSize: isMobile ? '0.85rem' : '1rem'
  };

  const modalStyle = {
    ...modalContentStyle,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1001
  };

  return (
    <div style={containerStyle}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.6)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header style={headerStyle}>
          {/* 響應式修改 */}
          <div style={{ fontWeight: 'bold', fontSize: isMobile ? '1.8rem' : '2.5em', color: '#6F4E37', cursor: 'pointer' }} onClick={() => navigate('/')}>
            AI 履歷健診
          </div>
          <nav style={navStyle}>
            <div onClick={() => navigate('/')}>首頁</div>
            <div onClick={() => scrollToRef(aboutwe)}>關於我們</div>
            <div onClick={() => scrollToRef(productRef)}>產品亮點</div>
            <div onClick={() => scrollToRef(teamRef)}>團隊介紹</div>
            <div onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              聯絡我們
            </div>
          </nav>
          {/* 響應式修改 */}
          <div style={{ marginTop: isMobile ? '10px' : '0' }}>
            <button style={loginButton} onClick={() => setShowLogin(true)}>登入</button>
            <button style={registerButton} onClick={() => setShowRegister(true)}>註冊</button>
          </div>
        </header>

        <main style={mainStyle}>
          <div style={contentStyle}>
            {/* 關於我們（卡片內） */}
            <div style={cardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}>
              <h2 ref={aboutwe} style={h2Style}>關於我們</h2>
              {/* 響應式修改 */}
              <p style={{ fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
                最智慧的AI分析，最專業的履歷健診。
                我們打造數據化、專業化的專業建議，協助求職者精準檢視履歷，
                發揮優勢、改善不足，快速提升競爭力。
              </p>
            </div>

            {/* 產品亮點 */}
            <h2 ref={productRef} style={h2Style}>產品亮點</h2>
            {[...Array(4).keys()].map(i => (
              <div key={i} style={cardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}>
                {/* 響應式修改 */}
                <strong style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#000' }}>
                  {["AI履歷評分","精準職缺匹配","專業優化建議","我們的願景"][i]}
                </strong>
                {/* 響應式修改 */}
                <p style={{ marginTop: '8px', fontSize: isMobile ? '0.85rem' : '1rem' }}>
                  {[
                    "即時分析履歷分數，清楚知道優點與缺點",
                    "依照你的專業背景，自動推薦最適合的工作",
                    "提供條列式修改建議，幫你快速改善履歷",
                    "透過科技與數據，成為專業的AI人才評估平台"
                  ][i]}
                </p>
              </div>
            ))}

            {/* 團隊介紹 */}
            <h2 ref={teamRef} style={h2Style}>團隊介紹</h2>
            <div style={teamContainerStyle}>
              {[
                { name: 'Leo', role: '前端工程師 / UI設計' },
                { name: 'Vincent', role: '產品經理 / 後端工程師 / 資料分析' },
                { name: 'Alex', role: 'AI工程師 / 模型開發' },
                { name: 'Michael', role: '表單 / 整合' }
              ].map((member, idx) => (
                <div key={idx} style={teamCardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, teamCardHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, teamCardStyle)}>
                  {/* 響應式修改 */}
                  <strong style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>{member.name}</strong>
                  {/* 響應式修改 */}
                  <p style={{ marginTop: '5px', fontSize: isMobile ? '0.8rem' : '0.95rem' }}>{member.role}</p>
                </div>
              ))}
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer style={footerStyle}>
          2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
        </footer>

        {/* Login Modal */}
        {showLogin && (
          <div style={modalOverlayStyle} onClick={() => setShowLogin(false)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <h2>登入</h2>
              <input type="text" placeholder="使用者名稱" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} style={{ width: '80%', padding: '8px', margin: '10px 0' }} />
              <input type="password" placeholder="密碼" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ width: '80%', padding: '8px', margin: '10px 0' }} />
              {loginErrorMsg && <p style={{ color: 'red' }}>{loginErrorMsg}</p>}
              {loginSuccessMsg && <div style={{ backgroundColor: 'rgba(0, 128, 0, 0.1)', color: 'green', padding: '10px', margin: '10px auto', borderRadius: '6px', width: 'fit-content', fontWeight: 'bold' }}>{loginSuccessMsg}</div>}
              <button style={{ ...loginButton, width: '50%', marginTop: '10px' }} onClick={handleLogin}>登入</button>
              <button style={{ ...registerButton, width: '50%', marginTop: '10px' }} onClick={handleGuestLogin}>訪客登入</button>
            </div>
          </div>
        )}

        {/* Register Modal */}
        {showRegister && (
          <div style={modalStyle}>
            <h3>註冊</h3>
            <input type="text" placeholder="使用者名稱" value={regUsername} onChange={e => setRegUsername(e.target.value)} /><br /><br />
            <input type="password" placeholder="密碼" value={regPassword} onChange={e => setRegPassword(e.target.value)} /><br /><br />
            <input type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            <button onClick={sendVerificationCode}>發送驗證碼</button><br /><br />
            <input type="text" placeholder="驗證碼" value={regCode} onChange={e => setRegCode(e.target.value)} /><br /><br />
            <button onClick={handleRegister}>註冊</button>
            <button onClick={() => setShowRegister(false)}>關閉</button>
            {regErrorMsg && <p style={{ color: 'red' }}>{regErrorMsg}</p>}
            {regSuccessMsg && <p style={{ color: 'green' }}>{regSuccessMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default About;