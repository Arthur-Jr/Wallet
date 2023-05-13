import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getCambio from '../globalFuncs/CambioFunc';
import DeleteEditButtons from './DeleteEditButtons';
import '../Css/MobileDetails.css';
import { setDetailsStatus } from '../Redux/actions';
import getKeyByValue from '../globalFuncs/getObjectKeyByValue';
import Tags from '../util/Tags';
import paymentMethods from '../util/paymentMethods';

class MobileDetails extends React.Component {
  render() {
    const { expense:
      { description, tag, method, value, currency, exchangeRates, expenseId },
    setDetails } = this.props;
    const { ask, name } = exchangeRates.find(({ code }) => code === currency);
    const selectedCurrency = 'Real';

    return (
      <main className="Mobile-details">
        <button type="button" onClick={ setDetails }>X</button>
        <div className="details-main">
          <section className="details-section">
            <h5>Descrição:</h5>
            <h4 id="description">{ description }</h4>
            <h5>Tag:</h5>
            <h4 id="tag">{ getKeyByValue(Tags, tag) }</h4>
            <h5>Método de pagamento:</h5>
            <h4 id="method">{ getKeyByValue(paymentMethods, method) }</h4>
            <h5>Valor:</h5>
            <h4 id="value">{ Number(value).toFixed(2) }</h4>
          </section>

          <section className="details-section">
            <h5>Moeda:</h5>
            <h4 id="name">{ name.slice(0, name.indexOf('/')) }</h4>
            <h5>Câmbio utilizado:</h5>
            <h4 id="ask">{ Number(ask).toFixed(2) }</h4>
            <h5>Moeda de conversão:</h5>
            <h4 id="real">{ selectedCurrency }</h4>
            <h5>Valor convertido:</h5>
            <h4 id="currency">{ getCambio(value, ask).toFixed(2) }</h4>
          </section>
        </div>
        <section className="button-section">
          <DeleteEditButtons expenseId={ expenseId } />
        </section>
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setDetails: () => dispatch(setDetailsStatus()),
});

MobileDetails.propTypes = {
  expense: PropTypes.shape({
    expenseId: PropTypes.string,
    description: PropTypes.string,
    tag: PropTypes.string,
    method: PropTypes.string,
    value: PropTypes.string,
    currency: PropTypes.string,
    exchangeRates: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
  setDetails: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(MobileDetails);
