// src/Analyze.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from './components/background.jpg';

export default function Analyze() {
  const navigate = useNavigate();

  // 模擬分析結果
  const analysis = {
    score: 78,
    strengths: [
      "履歷內容完整",
      "教育背景清楚",
      "技能描述具體"
    ],
    weaknesses: [
      "自我介紹過於簡略",
      "缺乏專案經驗描述",
      "排版略顯單調"
    ],
    suggestions: [
      "增加自我介紹段落，突出個人特色",
      "加入專案或實習經驗，量化成果",
      "適度使用粗體或列表改善版面可讀性"
    ]
  };

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
            marginRight: '45px' // ← 往左一點
          }}
        >
          回首頁
        </button>
      </div>

      {/* 分析內容區 */}
      <div style={{ marginTop:'140px', maxWidth:'800px', marginLeft:'auto', marginRight:'auto', background:'rgba(255,255,255,0.9)', padding:'20px', borderRadius:'12px' }}>
        
        {/* 分數 */}
        <h2 style={{ color:'#8B4513' }}>總分：{analysis.score} / 100</h2>

        {/* 優點 */}
        <div style={{ marginTop:'20px' }}>
          <h3 style={{ color:'#28a745' }}>優點</h3>
          <ul>
            {analysis.strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* 缺點 */}
        <div style={{ marginTop:'20px' }}>
          <h3 style={{ color:'#dc3545' }}>缺點</h3>
          <ul>
            {analysis.weaknesses.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* 改善建議 */}
        <div style={{ marginTop:'20px' }}>
          <h3 style={{ color:'#3407ffff' }}>改善建議</h3>
          <ul>
            {analysis.suggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
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
