// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import bgImg from './components/background.jpg';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setUsername(savedUser);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const avatarColor = '#6F4E37';

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
      alert('請填寫所有必填欄位 (*) 並同意隱私政策');
      return;
    }
    console.log('表單資料:', formData);
    alert('資料已儲存！');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <h1>AI 履歷健診</h1>
        <div className="user-info">
          <div className="avatar">{username ? username.charAt(0).toUpperCase() : "?"}</div>
          <div className="user-text">
            <div className="username">{username}</div>
            <div className="status" style={{ color: 'green' }}>
           <b>狀態：在線</b>
          </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>登出</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 style={{ color: '#934e1dff', fontSize: '30px', fontWeight: 'bold' }}>
  健檢表單 - 基本個人資料
</h2>
        <div className="form-card">
          <p className="form-desc">
            <b>本表單主要用於收集您的個人基本資料，以便 AI 履歷健檢專題分析您的履歷背景、技能與職涯資訊，提供個人化建議。</b>
            <br /><br />
            <span className="required">*</span> 表示必填欄位。
          </p>

          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="姓名 / 暱稱 *" value={formData.name} onChange={handleChange} required />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">性別 *</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="其他">其他</option>
            </select>
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            <input type="tel" name="phone" placeholder="手機電話 *" value={formData.phone} onChange={handleChange} required />
            <input type="email" name="email" placeholder="電子郵件 *" value={formData.email} onChange={handleChange} required />
            <input type="text" name="address" placeholder="通訊地址" value={formData.address} onChange={handleChange} />
            <input type="text" name="education" placeholder="最高學歷 *" value={formData.education} onChange={handleChange} />
            <input type="text" name="major" placeholder="科系 *" value={formData.major} onChange={handleChange} />
            <input type="text" name="occupation" placeholder="目前職業" value={formData.occupation} onChange={handleChange} />
            <select name="workType" value={formData.workType} onChange={handleChange} required>
              <option value="">工作性質 *</option>
              <option value="全職">全職</option>
              <option value="兼職">兼職</option>
              <option value="自由工作者">自由工作者</option>
              <option value="學生">學生</option>
              <option value="其他">其他</option>
            </select>
            <input type="text" name="workYears" placeholder="工作年資" value={formData.workYears} onChange={handleChange} />
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
              <option value="">婚姻狀況</option>
              <option value="未婚">未婚</option>
              <option value="已婚">已婚</option>
              <option value="離異">離異</option>
            </select>
            <input type="text" name="hobbies" placeholder="興趣 / 愛好" value={formData.hobbies} onChange={handleChange} />
            <select name="exerciseFreq" value={formData.exerciseFreq} onChange={handleChange}>
              <option value="">每週運動頻率</option>
              <option value="不運動">不運動</option>
              <option value="1~2次">1~2 次</option>
              <option value="3~4次">3~4 次</option>
              <option value="5次以上">5 次以上</option>
            </select>

            {/* ✅ Checkbox 改良版 */}
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="privacyAgree"
                name="privacyAgree"
                checked={formData.privacyAgree}
                onChange={handleChange}
                required
              />
              <label htmlFor="privacyAgree">
                我已閱讀並同意 <a href="#" className="underline">隱私政策</a> *
              </label>
            </div>

            <button type="submit">儲存資料</button>
          </form>
        </div>

        {/* Navigation */}
        <div className="page-nav">
          <button onClick={() => navigate('/first')}>← 上一步</button>
          <button onClick={() => navigate('/FormPage1')}>下一步 →</button>
        </div>
      </div>

      {/* Footer */}
      <footer>
        2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
      </footer>

      {/* ===== CSS ===== */}
      <style jsx>{`
        .dashboard-container {
          font-family: "Microsoft JhengHei", sans-serif;
          color: #000;
          background-image: url(${bgImg});
          background-size: cover;
          background-position: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(255,255,255,0.85);
          padding: 20px 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          gap: 5px;
          margin-right: 40px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${avatarColor};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }

        .logout-btn {
          padding: 8px 16px;
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 100px;
          gap: 20px;
          padding: 0 30px;
        }

        .form-card {
          width: 80%;
          max-width: 700px;
          padding: 30px 35px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          border: 1px solid #e0e0e0;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input, select {
          padding: 12px 14px;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        /* ✅ Checkbox 排版完全置中不跑版 */
        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: nowrap;
        }

        .checkbox-container input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-container label {
          font-size: 0.95rem;
          color: #333;
          cursor: pointer;
        }

        .checkbox-container a {
          color: #6F4E37;
          text-decoration: underline;
        }

        form button {
          padding: 14px 32px;
          background: #6F4E37;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
        }

        form button:hover {
          background: #8B4513;
        }

        footer {
          margin-top: auto;
          padding: 20px 0;
          background-color: rgba(255,255,255,0.9);
          text-align: center;
          font-size: 0.9em;
          color: #1a1919ff;
          width: 100%;
        }

        /* ===== 響應式 ===== */
        @media (max-width: 768px) {
          .form-card {
            width: 95%;
            padding: 20px;
          }
          .checkbox-container {
            gap: 8px;
          }
          .checkbox-container label {
            font-size: 0.9rem;
            line-height: 1.4;
          }
        }
      `}</style>
    </div>
  );
}
