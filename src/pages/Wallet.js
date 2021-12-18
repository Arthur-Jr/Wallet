import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { fetchApi, setFormStatus, setScreenType } from '../Redux/actions';
import Header from '../components/Header';
import Table from '../components/Table';
import '../Css/App.css';
import Footer from '../components/Footer';

class Wallet extends React.Component {
  componentDidMount() {
    const { fetchCurrency } = this.props;
    fetchCurrency();

    this.checkSize();
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
    const { user } = this.props;

    if (user.length === 0) {
      return <Redirect to="/wallet/notFound" />;
    }

    return (
      <main className="wallet-main">
        <section className="section-main">
          <Header />
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
});

const mapStateToProps = (state) => ({
  user: state.user.email,
});

Wallet.propTypes = {
  fetchCurrency: PropTypes.func.isRequired,
  setScreen: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
