
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bgImg from './components/background.jpg';

export default function Analyze() {
  const navigate = useNavigate();
  const location = useLocation();
  const { analysis, jobTitle } = location.state || {};

  return (
    <div style={{
      fontFamily: '"Microsoft JhengHei", sans-serif',
      minHeight: '100vh',
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      color: '#000',
      padding: '30px',
      boxSizing: 'border-box',
      paddingBottom: '80px'
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
        <h1 style={{ margin:0, color:'#8B4513', fontWeight:'700', fontSize:'2.5rem' }}>AI 履歷分析結果</h1>
        <button 
          onClick={() => navigate('/')} 
          style={{
            padding:'8px 16px',
            background:'#6F4E37',
            color:'#fff',
            border:'none',
            borderRadius:'6px',
            cursor:'pointer',
            marginRight: '45px'
          }}
        >
          回首頁
        </button>
      </div>

            {/* ✅ 1. 顯示目標職位 */}
            <h2 style={{ color:'#8B4513',marginTop: '80px' ,borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                目標職位：{jobTitle || 'N/A'}
            </h2>
            
            <h2 style={{ color:'#8B4513' }}>
                總分：{analysis.score ?? '—'} / 100
            </h2>

            {/* ✅ 2. 新增 Ollama 回傳的「analysis」詳細分析文字 */}
            <div style={{ marginTop:'25px', padding:'15px',  borderRadius:'8px' }}>
                <h3 style={{ color:'#6F4E37', marginBottom: '10px' }}>AI 分析總結</h3>
                {/* 使用 analysis 欄位來顯示詳細文字 */}
                <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {analysis.analysis || '尚未提供詳細分析文字。'}
                </p>
            </div>
            
            {/* 優點 (Strengths) */}
            <div style={{ marginTop:'20px' }}>
              <h3 style={{ color:'#28a745' }}>優勢</h3>
              {Array.isArray(analysis.strengths) ? (
                <ul>
                  {analysis.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#888' }}>尚未提供優點分析</p>
              )}
            </div>

            {/* 待加強項目 (Weaknesses) */}
            <div style={{ marginTop:'20px' }}>
              <h3 style={{ color:'#dc3545' }}>待加強項目</h3>
              {Array.isArray(analysis.weaknesses) ? (
                <ul>
                  {analysis.weaknesses.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#888' }}>尚未提供待加強項目分析</p>
              )}
            </div>

      {/* Footer */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        textAlign: 'center',
        padding: '15px 10px',
        background: 'rgba(255,255,255,0.9)',
        borderTop: '1px solid #ddd',
        fontSize: '0.9rem',
        color: '#555',
        zIndex: 99
      }}>
        2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
      </footer>
    </div>
  );
}
