import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HeaderForm from './HeaderForm';
import getCambio from '../globalFuncs/CambioFunc';
import Button from './Controled-Components/Button';
import '../Css/Header.css';
import { setFormStatus, addMultiExpenses } from '../Redux/actions';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  sumExpenses() {
    const { expenses } = this.props;

    return expenses.reduce((acc, { currency, value, exchangeRates }) => {
      const { ask } = exchangeRates.find(({ code }) => code === currency);
      acc += getCambio(value, ask);
      return acc;
    }, 0);
  }

  handleClick() {
    const { setForm } = this.props;
    setForm(true);
  }

  render() {
    const { mobileButton, formStatus } = this.props;

    return (
      <header className="header-main">
        <section className="main-section">
          <h1>MyWallet</h1>
          <div>
            <span
              data-testid="total-field"
            >
              { `${this.sumExpenses().toFixed(2)} BRL` }
            </span>
          </div>
        </section>

        <section
          data-testid="form-section"
          className={ formStatus ? 'form-section' : 'hidden-form' }
        >
          <HeaderForm />
        </section>

        {mobileButton
        && <Button
          text="Adicionar nova despesa"
          className="mobile-button"
          handleClick={ this.handleClick }
        />}
      </header>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setForm: (status) => dispatch(setFormStatus(status)),
  addExpenses: (expenses) => dispatch(addMultiExpenses(expenses)),
});

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
  mobileButton: state.checkScreen.mobileType,
  formStatus: state.checkScreen.formStatus,
});

Header.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
  mobileButton: PropTypes.bool.isRequired,
  formStatus: PropTypes.bool.isRequired,
  setForm: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
