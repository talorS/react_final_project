import { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import MainComp from './MainPage';
import ManageUsersComp from '../Users/ManageUsersPage';
import MoviesComp from '../Movies/MoviesPage';
import SubscriptionsComp from '../Members/SubscriptionsPage';

class DashboardComp extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <MainComp {...this.props}>
        <Switch>
          <Route path='/MainPage/ManageUsersPage' component={ManageUsersComp} />
          <Route path='/MainPage/MoviesPage' component={MoviesComp} />
          <Route path='/MainPage/SubscriptionsPage' component={SubscriptionsComp} />
        </Switch>
      </MainComp>
    )
  }
}

export default DashboardComp;
