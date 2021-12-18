import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logged } from '../Redux/actions';
import Button from '../components/Controled-Components/Button';
import Input from '../components/Controled-Components/Inputs';
import '../Css/Login.css';
import logo from '../Image/new-logo.png';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailStatus: true,
      passwordStatus: true,
    };

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
      this.setState({ passwordStatus: false });
    } else {
      this.setState({ passwordStatus: true });
    }
  }

  handleClick() {
    const { email } = this.state;
    const { login, history } = this.props;
    login(email);
    history.push('/wallet/carteira');
  }

  render() {
    const { emailStatus, passwordStatus, email } = this.state;
    return (
      <main className="login-main">
        <div className="logo-div">
          <img src={ logo } alt="Wallet icon" />
        </div>
        <div className="form-div">
          <h1 data-testid="title">Login</h1>
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
              text="Entrar"
              handleClick={ this.handleClick }
              status={ emailStatus || passwordStatus }
              className={ !emailStatus && !passwordStatus ? 'active' : '' }
            />
          </form>
        </div>
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (email) => dispatch(logged(email)),
});

Login.propTypes = {
  login: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
