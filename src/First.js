import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from './components/background.jpg';

export default function Dashboard() {
  const [jobCategory, setJobCategory] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setUsername(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const colors = ["#6F4E37"];
  const avatarColor = useMemo(() => {
    if (!username) return colors[0];
    const charCode = username.charCodeAt(0);
    return colors[charCode % colors.length];
  }, [username]);

  const jobTitlesByCategory = {
    it: ['前端工程師','後端工程師','全端工程師','資料工程師','機器學習工程師','資料科學家','DevOps / SRE','行動應用工程師','嵌入式 / 韌體工程師','資安工程師','測試 / 品質工程師','雲端工程師','平台工程師','資料庫工程師','電腦視覺工程師','NLP / 語言模型工程師'],
    marketing: ['數位行銷','內容行銷','成長駭客','品牌經理','社群經營'],
    design: ['UI 設計師','UX 設計師','視覺設計師','產品設計師','動效設計師'],
    education: ['教師','教學設計','補教講師','教育科技工程師'],
    finance: ['財務分析師','風控 / 風險管理','會計','投資分析']
  };

  const genericTitles = ['工程師','專案經理','設計師','分析師','其他（自訂）'];
  const currentTitles = jobCategory ? jobTitlesByCategory[jobCategory] || genericTitles : genericTitles;

  return (
    <div style={{
      fontFamily: '"Microsoft JhengHei", sans-serif',
      color:'#000',
      backgroundImage:`url(${bgImg})`,
      backgroundSize:'cover',
      minHeight:'100vh',
      padding:'30px 20px',
      boxSizing:'border-box',
      paddingBottom:'100px'
    }}>

      {/* Header 固定左上角 */}
      <div style={{ 
        position:'fixed', 
        top:0, 
        left:0, 
        width:'100%', 
        background:'rgba(255,255,255,0.85)', 
        padding:'12px 15px', 
        boxShadow:'0 2px 8px rgba(0,0,0,0.1)', 
        zIndex:100, 
        display:'flex', 
        justifyContent:'space-between',
        alignItems:'center',
        flexWrap:'wrap'
      }}>
        {/* 標題靠左 */}
        <h1 style={{ 
          margin:0, 
          color:'#6F4E37', 
          fontWeight:'700', 
          fontSize:'2rem', 
          textAlign:'left',
          flex:1,
          minWidth:'180px'
        }}>
          AI 履歷健診
        </h1>

        {/* 頭像 + 名稱/狀態 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop:'10px',
          marginRight: '40px'
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
              flexShrink:0
            }}
          >
            {username ? username.charAt(0).toUpperCase() : "?"}
          </div>

          <div style={{ textAlign:'left', minWidth:'0px' }}>
            <div style={{ fontWeight:'700', fontSize:'0.9rem', overflowWrap:'anywhere' }}>{username}</div>
            <div style={{ fontSize:'1.0rem', color:'green' }}><b>狀態：在線</b></div>
          </div>

          <button onClick={handleLogout} style={{...btnStyle, padding:'6px 12px', fontSize:'0.85rem'}}>登出</button>
        </div>
      </div>

      {/* 主內容 */}
      <div style={{ paddingTop:'100px', maxWidth:'820px', margin:'0 auto' }}>
        <div style={{ 
          background:'rgba(255,255,255,0.3)', 
          backdropFilter:'blur(10px)',        
          WebkitBackdropFilter:'blur(10px)',  
          padding:'20px', 
          borderRadius:'12px', 
          boxShadow:'0 2px 12px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#6F4E37', fontSize: '32px', marginBottom:'20px' }}>選擇職業資訊</h2>
          <div style={{ 
            display:'flex', 
            gap:'12px', 
            flexWrap:'wrap', 
            justifyContent:'center', 
            marginTop:'10px'
          }}>
            <div style={{ minWidth:'140px', flex:'1 1 140px' }}>
              <label style={{ display:'block', marginBottom:'6px' }}>職業類別</label>
              <select 
                value={jobCategory} 
                onChange={(e)=>{ 
                  setJobCategory(e.target.value); 
                  setJobTitle(''); 
                  setCustomJobTitle(''); 
                }}
                style={{ width:'100%', padding:'6px', borderRadius:'6px', fontSize:'0.9rem' }}
              >
                <option value="">請選擇</option>
                <option value="it">資訊科技 (IT)</option>
                <option value="marketing">行銷</option>
                <option value="design">設計</option>
                <option value="education">教育</option>
                <option value="finance">金融</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div style={{ minWidth:'140px', flex:'1 1 140px' }}>
              <label style={{ display:'block', marginBottom:'6px' }}>職稱</label>
              <select 
                value={jobTitle} 
                onChange={(e)=>{ 
                  setJobTitle(e.target.value); 
                  if(e.target.value!=='其他（自訂）') setCustomJobTitle(''); 
                }} 
                disabled={!jobCategory}
                style={{ width:'100%', padding:'6px', borderRadius:'6px', fontSize:'0.9rem' }}
              >
                <option value="">{jobCategory ? '請選擇職稱' : '請先選擇職業類別'}</option>
                {currentTitles.map(t=><option key={t} value={t}>{t}</option>)}
                <option value="其他（自訂）">其他（自訂）</option>
              </select>
              {jobTitle==='其他（自訂）' && 
                <input 
                  type="text" 
                  placeholder="請輸入職稱" 
                  value={customJobTitle} 
                  onChange={e=>setCustomJobTitle(e.target.value)} 
                  style={{ marginTop:'6px', display:'block', width:'100%', textAlign:'center', padding:'6px', borderRadius:'6px' }}
                />
              }
            </div>
          </div>
          <div style={{ 
            marginTop:'20px', 
            padding:'10px', 
            background:'#f9f9f9', 
            border:'1px solid #ddd', 
            borderRadius:'8px',
            textAlign: 'center',
            fontSize:'0.9rem'
          }}>
            已選擇：類別：{jobCategory || '未選擇'} ／ 職稱：{jobTitle==='其他（自訂）'? (customJobTitle || '尚未輸入') : jobTitle || '未選擇'}
          </div>
        </div>

        <div style={{ 
          marginTop:'25px', 
          display:'flex', 
          justifyContent:'center', 
          gap:'12px', 
          flexWrap:'wrap'
        }}>
          <button onClick={()=>navigate('/')} style={{...navBtnStyle, width:'90px'}}>← 上一步</button>
          <button onClick={()=>navigate('/FormPage1')} style={{...navBtnStyle, width:'90px'}}>下一步 →</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        textAlign: 'center',
        padding: '12px 10px',
        background: 'rgba(255,255,255,0.9)',
        borderTop: '1px solid #ddd',
        fontSize: '0.85rem',
        color: '#555',
        zIndex: 99,
        wordBreak:'break-word'
      }}>
        2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
      </footer>
    </div>
  );
}

const btnStyle = {
  padding:'8px 14px',
  background:'#dc3545',
  color:'#fff',
  border:'none',
  borderRadius:'6px',
  cursor:'pointer',
  fontSize:'0.9rem'
};

const navBtnStyle = {
  padding:'10px 4px',
  background:'#6F4E37',
  color:'#fff',
  border:'none',
  borderRadius:'6px',
  cursor:'pointer',
  fontSize:'0.9rem'
};
