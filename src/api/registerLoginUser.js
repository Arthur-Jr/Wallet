import axios from 'axios';

const URL = process.env.REACT_APP_ENDPOINT || 'http://localhost:8080';

const registerLoginUser = async (body, isLogin) => {
  try {
    const jwtToken = await axios.post(`${URL}/user${isLogin ? '/login' : ''}`, body);
    return jwtToken.data;
  } catch (error) {
    return error.response.data;
  }
};

export default registerLoginUser;
