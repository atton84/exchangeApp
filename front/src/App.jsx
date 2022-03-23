import React from 'react';
import { supportedCurrencies } from './config';
import { ExchangeWidget } from './components';

const App = () => {
    return (
      <div className="app">  
        <ExchangeWidget 
            supportedCurrencies={supportedCurrencies}
        />
      </div>
    );
  }
  
  export default App;