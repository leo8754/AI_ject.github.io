export const sendRegisterRequest = async (data) => {
  const response = await fetch('http://localhost:8080/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const text = await response.text(); // 抓原始文字回應

  if (!response.ok) {
    const error = new Error('註冊失敗');
    error.response = { text: () => Promise.resolve(text) }; // 包裝錯誤訊息給前端用
    throw error;
  }

  try {
    return JSON.parse(text); // 如果是 JSON 就解析
  } catch {
    return { message: text }; // 如果不是 JSON，就包成物件
  }
};
