import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { Component } from 'react'
import { USER_AUTH } from '../Utils/UserAuth';
import firebase from '../Firebase/firebaseUsersUtils'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom'

class LoginComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      failedLogin: false
    }
  }

  validateLogin = async (e) => {
    e.preventDefault();
    let resp = await firebase.validateCredentials(this.state.userName, this.state.password);
    //user exist in db
    if (resp.id != null) {

      const userUID = resp.id;
      resp = await firebase.getUserName(userUID);
      const name = resp.name;
      const timeout = resp.timeout;
      resp = await firebase.getUserPermissions(userUID);
      const permissions = resp.permissions;

      USER_AUTH.set({
        token: "loggedIn",
        userInfo: { name: name, timeout: timeout, permissions: permissions, userUID: userUID },
      });

      this.props.dispatch({ type: "NAME", payload: USER_AUTH.get().userInfo.name });
      this.props.dispatch({ type: "PERMISSIONS", payload: USER_AUTH.get().userInfo.permissions });

      this.props.history.push('/MainPage');
    }
    else this.setState({ failedLogin: true });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs" item xs='auto'>
        <CssBaseline />
        <div className={classes.paper}>
          {this.state.failedLogin && <p style={{ color: "red" }}>Your login credentials could not be verified, please try again.</p>}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" >
            Login Page
        </Typography>
          <form className={classes.form} onSubmit={e => this.validateLogin(e)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoFocus
              onChange={e => this.setState({ userName: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={e => this.setState({ password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
          </Button>
            <Grid container>
              <Grid item xs>
                New User? :
              <Link variant="body2" to="/NewUserPage">Create Account</Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    )
  }
}
//HOC
export default connect()((withStyles(useStyles)(LoginComp)));
