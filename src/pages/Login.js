import React from 'react';
import PropTypes from 'prop-types';
import Jwt from 'jsonwebtoken';
import { HttpStatusCode } from 'axios';
import Button from '../components/Controled-Components/Button';
import Input from '../components/Controled-Components/Inputs';
import registerLoginUser from '../api/registerLoginUser';
import '../Css/Login.css';
import logo from '../Image/new-logo.png';
import getAllExpenses from '../api/getAllExpenses';
import localStorageVarNames from '../util/localStorageVarNames';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailStatus: true,
      passwordStatus: true,
      isLogin: true,
      errorMessage: '',
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    const walletEndpoint = '/wallet/carteira';
    history.push(walletEndpoint);

    const token = Jwt.decode(localStorage.getItem(localStorageVarNames.jwtToken));
    const timeAtMoment = new Date();

    if (token) {
      getAllExpenses(localStorage.getItem('token')).then((response) => {
        if (response.status !== HttpStatusCode.Forbidden
          && token.exp < timeAtMoment.getTime()) {
          history.push(walletEndpoint);
        }
      });
    }
  }

  validateEmail(email) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return false;
    }
    return true;
    // Referência sobre o regex para email, neste link:
    // https://www.w3resource.com/javascript/form/email-validation.php
  }

  handleEmail({ target: { value } }) {
    this.setState({
      email: value,
      emailStatus: this.validateEmail(value),
    });
  }

  handlePassword({ target: { value } }) {
    const PASSWORD_CONDITION = 6;
    if (value.length >= PASSWORD_CONDITION) {
      this.setState({ password: value, passwordStatus: false });
    } else {
      this.setState({ password: value, passwordStatus: true });
    }
  }

  async handleClick() {
    const { email, password, isLogin } = this.state;
    const { history } = this.props;

    const response = await registerLoginUser({ username: email, password }, isLogin);
    if (response.token) {
      localStorage.setItem('token', response.token);
      history.push('/wallet/carteira');
    } else {
      this.setState({ errorMessage: response.message });
    }
  }

  handlePageChange() {
    this.setState((prev) => ({ isLogin: !prev.isLogin }));
  }

  render() {
    const { emailStatus, passwordStatus, email, isLogin, errorMessage } = this.state;
    return (
      <main className="login-main">
        <div className="logo-div">
          <img src={ logo } alt="Wallet icon" />
        </div>
        <div className="form-div">
          <h1 data-testid="title">{ isLogin ? 'Login' : 'Register' }</h1>
          <form className="login-form">
            <Input
              type="email"
              testId="email-input"
              text="Email"
              name="email"
              handleChange={ this.handleEmail }
              value={ email }
            />
            <label htmlFor="password-input">
              <input
                type="password"
                id="password-input"
                data-testid="password-input"
                placeholder="Password"
                name="password"
                onChange={ this.handlePassword }
              />
            </label>
            <Button
              text={ isLogin ? 'Login' : 'Registrar' }
              handleClick={ this.handleClick }
              status={ emailStatus || passwordStatus }
              className={ !emailStatus && !passwordStatus ? 'active' : '' }
            />
          </form>

          { errorMessage.length > 0
            && <span className="message-span">{errorMessage}</span> }

          <button
            onClick={ () => this.handlePageChange() }
            type="button"
            className="change-page-status-btn"
          >
            { isLogin ? 'Registrar-se' : 'Login' }
          </button>
        </div>
      </main>
    );
  }
}

// const mapDispatchToProps = (dispatch) => ({
//   login: (email) => dispatch(logged(email)),
// });

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Login;
