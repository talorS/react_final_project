import { Component } from 'react';
import utils from './Utils/dataFetchUtils';
import { connect } from 'react-redux'
import { USER_AUTH } from './Utils/UserAuth';
import firebaseMovies from './Firebase/firebaseMoviesUtils';
import firebaseMembers from './Firebase/firebaseMembersUtils';
import { Switch, Route, Redirect } from 'react-router-dom';
import LoginComp from './Login/LoginPage';
import NewUserComp from './Login/NewUserPage';
import DashboardComp from './Main/DashboardHost';
import LogoutComp from './Login/LogoutPage';
import Typography from '@material-ui/core/Typography';


class HostComp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    let membersData = await utils.getAllUsersData();
    let moviesData = await utils.getAllMovies();

    //add data to db only once
    let resp = await firebaseMembers.existMembersDB();
    if (!resp.flag) {
      membersData.forEach((member) => {
        let obj = { _id: member.id.toString(), Name: member.name, Email: member.email, City: member.address.city };
        firebaseMembers.addMember(obj);
      });

      moviesData.forEach((movie) => {
        let obj = { _id: movie.id.toString(), Name: movie.name, Genres: movie.genres, Image: movie.image, Premiered: movie.premiered };
        firebaseMovies.addMovie(obj);
      });
    }
  }

  render() {
    return (
      <div>
        <Typography component="h1" variant="h5" style={{ textAlign: "center" }}>
          Movies - Subscriptions WebSite
        </Typography>
        <Switch>
          <Route exact path='/' component={LoginComp} />
          <Route path='/LogoutPage' component={LogoutComp} />
          <Route path='/NewUserPage' component={NewUserComp} />
          <Route path='/MainPage' render={(props) => (
            USER_AUTH.get().token == null? (
              <Redirect to="/" />
            ) : (
              <DashboardComp {...props}/>
            )
          )} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

export default connect(mapStateToProps)(HostComp);
