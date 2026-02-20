import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';

/**
 * Fichier principale du framework React
 * Utilisation d'un store qui est méthode qui centralise tous les states dans l'application dans une arborescence
 * Balise <App/> qui contient l'application
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
const value = {
    appendTo: 'self',
};

root.render(
  <>
    {/*<React.StrictMode>   In development mode, components are rendered 2 times.*/}
    <PrimeReactProvider value={value}>
      <Provider store={store}>
        <App />
      </Provider>
    </PrimeReactProvider>
    {/*</React.StrictMode>  */}
  </>
);
