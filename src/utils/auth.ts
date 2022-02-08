const isLogin = () => {
  return !!localStorage.getItem('token'); // 两个!转换为 boolean
};

const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

const clearToken = () => {
  localStorage.removeItem('token');
};

export { isLogin, getToken, setToken, clearToken };
