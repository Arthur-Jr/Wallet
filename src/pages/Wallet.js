import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Jwt from 'jsonwebtoken';
import { HttpStatusCode } from 'axios';
import {
  fetchApi, setFormStatus, setScreenType, addMultiExpenses,
} from '../Redux/actions';
import Header from '../components/Header';
import Table from '../components/Table';
import '../Css/App.css';
import Footer from '../components/Footer';
import getAllExpenses from '../api/getAllExpenses';
import localStorageVarNames from '../util/localStorageVarNames';

class Wallet extends React.Component {
  componentDidMount() {
    const { fetchCurrency, history, addExpenses } = this.props;
    fetchCurrency();

    this.checkSize();

    const token = Jwt.decode(localStorage.getItem(localStorageVarNames.jwtToken));
    const timeAtMoment = new Date();

    if (!token) {
      history.push('/wallet');
    }

    getAllExpenses(localStorage.getItem('token')).then((response) => {
      if (response.status === HttpStatusCode.Forbidden
        || token.exp > timeAtMoment.getTime()) {
        history.push('/wallet');
      }
      return addExpenses(response.data.expensesList);
    });
  }

  checkSize() {
    const { setScreen, setForm } = this.props;
    const PHONE_WIDTH_PX = 650;
    if (window.innerWidth < PHONE_WIDTH_PX) {
      setScreen(true);
      setForm(false);
    } else {
      setScreen(false);
      setForm(true);
    }
  }

  render() {
    const { history } = this.props;

    return (
      <main className="wallet-main">
        <section className="section-main">
          <Header history={ history } />
          <Table />
        </section>
        <Footer />
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchCurrency: () => dispatch(fetchApi()),
  setScreen: (phoneStatus) => dispatch(setScreenType(phoneStatus)),
  setForm: (status) => dispatch(setFormStatus(status)),
  addExpenses: (expenses) => dispatch(addMultiExpenses(expenses)),
});

Wallet.propTypes = {
  fetchCurrency: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
  addExpenses: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(null, mapDispatchToProps)(Wallet);
