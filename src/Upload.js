// src/Dashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import bgImg from './components/background.jpg';
import * as mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setUsername(savedUser);
  }, []);

  const colors = ['#6F4E37'];
  const avatarColor = useMemo(() => {
    if (!username) return colors[0];
    const charCode = username.charCodeAt(0);
    return colors[charCode % colors.length];
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleSubmit = () => {
    if (!pdfFile) {
      alert('請先上傳履歷');
      return;
    }
    const score = Math.floor(Math.random() * 41) + 60;
    navigate('/analyze', { state: { resumeFile: pdfFile, resumeText, score } });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    setLoading(true);

    if (ext === 'pdf') {
      setResumeFile(file);
      setPdfFile(file);
      setResumeText('');
      setLoading(false);
    } else if (['doc', 'docx'].includes(ext)) {
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      setResumeText(html);

      const div = document.createElement('div');
      div.innerHTML = html;
      div.style.fontFamily = '"Microsoft JhengHei", sans-serif';
      div.style.lineHeight = '1.5';
      div.style.fontSize = '14pt';
      div.style.width = '595px';
      div.style.position = 'absolute';
      div.style.left = '-9999px';
      document.body.appendChild(div);

      const canvas = await html2canvas(div, { scale: 3 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = 595;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      document.body.removeChild(div);

      const pdfFile = new File(
        [pdfBlob],
        file.name.replace(/\.(docx?|DOCX?)$/, '.pdf'),
        { type: 'application/pdf' }
      );
      setPdfFile(pdfFile);
      setResumeFile(pdfFile);
      setLoading(false);
    } else {
      alert('請上傳 Word 或 PDF');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>AI 履歷健診</h1>
        <div className="user-info">
          <div className="avatar" style={{ backgroundColor: avatarColor }}>
            {username ? username.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="status">
            <div className="username">{username}</div>
            <div className="online">
              <b>狀態：在線</b>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            登出
          </button>
        </div>
      </header>

      <main className="upload-card">
        <p>
          歡迎使用 AI 履歷健診！<br />
          請上傳您的 Word 或 PDF 履歷，我們將自動分析並給出建議。
        </p>
        <input type="file" accept=".doc,.docx,.pdf" onChange={handleFileUpload} />
        {loading && <p className="loading-text">履歷處理中，請稍候...</p>}
        <div className="submit-btn-wrapper">
          <button
            onClick={handleSubmit}
            disabled={!pdfFile || loading}
            className="submit-btn"
          >
            提交履歷 & 立即分析
          </button>
        </div>
        <div className="tips">
          <strong>小提醒：</strong><br />
          1. 履歷中多用量化成果（例如完成過2個專案）。<br />
          2. 簡潔明瞭的自我介紹更容易被 AI 分析抓到重點。
        </div>
      </main>

      <footer className="footer">
        2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
      </footer>

      <style jsx>{`
        .dashboard {
          font-family: "Microsoft JhengHei", sans-serif;
          color: #000;
          background-image: url(${bgImg});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          min-height: 100vh;
          padding: 120px 20px 120px 20px;
          box-sizing: border-box;
        }
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.85);
          padding: 15px 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          flex-wrap: wrap;
        }
        .header h1 {
          margin: 0;
          color: #6f4e37;
          font-weight: 700;
          text-align:left;
          font-size: 2rem;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: 45px;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #6f4e37;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 18px;
        }
        .status .username {
          font-weight: 600;
        }
        .status .online {
          font-size: 0.9rem;
          color: green;
        }
        .logout-btn {
          padding: 8px 16px;
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .upload-card {
          background: #fdfdfd;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin: 140px auto 0 auto;
          max-width: 500px;
          text-align: center;
        }
        .upload-card p {
          margin-bottom: 12px;
          color: #555;
        }
        .loading-text {
          color: #6f4e37;
          margin-top: 10px;
        }
        .submit-btn-wrapper {
          margin-top: 12px;
        }
        .submit-btn {
          padding: 10px 20px;
          background: #c26624ff;
          color: #000;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .submit-btn:disabled {
          background: #d6874eff;
          cursor: not-allowed;
        }
        .tips {
          margin-top: 20px;
          font-size: 0.85rem;
          color: #666;
          text-align: left;
        }
        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          text-align: center;
          padding: 15px 10px;
          background: rgba(255, 255, 255, 0.9);
          border-top: 1px solid #ddd;
          font-size: 0.9rem;
          color: #555;
          z-index: 99;
        }

        /* === 響應式 === */
        @media (max-width: 768px) {
          .header h1 {
            font-size: 1.8rem;
          }
          .user-info {
            flex-wrap: wrap;
            margin-top: 8px;
            gap: 5px;
          }
          .upload-card {
            margin: 160px 10px 0 10px;
            padding: 15px;
          }
        }
        @media (max-width: 480px) {
          .header h1 {
            font-size: 1.5rem;
          }
          .avatar {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }
          .logout-btn {
            padding: 5px 10px;
            font-size: 0.85rem;
          }
          .submit-btn {
            padding: 8px 16px;
            font-size: 0.9rem;
          }
          .tips {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
