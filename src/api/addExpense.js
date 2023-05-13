import axios from 'axios';

const URL = process.env.REACT_APP_ENDPOINT || 'http://localhost:8080';

const addNewExpense = async (token, newExpenseData) => {
  try {
    const header = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${URL}/expense`, newExpenseData, header);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export default addNewExpense;
