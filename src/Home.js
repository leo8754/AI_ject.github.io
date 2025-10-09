import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from './components/background.jpg';

function Home() {
  const navigate = useNavigate();

  // ===== Modal 狀態 =====
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ===== 註冊狀態 =====
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCode, setRegCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [regErrorMsg, setRegErrorMsg] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // ===== 登入狀態 =====
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

  // ===== 響應式寬度 =====
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ===== 手機漢堡選單狀態 =====
  const isMobile = windowWidth < 768; 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    // 開啟選單時禁止 body 捲動，關閉時還原 (只在手機版 < 768px 生效)
     document.body.style.overflow = mobileMenuOpen && isMobile ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, isMobile]);
  // ===== Style =====
  const headerHeight = windowWidth < 500 ? 64 : windowWidth < 768 ? 72 : 92;

  const containerStyle = {
    minHeight: '100vh',
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    zIndex: 0
  };

  // header: 玻璃霧面、固定置頂
  const headerStyle = {
    display: 'flex',
    flexDirection: 'row', // 一律 row：左品牌、右操作（桌機顯示完整 nav，手機顯示漢堡）
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: windowWidth < 768 ? '10px 16px' : '3px 30px',
    backgroundColor: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.45)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: `${headerHeight}px`,
    zIndex: 1000,
    transition: 'background-color 0.25s ease, height 0.2s ease, padding 0.2s ease'
  };

  // 主內容 paddingTop 避免被固定 header 蓋到
  const contentWrapper = {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    padding: windowWidth < 768 ? '0 10px' : '0 50px',
    paddingTop: `${headerHeight + 20}px`
  };

  const navStyle = {
    display: windowWidth >= 768 ? 'flex' : 'none', // 桌機顯示 nav，手機隱藏（改由漢堡選單）
    flexDirection: windowWidth < 500 ? 'column' : 'row',
    gap: windowWidth < 500 ? '10px' : '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#6F4E37'
  };

  const mobileHamburgerStyle = {
    display: windowWidth < 768 ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer'
  };

  const buttonStyle = {
    padding: '10px 20px',
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

  const cardStyle = {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: '15px',
    padding: windowWidth < 500 ? '15px 20px' : '25px 30px',
    margin: '30px auto',
    maxWidth: windowWidth < 768 ? '95%' : '700px',
    textAlign: 'left',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(6px)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    lineHeight: '1.6'
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
  };

  const listCardStyle = {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: '12px',
    padding: '12px 15px',
    margin: '10px 0',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(4px)',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  };

  const listCardHover = { transform: 'scale(1.02)' };

  // ===== Modal Glass Style =====
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
    zIndex: 1200
  };

  const modalContentStyle = {
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: '30px',
    borderRadius: '15px',
    width: windowWidth < 500 ? '90%' : '400px',
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.3)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    color: '#333'
  };

  const modalLoginButton = {
    ...loginButton,
    width: '50%',
    marginTop: '10px',
    backgroundColor: 'rgba(255,255,255,0.8)',
    border: '1px solid #6F4E37',
    color: '#6F4E37'
  };

  const modalRegisterButton = {
    ...registerButton,
    width: '50%',
    marginTop: '10px',
    backgroundColor: 'rgba(111,78,55,0.8)',
    color: 'white'
  };

  const footerStyle = {
    padding: '20px 0',
    backgroundColor: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    fontSize: '0.9em',
    color: '#171514ff',
    borderRadius: '10px',
    boxShadow: '0 -4px 10px rgba(255,255,255,0.3)',
    backdropFilter: 'blur(6px)',
    marginTop: 'auto'
  };

  // ===== 手機選單覆蓋層（背景暗）與選單面板樣式 =====
  const mobileMenuOverlayStyle = {
    display: mobileMenuOpen ? 'block' : 'none',
    position: 'fixed',
    top: headerHeight,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 1100
  };

 const mobileMenuStyle = {
    // 以下樣式繼承自 About.js 的側滑風格
    position: 'fixed',
    top: headerHeight,
    right: 0, // 從右側滑出
    width: windowWidth < 500 ? '80%' : '300px', // 小手機佔 80% 寬度，其他手機佔 300px
    
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    zIndex: 1150,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderBottomLeftRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.3)',

    // 側滑動畫的核心
    transition: 'transform 0.3s ease-out',
    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
    
    // 關閉時隱藏 (確保選單完全滑出後才移除佔位，防止內容被遮擋)
    visibility: mobileMenuOpen ? 'visible' : 'hidden', 
  };

  const mobileNavItemStyle = {
    padding: '14px 10px',
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#6F4E37',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(0,0,0,0.05)' // 增加分隔線

  };

  // ===== 註冊 / 登入 / 驗證 等功能 (保持不變) =====
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
    if (users.some(user => user.username === regUsername)) {
      setRegErrorMsg('此使用者已註冊');
      return;
    }
    users.push({ username: regUsername, password: regPassword, email: regEmail });
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    setRegSuccessMsg('註冊成功！即將跳轉到登入頁面...');
    setTimeout(() => {
      setShowRegisterModal(false);
      setShowLoginModal(true);
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
      localStorage.setItem('username', loginUsername);
      setLoginSuccessMsg(`登入成功！歡迎 ${loginUsername}`);
      setShowLoginModal(false);
      setLoginUsername('');
      setLoginPassword('');
      setLoginErrorMsg('');
      navigate('/first');
      setMobileMenuOpen(false);
    } else {
      setLoginErrorMsg('使用者名稱或密碼錯誤');
    }
  };

  const handleGuestLogin = () => {
    setLoginSuccessMsg('以訪客身份登入');
    setShowLoginModal(false);
    navigate('/Visitors');
    setMobileMenuOpen(false);
  };

  // 導航處理器：在 mobile 下會自動關閉選單
  const handleNavigate = (pathOrAction) => {
    setMobileMenuOpen(false);
    if (typeof pathOrAction === 'string') {
      navigate(pathOrAction);
    } else if (typeof pathOrAction === 'function') {
      pathOrAction();
    }
  };
    const handleAuthClick = (isLogin) => {
    if (isLogin) {
      setShowLoginModal(true);
    } else {
      setShowRegisterModal(true);
    }
    setMobileMenuOpen(false);
  };

 const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>

      {/* Header */}
      <header style={headerStyle}>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: windowWidth < 500 ? '1.6em' : '2.2em',
            color: '#6F4E37',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={() => handleNavigate('/')}
        >
          AI 履歷健診
        </div>

        {/* Desktop Nav (>=768) */}
   <nav style={navStyle}>
  <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>首頁</div>
  <div onClick={() => handleNavigate('/about')}>關於我們</div>
  <div onClick={() => {
    handleNavigate(() => {
      const el = document.getElementById('services');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }}>服務項目</div>
  <div onClick={() => {
    handleNavigate(() => {
      const el = document.getElementById('news');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }}>最新消息</div>
<div onClick={() => {
  handleNavigate(() => {
    const el = document.getElementById('contact');
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
}}>
  聯絡我們
</div>



</nav>

        {/* Right actions: on mobile show hamburger + small login/register icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Login/Register Buttons (visible on desktop; on mobile still visible but small) */}
          <div style={{ display: windowWidth >= 768 ? 'flex' : 'none', alignItems: 'center' }}>
            <button style={loginButton} onClick={() => setShowLoginModal(true)}>登入</button>
            <button style={registerButton} onClick={() => setShowRegisterModal(true)}>註冊</button>
          </div>

          {/* Mobile: show small login/register inside header if you want (optional) */}
          <div style={{ display: windowWidth < 768 ? 'none' : 'none' }} />

          {/* Hamburger (mobile) */}
          <button
            aria-label={mobileMenuOpen ? '關閉選單' : '開啟選單'}
            aria-expanded={mobileMenuOpen}
            style={mobileHamburgerStyle}
            onClick={() => setMobileMenuOpen(prev => !prev)}
          >
            {/* 漢堡圖示 (簡單動畫) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <g stroke="#6F4E37" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1={mobileMenuOpen ? "6" : "6"} x2="21" y2={mobileMenuOpen ? "18" : "6"}
                      style={{ transformOrigin: 'center', transition: 'all .25s', transform: mobileMenuOpen ? 'rotate(45deg)' : 'none' }} />
                <line x1="3" y1="12" x2="21" y2="12"
                      style={{ opacity: mobileMenuOpen ? 0 : 1, transition: 'opacity .18s' }} />
                <line x1="3" y1={mobileMenuOpen ? "18" : "18"} x2="21" y2={mobileMenuOpen ? "6" : "18"}
                      style={{ transformOrigin: 'ce nter', transition: 'all .25s', transform: mobileMenuOpen ? 'rotate(-45deg)' : 'none' }} />
              </g>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay + panel */}
      <div
        style={mobileMenuOverlayStyle}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div style={mobileMenuStyle} role="menu" aria-hidden={!mobileMenuOpen}>
        {/* Mobile menu items */}

  <div style={mobileNavItemStyle} onClick={() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setMobileMenuOpen(false);
}}>首頁</div>
<div style={mobileNavItemStyle} onClick={() => handleNavigate('/about')}>關於我們</div>
<div style={mobileNavItemStyle} onClick={() => {
  handleNavigate(() => {
    const el = document.getElementById('services');
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
}}>服務項目</div>
<div style={mobileNavItemStyle} onClick={() => {
  handleNavigate(() => {
    const el = document.getElementById('news');
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
}}>最新消息</div>
<div
  style={mobileNavItemStyle}
  onClick={() => {
    handleNavigate(() => {
      const el = document.getElementById('contact');
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
    setMobileMenuOpen(false);
  }}
>
  聯絡我們
</div>




        {/* Separator */}
        <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '6px 0' }} />

        {/* Login / Register inside mobile menu for convenience */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '6px' }}>
          <button style={{ ...loginButton, padding: '8px 14px' }} onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}>登入</button>
          <button style={{ ...registerButton, padding: '8px 14px' }} onClick={() => { setShowRegisterModal(true); setMobileMenuOpen(false); }}>註冊</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={contentWrapper}>
        {/* Hero Section */}
        <section style={{
          textAlign: 'center',
          padding: windowWidth < 500 ? '40px 10px' : '60px 20px',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          margin: '40px auto',
          maxWidth: windowWidth < 768 ? '95%' : '720px'
        }}>
          <h1 style={{ fontSize: windowWidth < 500 ? '2rem' : '3rem', color: '#6F4E37' }}>讓你的履歷在眾人中脫穎而出</h1>
          <p style={{ fontSize: windowWidth < 500 ? '1rem' : '1.5rem', marginTop: '20px' }}>
            <b>AI 智能幫你快速分析履歷，提供專屬優化建議，提升面試成功率</b>
          </p>
        </section>

        {/* 簡介 */}
        <section style={cardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: '0 6px 15px rgba(0,0,0,0.1)' })}>
          <h2 style={{ fontSize: windowWidth < 500 ? '1.2rem' : '1.5rem', color: '#6F4E37', marginBottom: '15px' }}>簡介</h2>
          <p><b>我們致力於打造最智能的履歷健診平台，結合人工智慧，幫助使用者快速掌握履歷優缺點，提升錄取機率。</b></p>
        </section>

        {/* 服務項目 */}
        <section id="services" style={cardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: '0 6px 15px rgba(0,0,0,0.1)' })}>
          <h2 style={{ fontSize: windowWidth < 500 ? '1.2rem' : '1.5rem', color: '#6F4E37' }}>服務項目</h2>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {['填寫個人基本資料表單', '填寫人格特質表單', '上傳履歷（支援 PDF 與 Word）', '利用 AI 分析履歷優缺點與改進建議'].map((item, idx) => (
              <li key={idx} style={listCardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, listCardHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, listCardStyle)}>
                📌 {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 最新消息 */}
        <section id="news" style={cardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: '0 6px 15px rgba(0,0,0,0.1)' })}>
          <h2 style={{ fontSize: windowWidth < 500 ? '1.2rem' : '1.5rem', color: '#6F4E37' }}>最新消息</h2>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {['優化 AI 履歷分析報告呈現方式', 'AI 履歷分析功能精準度提升'].map((news, idx) => (
              <li key={idx} style={listCardStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, listCardHover)} onMouseLeave={e => Object.assign(e.currentTarget.style, listCardStyle)}>
                📝 {news}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: windowWidth < 500 ? '40px 10px' : '60px 20px' }}>
          <h2 style={{ fontSize: windowWidth < 500 ? '1.5rem' : '2rem', color: '#4f280cff' }}>準備好讓履歷升級了嗎？</h2>
          <button style={{ ...registerButton, fontSize: windowWidth < 500 ? '1.2rem' : '1.5rem', padding: windowWidth < 500 ? '10px 30px' : '15px 40px', marginTop: '20px' }} onClick={() => setShowRegisterModal(true)}>
            立即註冊 ➜
          </button>
        </section>

        {/* Register Modal */}
        {showRegisterModal && (
          <div style={modalOverlayStyle} onClick={() => setShowRegisterModal(false)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <h2>註冊</h2>
              <input type="text" placeholder="使用者名稱" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} style={{ width: '80%', padding: '8px', margin: '10px 0' }} />
              <input type="password" placeholder="密碼" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} style={{ width: '80%', padding: '8px', margin: '10px 0' }} />
              <input type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={{ width: '80%', padding: '8px', margin: '10px 0' }} />
              <div style={{ display: 'flex', flexDirection: windowWidth < 500 ? 'column' : 'row', justifyContent: 'center', margin: '10px 0' }}>
                <input type="text" placeholder="驗證碼" value={regCode} onChange={(e) => setRegCode(e.target.value)} style={{ width: windowWidth < 500 ? '100%' : '50%', padding: '8px', marginRight: windowWidth < 500 ? '0' : '5px', marginBottom: windowWidth < 500 ? '10px' : '0' }} />
                <button style={{ ...modalRegisterButton, width: windowWidth < 500 ? '100%' : '50%' }} onClick={sendVerificationCode}>寄送驗證碼</button>
              </div>
              {regErrorMsg && <p style={{ color: 'red' }}>{regErrorMsg}</p>}
              {regSuccessMsg && <p style={{ color: 'green' }}>{regSuccessMsg}</p>}
              <button style={modalRegisterButton} onClick={handleRegister}>註冊</button>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div style={modalOverlayStyle} onClick={() => setShowLoginModal(false)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <h2>登入</h2>
              <input type="text" placeholder="使用者名稱" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} style={{ width: '80%', padding: '8px', margin: '10px 0' }} />
              <input type="password" placeholder="密碼" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: '80%', padding: '8px', margin: '10px 0' }} />
              {loginErrorMsg && <p style={{ color: 'red' }}>{loginErrorMsg}</p>}
              {loginSuccessMsg && <p style={{ color: 'green' }}>{loginSuccessMsg}</p>}
              <button style={modalLoginButton} onClick={handleLogin}>登入</button>
              <button style={{ ...modalLoginButton, marginTop: '10px' }} onClick={handleGuestLogin}>訪客登入</button>
            </div>
          </div>
        )}

        {/* Footer */}
       <footer id="contact" style={footerStyle}>
  2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
</footer>

      </div>
    </div>
  );
}

export default Home;
