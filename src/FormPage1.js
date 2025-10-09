// src/PersonalityFormPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bgImg from './components/background.jpg';

export default function PersonalityFormPage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({});
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // 回頂部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // 讀取登入者
  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setUsername(savedUser);
  }, []);

  // 顏色頭像
  const colors = ["#6F4E37"];
  const avatarColor = useMemo(() => {
    if (!username) return colors[0];
    const charCode = username.charCodeAt(0);
    return colors[charCode % colors.length];
  }, [username]);

  // 登出
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  // 問卷內容
  const questionLib = [
    "我喜歡嘗試新事物 (1=非常不認同，10=非常認同)",
    "我對藝術和美感有高度興趣 (1=非常不認同，10=非常認同)",
    "我喜歡思考抽象的概念或哲學問題 (1=非常不認同，10=非常認同)",
    "我常有新奇的想法或創意 (1=非常不認同，10=非常認同）",
    "我會事先計劃好工作或生活 (1=非常不認同，10=非常認同)",
    "我做事有條理，按部就班 (1=非常不認同，10=非常認同)",
    "我能夠自我約束，不輕易拖延 (1=非常不認同，10=非常認同)",
    "我對達成目標有強烈動力 (1=非常不認同，10=非常認同)",
    "我喜歡和很多人互動 (1=非常不認同，10=非常認同)",
    "我在社交場合感到自在和有活力 (1=非常不認同，10=非常認同)",
    "我喜歡參加聚會或團體活動 (1=非常不認同，10=非常認同)",
    "我容易與他人建立友好關係 (1=非常不認同，10=非常認同)",
    "我樂於幫助他人，善解人意 (1=非常不認同，10=非常認同)",
    "我傾向信任他人，而不是懷疑 (1=非常不認同，10=非常認同)",
    "我會避免衝突，維持和諧關係 (1=非常不認同，10=非常認同)",
    "我容易體諒別人的需求和感受 (1=非常不認同，10=非常認同)",
    "我容易感到焦慮或緊張 (1=非常不認同，10=非常認同)",
    "我情緒容易波動 (1=非常不認同，10=非常認同)",
    "我會對小事感到擔憂或不安 (1=非常不認同，10=非常認同)",
    "我有時候會感到沮喪或心情低落 (1=非常不認同，10=非常認同)"
  ];

  const questions = questionLib.map((text, i) => ({
    id: i + 1,
    text: `第 ${i + 1} 題: ${text}`
  }));

  const initialValues = {};
  questions.forEach(q => initialValues[`question${q.id}`] = "");
  initialValues.responseContext = "";

  useEffect(() => {
    setFormData(initialValues);
  }, []);

  useEffect(() => {
    validateAll();
  }, [formData]);

  function validateAll() {
    const e = {};
    for (let i = 1; i <= 20; i++) {
      const key = `question${i}`;
      if (!formData[key]) e[key] = "請完成所有欄位";
    }
    setErrors(e);
    setIsValid(Object.keys(e).length === 0);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(s => ({ ...s, [name]: value }));
    setTouched(s => ({ ...s, [name]: true }));
  }

  function resetForm() {
    setFormData(initialValues);
    setTouched({});
    setErrors({});
    setIsValid(false);
  }

  // ✅ 最佳實務版：柔和提示 + 延遲跳轉
  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) {
      alert("請先完成所有題目再送出！");
      return;
    }

    window.alert("✅ 表單完成！系統即將跳轉...");
    setTimeout(() => navigate('/Upload'), 1000); // 1 秒後跳轉
  }

  return (
    <div className="personality-page">
      {/* Header */}
      <header className="header">
        <h1>AI 履歷健診</h1>
        <div className="user-info">
          <div className="avatar" style={{ backgroundColor: avatarColor }}>
            {username ? username.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="status">
            <div className="username">{username}</div>
            <div className="online"><b>狀態：在線</b></div>
          </div>
          <button onClick={handleLogout} className="logout-btn">登出</button>
        </div>
      </header>

      {/* Main */}
      <main className="form-container">
        <h2>人格特質表單</h2>
        <p className="intro">
          <b>填寫此表單能協助 AI 更準確分析您的優勢，打造與您特質相符的履歷優化建議。</b>
        </p>
        <form onSubmit={handleSubmit}>
          {questions.map(q => (
            <div key={q.id} className="question">
              <label>{q.text} <span style={{ color: 'red' }}>*</span></label>
              <select
                name={`question${q.id}`}
                value={formData[`question${q.id}`] || ""}
                onChange={handleChange}
              >
                <option value="">請選擇</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              {touched[`question${q.id}`] && errors[`question${q.id}`] && (
                <div className="error">{errors[`question${q.id}`]}</div>
              )}
            </div>
          ))}

          <div className="textarea-block">
            <p>對於這份表單有任何想法，歡迎在下方區域留言：</p>
            <textarea
              name="responseContext"
              value={formData.responseContext || ""}
              onChange={handleChange}
              placeholder="告訴我你的想法"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={!isValid}>送出</button>
            <button type="button" onClick={resetForm} className="submit-btn">重設</button>
          </div>
          <div className="form-status">
            {isValid ? <span className="valid">資料填寫完畢，可以送出 ✅</span>
                      : <span className="invalid">尚有錯誤或未填欄位 ❌</span>}
          </div>
        </form>
      </main>

      <footer className="footer">
        2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
      </footer>

      {/* CSS：完全套用 Dashboard 樣式 */}
      <style jsx>{`
        .personality-page {
          font-family: "Microsoft JhengHei", sans-serif;
          color: #000;
          background-image: url(${bgImg});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          min-height: 100vh;
          padding: 0.2px 20px 120px 20px;
          box-sizing: border-box;
        }
        .header {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          background: rgba(255,255,255,0.85);
          padding: 15px 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          flex-wrap: wrap;
        }
        .header h1 {
          margin: 0;
          color: #6F4E37;
          font-weight: 700;
          font-size: 2rem;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: 45px;
        }
        .avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 18px;
        }
        .status .username { font-weight: 600; }
        .status .online { font-size: 0.9rem; color: green; }
        .logout-btn {
          padding: 8px 16px;
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .form-container {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin: 140px auto 0 auto;
          max-width: 700px;
          text-align: center;
        }
        .form-container h2 {
          color: #6F4E37;
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 2rem;
        }
        .intro {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 20px;
        }
        select, textarea {
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 8px;
          font-size: 1rem;
          box-sizing: border-box;
        }
        .question { margin-bottom: 15px; text-align: left; }
        .error { color: red; font-size: 0.85rem; }
        .textarea-block { margin-top: 20px; text-align: left; }
        .button-group {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 20px;
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
        .form-status {
          margin-top: 10px;
          font-size: 0.9rem;
        }
        .valid { color: green; }
        .invalid { color: red; }

        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          text-align: center;
          padding: 15px 10px;
          background: rgba(255,255,255,0.9);
          border-top: 1px solid #ddd;
          font-size: 0.9rem;
          color: #555;
          z-index: 99;
        }

        @media (max-width: 768px) {
          .header h1 { font-size: 1.8rem; }
          .user-info { flex-wrap: wrap; margin-top: 8px; gap: 5px; }
          .form-container { margin: 160px 10px 0 10px; padding: 20px; }
        }
        @media (max-width: 480px) {
          .header h1 { font-size: 1.5rem; }
          .avatar { width: 35px; height: 35px; font-size: 16px; }
          .logout-btn { padding: 5px 10px; font-size: 0.85rem; }
          .submit-btn { padding: 8px 16px; font-size: 0.9rem; }
          .intro { font-size: 0.85rem; }
        }
      `}</style>
    </div>
  );
}
