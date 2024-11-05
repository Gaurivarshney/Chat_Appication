import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';


let persistor = persistStore(store)
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
  <ToastContainer/>
    <App />

  </PersistGate>

  </Provider>
  </StrictMode>,
)
