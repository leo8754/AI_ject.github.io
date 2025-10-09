import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Users, ClipboardList, Settings, Home, LogOut } from "lucide-react";
import bgImg from './components/background.jpg';

export default function Dashboard() {
  const navigate = useNavigate();
  const goTo = (path) => navigate(path);

  return (
    <div className="flex h-screen text-white">
      {/* 左側選單 */}
      <aside className="w-64 flex flex-col justify-between p-6 bg-black/50 backdrop-blur-lg">
        <div>
          <h1 className="text-2xl font-bold mb-10">AI 履歷健診</h1>
        </div>

        {/* 底部按鈕：只留首頁 + 登出 */}
        <div className="flex flex-col gap-3">
          <SideButton icon={<Home />} text="首頁" onClick={() => goTo("/")} />
          <SideButton icon={<LogOut />} text="登出" onClick={() => goTo("/login")} />
        </div>
      </aside>

      {/* 右側內容區 */}
      <main
        className="flex-1 flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        {/* Header：純深色底 */}
        <header className="p-8 bg-gray-900 border-b border-gray-700">
          <h2 className="text-4xl font-bold text-white">歡迎來到後台管理系統</h2>
        </header>

        {/* 功能區 / 主內容 */}
        <section className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ContentCard
              title="履歷分析"
              desc="上傳並分析履歷"
              onClick={() => goTo("/resume-analysis")}
            />
            <ContentCard
              title="用戶管理"
              desc="管理使用者帳號"
              onClick={() => goTo("/users")}
            />
            <ContentCard
              title="建議紀錄"
              desc="查看歷史 AI 建議"
              onClick={() => goTo("/suggestions")}
            />
            <ContentCard
              title="系統設定"
              desc="權限與參數調整"
              onClick={() => goTo("/settings")}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="p-4 text-center text-sm text-gray-400 border-t border-gray-700 bg-black/30">
          2025 程式驅動 AI 履歷健診團隊 版權所有 | 聯絡我們: contact@airesume.com
        </footer>
      </main>
    </div>
  );
}

// 左側選單按鈕
function SideButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
    >
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );
}

// 主內容卡片
function ContentCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/10 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/20 hover:from-indigo-500 hover:to-purple-500 hover:bg-gradient-to-r transition flex flex-col items-start"
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300 mt-2">{desc}</p>
    </button>
  );
}
