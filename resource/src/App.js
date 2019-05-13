import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Provider} from 'react-redux';
import {BrowserRouter, HashRouter, Route} from 'react-router-dom';
import store from './store'
import Home from './pages/home'
import Header from './common/header'
import Apply from './pages/apply'
import Check from './pages/check'
import Award from './pages/award'
import Organization from './pages/organization'

import ApplyDetail from './pages/applyDetail'
import checkDetail from './pages/checkDetail'
import AwardDeail from './common/awardDetail'
import * as actionCreators from './pages/home/store/actionCreators'
import EditAward from "./pages/editAward";
import {LocaleProvider} from "antd";
import zhCN from 'antd/lib/locale-provider/zh_CN';

class App extends Component {
    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <Provider store={store}>
                    <HashRouter>
                        <div>
                            <Header/>
                            <Route path='/' exact component={Home}/>
                            <Route path='/apply' exact component={Apply}/>
                            <Route path='/check' exact component={Check}/>
                            <Route path='/organization' exact component={Organization}/>
                            <Route path='/award' exact component={Award}/>
                            {/*<Route path='/newApply/:id' exact component={NewApply}/>*/}
                            <Route path='/award/:id' exact component={AwardDeail}/>
                            {/*<Route path='/editApply/:award_id' exact component={EditApply}/>*/}
                            <Route path='/applyDetail/:id?' exact component={ApplyDetail}/>

                            <Route path='/checkDetail/:award_id' exact component={checkDetail}/>
                            <Route path='/editAward/:id?' exact component={EditAward}/>


                        </div>
                    </HashRouter>

                </Provider>
            </LocaleProvider>
        )
    }

}

export default App;
