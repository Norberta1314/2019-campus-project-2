import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './store'
import Header from './common/header'
import Apply from './pages/apply'
import Check from './pages/check'
import Award from './pages/award'
import Organization from './pages/organization'

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <div>
            <Header/>
            <Route path='/apply' exact component={ Apply }/>
            <Route path='/check' exact component={ Check }/>
            <Route path='/organization' exact component={ Organization }/>
            <Route path='/award' exact component={ Award }/>
          </div>
        </BrowserRouter>

      </Provider>
    )
  }
}

export default App;
