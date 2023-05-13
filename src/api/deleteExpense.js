import axios from 'axios';

const URL = process.env.REACT_APP_ENDPOINT || 'http://localhost:8080';

const deleteExpense = async (token, id) => {
  try {
    const header = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${URL}/expense/${id}`, header);
    console.log(response);
  } catch (e) {
    console.log(e);
  }
};

export default deleteExpense;
