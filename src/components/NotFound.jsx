import React from 'react';
import { Link } from 'react-router-dom';
import '../Css/notFound.css';
import notFoundGif from '../Image/notFound.gif';

class NotFound extends React.Component {
  render() {
    return (
      <main className="main-notFound">
        <section>
          <img src={ notFoundGif } alt="Contando dinheiro" />
          <h1>404 - Página não encontrada</h1>
        </section>
        <Link to="/wallet/">Retornar para login</Link>
      </main>
    );
  }
}

export default NotFound;
