import axios from 'axios';

const URL = 'https://wallet-api-production-d865.up.railway.app';

const registerLoginUser = async (body, isLogin) => {
  try {
    const jwtToken = await axios.post(`${URL}/${isLogin ? 'user/login' : 'user'}`, body);
    return jwtToken;
  } catch (error) {
    console.log(error);
  }
};

export default registerLoginUser;
