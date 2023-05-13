import axios from 'axios';

const URL = process.env.REACT_APP_ENDPOINT || 'http://localhost:8080';

const editExpense = async (id, payload, token) => {
  try {
    const header = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${URL}/expense/${id}`, payload, header);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export default editExpense;
