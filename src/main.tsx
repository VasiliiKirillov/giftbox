import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './App.tsx';
import './index.css';
import { store } from './store/store';
import './utils/api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
