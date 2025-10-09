import React from 'react';
<LoadCanvasTemplateNoReload />

function CaptchaBlock({ value, onChange }) {
  return (
    <div className="captcha-block">
      <LoadCanvasTemplate />
      <input
        placeholder="請輸入上方驗證碼"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
    
  );
}

export default CaptchaBlock;
