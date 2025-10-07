import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ResumePreview from './components/ResumePreview';
import bgImg from './components/background.jpg';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

const jobTitlesByCategory = {
  it: ['前端工程師','後端工程師','全端工程師','資料工程師','機器學習工程師','資料科學家','DevOps / SRE','行動應用工程師','嵌入式 / 韌體工程師','資安工程師','測試 / 品質工程師','雲端工程師','平台工程師','資料庫工程師','電腦視覺工程師','NLP / 語言模型工程師'],
  marketing: ['數位行銷','內容行銷','成長駭客','品牌經理','社群經營'],
  design: ['UI 設計師','UX 設計師','視覺設計師','產品設計師','動效設計師'],
  education: ['教師','教學設計','補教講師','教育科技工程師'],
  finance: ['財務分析師','風控 / 風險管理','會計','投資分析']
};
const genericTitles = ['工程師','專案經理','設計師','分析師'];

export default function Dashboard() {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('離線');
  const [jobCategory, setJobCategory] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const navigate = useNavigate();

  const avatarColor = '#d89f76ff';
  const currentTitles = jobCategory ? (jobTitlesByCategory[jobCategory] || genericTitles) : genericTitles;

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
      setUsername(savedUser);
      setStatus('在線');
    }
  }, []);

  const convertDocxToPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

    const div = document.createElement("div");
    div.innerHTML = html;
    div.style.fontFamily = '"Microsoft JhengHei", sans-serif';
    div.style.lineHeight = "1.5";
    div.style.fontSize = "14pt";
    div.style.width = "595px";
    div.style.position = "absolute";
    div.style.left = "-9999px";
    document.body.appendChild(div);

    const canvas = await html2canvas(div, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = 595;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const pdfBlob = pdf.output("blob");
    document.body.removeChild(div);

    const pdfFile = new File([pdfBlob], "resume.pdf", { type: "application/pdf" });
    setPdfFile(pdfFile);
  };

  const handleFileUpload = async (file, text) => {
    setResumeText(text || '');
    if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
      await convertDocxToPDF(file);
      setResumeFile(null);
    } else if (file.name.endsWith(".pdf")) {
      setResumeFile(file);
      setPdfFile(file);
    } else {
      alert("只支援 Word 或 PDF 檔案！");
    }
  };



  // ✅ 修正了語法結構 (將 try/catch 包住所有邏輯)
 const handleSubmit = async () => {
  console.log("🚀 handleSubmit 被呼叫了");
  console.log("📌 jobTitle:", jobTitle);
  console.log("📌 pdfFile:", pdfFile);

  const formData = new FormData();
  formData.append("jobTitle", jobTitle);
  formData.append("file", pdfFile);

  try {
    const response = await fetch("/api/resume/analyze", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗 - 狀態碼: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ 後端回傳結果：", result);

    navigate("/analyze", {
      state: {
        analysis: result,
        jobTitle
      }
    });
    } catch (error) {
    console.error("分析失敗", error);
    alert(`⚠️ 分析失敗，請稍後再試: ${error.message}`);
  }
};


  //使用者職位儲存
  const sendJobInfoToBackend = async () => {
    try {
      await fetch('/api/user/jobInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          
          username: username, 
          jobCategory: jobCategory,
          jobTitle: jobTitle
        })
      });
      console.log('✅ 職業資訊儲存成功');
    } catch (error) {
      console.error('儲存職業資訊失敗', error);
      // 這裡不需要 alert，因為不影響主流程
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setStatus('離線');
    setUsername('');
    navigate('/');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: '"Microsoft JhengHei", sans-serif',
      color: '#000',
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover'
    }}>
      {/* Header */}
<div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  background: 'rgba(255,255,255,0.85)',
  padding: '20px 40px', // header 左右 padding
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center'
}}>
  {/* 標題 */}
  <h1 style={{ margin: 0, color: '#8B4513', fontWeight: '700', fontSize: '2.5rem', flex: 1,textAlign: 'left' }}>
    AI 履歷健診
  </h1>

  {/* 右上角狀態 + 登出 */}
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'flex-end',
    minWidth: '250px',
    flexShrink: 0,
    marginRight: '40px' // 往左移，離右邊 40px
  }}>
    {/* 頭像 */}
    <div style={{
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
      flexShrink: 0
    }}>
      {username ? username.charAt(0).toUpperCase() : "👤"}
    </div>

    {/* 名稱 + 狀態 */}
    {/* 修正：使用狀態變數來顯示，而不是硬編碼 */}
    <div style={{ textAlign:'left' }}>
      <div style={{ fontWeight:'600' }}>
        {username || '訪客'}
      </div>
      <div style={{ fontSize:'0.9rem', color: status === '在線' ? 'green' : '#888' }}>
        <b>狀態：{status}</b>
      </div>
    </div>

    {/* 登出按鈕 */}
    <button 
      onClick={handleLogout} 
      style={{
        padding: "8px 16px",
        background: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        flexShrink: 0,
        marginLeft: '12px'
      }}
    >
      登出
    </button>
  </div>
</div>


      {/* 內容卡片 */}
      <div style={{ flex: 1, display:'flex', justifyContent:'center', paddingTop:'100px', paddingBottom:'40px' }}>
        <div style={{
          width: '100%',
          maxWidth: '900px',
          background: '#fff',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 12px 25px rgba(0,0,0,0.12)',
          boxSizing: 'border-box'
        }}>
          {/* 標題 */}
          <h2 style={{ color: '#6F4E37', fontSize: '40px', textAlign: 'center', marginBottom: '25px' }}>
            選擇職業資訊
          </h2>

          {/* 職業選擇 */}
          <div style={{ display:'flex', gap:'40px', flexWrap:'wrap', justifyContent:'center', marginBottom:'30px' }}>
            <div style={{ minWidth:'180px' }}>
              <label style={{ display:'block', marginBottom:'8px', fontWeight:'600' }}>職業類別</label>
              <select 
                value={jobCategory} 
                onChange={(e)=>{ setJobCategory(e.target.value); setJobTitle('');}} 
                style={{ width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ccc', fontSize:'1rem' }}
              >
                <option value="">請選擇</option>
                <option value="it">資訊科技 (IT)</option>
                <option value="marketing">行銷</option>
                <option value="design">設計</option>
                <option value="education">教育</option>
                <option value="finance">金融</option>
              </select>
            </div>
            <div style={{ minWidth:'180px' }}>
              <label style={{ display:'block', marginBottom:'8px', fontWeight:'600' }}>職稱</label>
              <select 
                value={jobTitle} 
                onChange={(e)=> setJobTitle(e.target.value)}
                disabled={!jobCategory}
                style={{ width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ccc', fontSize:'1rem' }}
              >
                <option value="">{jobCategory ? '請選擇職稱' : '請先選擇職業類別'}</option>
                {currentTitles.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* 顯示選擇結果 */}
          <div style={{ marginBottom:'30px', padding:'12px', background:'#f9f9f9', border:'1px solid #ddd', borderRadius:'8px', fontSize:'1rem', fontWeight:'500', textAlign:'center' }}>
            已選擇：類別：{jobCategory || '未選擇'} ／ 職稱：{jobTitle || '未選擇'}
          </div>

          {/* 上傳履歷 */}
          <div style={{ textAlign:'center' }}>
            <h3 style={{ color:'#6F4E37', fontSize: '40px', textAlign: 'center', marginBottom: '25px' }}>上傳履歷</h3>
            <FileUpload setResumeText={setResumeText} setResumeFile={handleFileUpload} />
            <div style={{ marginTop: '18px' }}>
              <button 
                onClick={() => setShowPreview(true)} 
                disabled={!pdfFile} 
                style={{ 
                  padding: "10px 20px", 
                  background: pdfFile ? "#6F4E37" : "#cc8d60ff", 
                  color:"#fff", 
                  border:"none", 
                  borderRadius:"8px", 
                  cursor: pdfFile ? "pointer" : "not-allowed", 
                  marginRight:'12px' 
                }}>
                  預覽履歷
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={!pdfFile} 
                style={{ 
                  padding: "10px 20px", 
                  background: pdfFile ? "#6F4E37" : "#cc8d60ff", 
                  color:"#fff", 
                  border:"none", 
                  borderRadius:"8px", 
                  cursor: pdfFile ? "pointer" : "not-allowed" 
                }}>
                  提交履歷
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '10px 0',
        textAlign: 'center',
        fontSize: '0.9em',
        color: '#040404ff',
        width: '100%',
        background: 'rgba(255,255,255,0.9)',
        marginTop: 'auto',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
      }}>
       2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
      </footer>

      {/* PDF 預覽 */}
      {showPreview && pdfFile && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setShowPreview(false)} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform:"translate(-50%, -50%)", background:"white", padding:"20px", borderRadius:"12px", zIndex:1000, width:"90%", maxWidth:"1000px", maxHeight:"90%", overflow:"auto" }}>
            <ResumePreview file={pdfFile} text={resumeText} style={{ width: "100%", height: "80vh" }} />
            <div style={{ textAlign:"right" }}>
              <button onClick={() => setShowPreview(false)} style={{ marginTop:"12px", padding:"8px 14px", background:"#dc3545", color:"white", border:"none", borderRadius:"6px", cursor:"pointer" }}>關閉</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}