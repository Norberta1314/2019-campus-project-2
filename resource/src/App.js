import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './store'
import Header from './common/header'
import Apply from './pages/apply'

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <div>
            <Header/>
            <Route path='/apply' exact component={ Apply }/>
          </div>
        </BrowserRouter>

      </Provider>
    )
  }
}

export default App;
