import React from 'react';
import gitIcon from '../Image/gitHubIcon.svg';
import linkedinIcon from '../Image/linkedin.svg';

class Footer extends React.Component {
  openSocial(url) {
    window.open(url, '_blank');
  }

  render() {
    return (
      <footer className="main-footer" data-testid="footer">
        <button
          type="button"
          onClick={ () => this.openSocial('https://github.com/Arthur-Jr') }
          data-testid="social-icon"
        >
          <img src={ gitIcon } alt="github icon" />
        </button>

        <button
          type="button"
          onClick={ () => this.openSocial('https://www.linkedin.com/in/arthur-jr/') }
          data-testid="social-icon"
        >
          <img src={ linkedinIcon } alt="linkedin icon" />
        </button>
      </footer>
    );
  }
}

export default Footer;
