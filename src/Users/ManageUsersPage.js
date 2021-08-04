import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import UsersComp from './UsersPage';
import AddUserComp from './AddUserPage';
import EditUserComp from './EditUserPage';

class ManageUsersComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedBtn : {
        usersBtn: 'default',
        userBtn: 'default'
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container component="main" maxWidth="xs" item xs='auto'>
          <CssBaseline />
          <Typography component="h1" variant="h5" style={{ textAlign: "center" }}>
          Users
        </Typography>
          <Grid container spacing={6}>
            <Grid item xs={4}>
              <Button size="small" variant="contained" className={classes.btn}
                color={this.state.selectedBtn.usersBtn}
                onClick={() =>  this.setState({selectedBtn: {userBtn:'default', usersBtn: 'secondary'}},
                () => this.props.history.push('/MainPage/ManageUsersPage/Users'))}
                startIcon={<PeopleAltIcon/>}>
                All Users
            </Button>
            </Grid>
            <Grid item xs={3} style ={{marginRight: "60px"}}>
              <Button size="small" variant="contained" className={classes.btn}
                color={this.state.selectedBtn.userBtn}
                onClick={() => this.setState({selectedBtn: {userBtn:'secondary', usersBtn: 'default'}},
                () => this.props.history.push('/MainPage/ManageUsersPage/AddUser'))}
                startIcon={<PersonAddRoundedIcon/>}>
                   Add User
            </Button>
            </Grid>
          </Grid>
        </Container>
        <Switch>
          <Route exact path='/MainPage/ManageUsersPage/Users' component={UsersComp} />
          <Route exact path='/MainPage/ManageUsersPage/AddUser' component={AddUserComp} />
          <Route exact path='/MainPage/ManageUsersPage/Users/EditUser/user/:id' component={EditUserComp} />
        </Switch>
        </div>
    )
  }
}
//HOC
export default withStyles(useStyles)(ManageUsersComp);
