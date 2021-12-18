import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { setFormStatus, setScreenType } from './Redux/actions';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import NotFound from './components/NotFound';
import './Css/App.css';

function App({ setScreen, setForm }) {
  useEffect(() => {
    const resizeListener = () => {
      const PHONE_WIDTH_PX = 650;
      if (window.innerWidth > PHONE_WIDTH_PX) {
        setScreen(false);
        setForm(true);
      } else {
        setScreen(true);
      }
    };

    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [setScreen, setForm]);

  return (
    <Switch>
      <Route path="/wallet/carteira" component={ Wallet } />
      <Route exact path="/wallet/" component={ Login } />
      <Route path="/wallet/*" component={ NotFound } />
    </Switch>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setScreen: (phoneStatus) => dispatch(setScreenType(phoneStatus)),
  setForm: (status) => dispatch(setFormStatus(status)),
});

App.propTypes = {
  setScreen: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(App);
