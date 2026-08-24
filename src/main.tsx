import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ActionIndicatorProvider } from './context/ActionIndicatorContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ActionIndicatorProvider>
      <App />
    </ActionIndicatorProvider>
  </StrictMode>,
);
