import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Form, Spinner, ListGroup, Alert } from 'react-bootstrap';
import { debounce } from 'lodash';
import { requestAction } from '../actions';


const ExchangeWidget = (props) => {

  const { supportedCurrencies } = props;

  const [fromCurrencyValue, setFromCurrencyValue] = useState('USD');
  const [toCurrencyValue, setToCurrencyValue] = useState('USD');
  const [amountValue, setAmountValue] = useState(0);

  const [ 
    receivedRateValue,
    expectedAmountValue,
    fetching,
    error
  ] = useSelector(({data, fetching, error}) => [
      data?.exchange_rate,
      data?.amount,
      fetching,
      error
  ]);

  const dispatch = useDispatch();
  
  const exchangeCurrency = (data) => {
    dispatch(requestAction(data));
  }

  useEffect(() => {
      if( amountValue > 0 ) {
          exchangeCurrency({
            from_currency_code: fromCurrencyValue,
            to_currency_code:  toCurrencyValue,
            amount: amountValue,
          });
          handleAmountChange.cancel();
      }
  }, [fromCurrencyValue, toCurrencyValue, amountValue, handleAmountChange]);
  
  const handleFromCurrencyChange = (currency) => {
    setFromCurrencyValue(currency);
  }

  const handleToCurrencyChange = (currency) => {
    setToCurrencyValue(currency);
  }

  const handleAmountChange = debounce(async (amount) => {
    await setAmountValue(amount);
  }, 300);


  const ResultSection = () => {
    if(receivedRateValue && expectedAmountValue){
      return (
        <ListGroup className="mt-4" >
          <ListGroup.Item>
            <b>received rate:</b> <span>{receivedRateValue}</span>
          </ListGroup.Item>
          <ListGroup.Item>
            <b>expected amount:</b> <span>{expectedAmountValue}</span>
          </ListGroup.Item>
        </ListGroup>
      );
    }
    return null;
  };

  const Preloader = () => (
    <div className='mt-4 text-center'>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>
  );

  const CurrencySelect = ({ attrs: { id, groupClass, selectClass }, label, defaultValue, handleChange, currencies }) => (
    <Form.Group className="mt-2">
      <Form.Label htmlFor={ id }>{ label }</Form.Label>
      <Form.Select
        id={id}
        className={selectClass}
        defaultValue={defaultValue}
        disabled={fetching}
        onChange = {(e) => handleChange(e.target.value)}>
          { 
            currencies &&
            Array.isArray(currencies) &&
            currencies.map((currency) => (<option key={currency} value={currency}>{currency}</option>)) 
          }
      </Form.Select>
    </Form.Group>
  );

  const ErrorOutput = ({ error }) => {
      const serverMessage = error?.response?.data?.message;
      return (
          <Alert variant="danger" className="mt-4">
              { serverMessage || error.message }
          </Alert>
      );
  }

  return (
      <Container className="exchange-widget">
        {(supportedCurrencies && Array.isArray(supportedCurrencies)) && 
          <>
            <CurrencySelect
              key="from_currency_code"
              attrs={{ id: "from_currency_code" }}
              label="From currency:"
              defaultValue={fromCurrencyValue}
              handleChange={handleFromCurrencyChange}
              currencies={supportedCurrencies}
            />

            <CurrencySelect
              key="to_currency_code"
              attrs={{ id: "to_currency_code" }}
              label="To currency:"
              defaultValue={toCurrencyValue}
              handleChange={handleToCurrencyChange}
              currencies={supportedCurrencies}
            />

            <Form.Group className="mt-2">
              <Form.Label htmlFor="amount">Amount</Form.Label>
              <Form.Control
                type="number"
                id="amount"
                disabled={fetching}
                defaultValue={amountValue}
                min="1"
                onChange={(e) => handleAmountChange(e.target.value)}
              />
            </Form.Group>
            { fetching ? <Preloader/> : <ResultSection /> }
            { error && <ErrorOutput error={error} /> }
          </>
        }
      </Container>

  );
};

export default ExchangeWidget;