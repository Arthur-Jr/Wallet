import axios from 'axios';

const URL = process.env.REACT_APP_ENDPOINT || 'http://localhost:8080';

const getAllExpenses = async (token) => {
  try {
    const header = { headers: { Authorization: `Bearer ${token}` } };
    const userData = await axios.get(`${URL}/user`, header);
    return userData;
  } catch (e) {
    return e.response;
  }
};

export default getAllExpenses;
