import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import Footer from './Components/footer/footer'; // Adjust the import path if necessary

const client = new ApolloClient({
  uri: 'https://homebite-app-c680d0ee15d5.herokuapp.com/graphql', // Replace with your GraphQL server URI
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <div className="main-layout">
        <div className="main-content">
          <App />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  </ApolloProvider>
);
