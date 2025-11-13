import React from 'react';
import ReactDOM from 'react-dom/client';
import { Content } from './Content';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Create a container for the React app
const container = document.createElement('div');
container.id = 'extn-react-content';
document.body.appendChild(container);

// Render the React component
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Content />
    </ErrorBoundary>
  </React.StrictMode>
);
