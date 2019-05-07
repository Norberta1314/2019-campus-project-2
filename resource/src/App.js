import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './store'
import Home from './pages/home'
import Header from './common/header'
import Apply from './pages/apply'
import Check from './pages/check'
import Award from './pages/award'
import Organization from './pages/organization'
import EditApply from './pages/editApply'
import NewApply from './pages/newApply'
import ApplyDetail from './pages/applyDetail'
import checkDetail from './pages/checkDetail'

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <BrowserRouter>
          <div>
            <Header/>
            <Route path='/home' component={Home}/>
            <Route path='/apply' exact component={ Apply }/>
            <Route path='/check' exact component={ Check }/>
            <Route path='/organization' exact component={ Organization }/>
            <Route path='/award' exact component={ Award }/>
            <Route path='/editApply/:award_id' exact component={ EditApply }/>
            <Route path='/applyDetail/:award_id' exact component={ ApplyDetail }/>
            <Route path='/newApply/:award_id' exact component={ NewApply }/>
            <Route path='/checkDetail/:award_id' exact component={ checkDetail }/>
          </div>
        </BrowserRouter>

      </Provider>
    )
  }
}

export default App;
