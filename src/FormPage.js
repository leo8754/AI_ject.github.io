// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import bgImg from './components/background.jpg';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // 取得當前路徑

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setUsername(savedUser);
  }, []);

  // ===== 自動回到頂部 =====
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const footerStyle = {
    marginTop: 'auto',
    padding: '20px 0',
    backgroundColor: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontSize: '0.9em',
    color: '#1a1919ff',
    width: '100%',
    boxSizing: 'border-box'
  };

  const avatarColor = '#6F4E37';

  // ----------------- 表單資料狀態 -----------------
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthdate: '',
    phone: '',
    email: '',
    address: '',
    education: '',
    major: '',
    occupation: '',
    workType: '',
    workYears: '',
    maritalStatus: '',
    hobbies: '',
    exerciseFreq: '',
    privacyAgree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.gender || !formData.phone || !formData.email || !formData.workType || !formData.privacyAgree) {
      alert('請填寫所有必填欄位 (*)');
      return;
    }
    console.log('表單資料:', formData);
    alert('資料已儲存！');
  };

  return (
    <div style={{
      fontFamily: '"Microsoft JhengHei", sans-serif',
      color: '#000',
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>

      {/* Header */}
      <div style={{
        position:'fixed',
        top:0,
        left:0,
        width:'100%',
        background:'rgba(255,255,255,0.85)',
        padding:'20px 40px',
        boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
        zIndex:100,
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <h1 style={{ margin:0, color:'#6F4E37', fontWeight:'700', fontSize:'2.5rem' }}>AI 履歷健診</h1>

        {/* 右上角頭像 + 狀態 + 登出 */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '80px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: avatarColor,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {username ? username.charAt(0).toUpperCase() : "?"}
          </div>

          <div style={{ textAlign:'left' }}>
            <div style={{ fontWeight:'600' }}>{username}</div>
            <div style={{ fontSize:'0.9rem', color:'green' }}><b>狀態：在線</b></div>
          </div>

          <button onClick={handleLogout} style={btnStyle}>登出</button>
        </div>
      </div>

      {/* 主要內容區 */}
      <div style={{
        flex: 1,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
        marginTop:'70px',
        gap:'20px',
        padding:'0 30px',
        boxSizing:'border-box'
      }}>

        {/* 頁面最上方標題 */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: '700',
          color: '#6F4E37',
          marginBottom: '10px'
        }}>
          健檢表單 - 基本個人資料
        </h2>

        {/* 表單卡片 */}
        <div style={{
          width: '80%',
          maxWidth:'700px',
          padding:'30px 35px',
          background:'#fff',
          borderRadius:'20px',
          boxShadow:'0 12px 30px rgba(0,0,0,0.12)',
          color:'#333',
          fontSize:'1rem',
          lineHeight:'1.7',
          border:'1px solid #e0e0e0',
          boxSizing: 'border-box'
        }}>
          <p style={{
            marginBottom:'25px',
            fontSize:'0.95rem',
            lineHeight:'1.7',
            textAlign:'justify',
            color:'#555'
          }}>
            <b style={{ color:'#8B4513', fontSize:'1rem' }}>
              本表單主要用於收集您的個人基本資料，以便 AI 履歷健檢專題<br/>
              分析您的履歷背景、技能與職涯資訊，提供個人化建議。
            </b>
            <br/><br/>
            <span style={{ color:'#dc3545' }}>* 表示必填欄位。</span>
          </p>

          {/* 內嵌表單 */}
          <form style={{ display:'flex', flexDirection:'column', gap:'15px' }} onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="姓名 / 暱稱 *" value={formData.name} onChange={handleChange} style={inputStyle} required />
            <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle} required>
              <option value="">性別 *</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="其他">其他</option>
            </select>
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} style={inputStyle} />
            <input type="tel" name="phone" placeholder="手機電話 *" value={formData.phone} onChange={handleChange} style={inputStyle} required />
            <input type="email" name="email" placeholder="電子郵件 *" value={formData.email} onChange={handleChange} style={inputStyle} required />
            <input type="text" name="address" placeholder="通訊地址" value={formData.address} onChange={handleChange} style={inputStyle} />
            <input type="text" name="education" placeholder="最高學歷 *" value={formData.education} onChange={handleChange} style={inputStyle} />
            <input type="text" name="major" placeholder="科系 *" value={formData.major} onChange={handleChange} style={inputStyle} />
            <input type="text" name="occupation" placeholder="目前職業" value={formData.occupation} onChange={handleChange} style={inputStyle} />
            <select name="workType" value={formData.workType} onChange={handleChange} style={inputStyle} required>
              <option value="">工作性質 *</option>
              <option value="全職">全職</option>
              <option value="兼職">兼職</option>
              <option value="自由工作者">自由工作者</option>
              <option value="學生">學生</option>
              <option value="其他">其他</option>
            </select>
            <input type="text" name="workYears" placeholder="工作年資" value={formData.workYears} onChange={handleChange} style={inputStyle} />
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} style={inputStyle}>
              <option value="">婚姻狀況</option>
              <option value="未婚">未婚</option>
              <option value="已婚">已婚</option>
              <option value="離異">離異</option>
            </select>
            <input type="text" name="hobbies" placeholder="興趣 / 愛好" value={formData.hobbies} onChange={handleChange} style={inputStyle} />
            <select name="exerciseFreq" value={formData.exerciseFreq} onChange={handleChange} style={inputStyle}>
              <option value="">每週運動頻率</option>
              <option value="不運動">不運動</option>
              <option value="1~2次">1~2 次</option>
              <option value="3~4次">3~4 次</option>
              <option value="5次以上">5 次以上</option>
            </select>
            <label style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <input type="checkbox" name="privacyAgree" checked={formData.privacyAgree} onChange={handleChange} required />
              我已閱讀並同意〈隱私政策〉 *
            </label>

            <button type="submit" style={{
              ...formBtnStyle,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background='#8B4513'}
            onMouseLeave={e => e.currentTarget.style.background='#6F4E37'}
            >儲存資料</button>
          </form>
        </div>

        {/* 頁面導航 */}
        <div style={{ display:'flex', gap:'30px' }}>
          <button onClick={()=>navigate('/first')} style={navBtnStyle}>← 上一步</button>
          <button onClick={()=>navigate('/FormPage1')} style={navBtnStyle}>下一步 →</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={footerStyle}>
        2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
      </footer>
    </div>
  );
}

// ----------------- 按鈕與輸入欄位樣式 -----------------
const btnStyle = {
  padding:'8px 16px',
  background:'#dc3545',
  color:'#fff',
  border:'none',
  borderRadius:'6px',
  cursor:'pointer'
};

const formBtnStyle = {
  padding:'14px 32px',
  background:'#6F4E37',
  color:'#fff',
  border:'none',
  borderRadius:'10px',
  cursor:'pointer',
  fontSize:'1.1rem',
  fontWeight:'600',
  boxShadow:'0 4px 10px rgba(0,123,255,0.3)',
};

const navBtnStyle = {
  padding:'10px 20px',
  background:'#6F4E37',
  color:'#fff',
  border:'none',
  borderRadius:'8px',
  cursor:'pointer'
};

const inputStyle = {
  padding:'12px 14px',
  border:'1px solid #ccc',
  borderRadius:'10px',
  fontSize:'1rem',
  outline:'none',
  width:'100%',
  boxSizing:'border-box',
  transition: 'all 0.2s ease'
};
