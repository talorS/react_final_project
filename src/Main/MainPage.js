import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { PureComponent } from 'react';
import { USER_AUTH } from '../Utils/UserAuth';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MovieIcon from '@material-ui/icons/Movie';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom'

class MainComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: USER_AUTH.get().userInfo.name,
      id: USER_AUTH.get().userInfo.userUID,
      btnsColor: this.props.data.btnsColor,
      timer: {
        minutes: USER_AUTH.get().userInfo.timeout - 1,
        seconds: 60
      }
    }
  }

  componentDidMount = () => {
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  }

  componentDidUpdate(){
    if(this.props.data.btnsColor !== this.state.btnsColor)
      this.setState({btnsColor : this.props.data.btnsColor});
  }

  decrementClock = () => {
    if (this.state.timer.minutes === 0 && this.state.timer.seconds === 1) {
      clearInterval(this.clockCall);
      this.props.history.push('/LogoutPage');
    }
    else {
      this.setState({timer : {...this.state.timer,seconds : this.state.timer.seconds -1}},
        () => {
          if(this.state.timer.seconds === 0)
            this.setState({timer : {minutes: this.state.timer.minutes -1,seconds: 60}});
        });
    }
  };

  componentWillUnmount() {
    clearInterval(this.clockCall);
  }


  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs" item xs='auto'>
        <CssBaseline />
        <div className={classes.btn}>
          <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" value={100} color="inherit" size="65px"/>
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="body1" component="div" color="secondary">
                {this.state.timer.minutes.toString().padStart(2, "0")}:
                {this.state.timer.seconds.toString().padStart(2, "0")}
                </Typography>
            </Box>
          </Box>
          <Typography variant="body2" component="div" color="textPrimary">Session Timeout</Typography>
        </div>
        <div className={classes.root}>
          <Avatar />
          <Typography>Welcome back, {this.state.name}!</Typography>
          <Avatar>
            <ExitToAppIcon />
          </Avatar>
          <Link variant="body2" to="/LogoutPage">Signout</Link>
        </div>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Button size="small" variant="contained" className={classes.btn}
              color={this.state.btnsColor.moviesBtn}
              startIcon={<MovieIcon />} 
              onClick={() => {this.props.dispatch({type : "CHANGE_MENU_BTN_COLOR", payload : { moviesBtn: 'primary', subscriptionsBtn: 'default', adminBtn: 'default' }})
                              this.props.history.push('/MainPage/MoviesPage')}}>
              Movies
            </Button>
          </Grid>
          <Grid item xs={3} style={{ marginRight: "60px" }}>
            <Button size="small" variant="contained" className={classes.btn}
              color={this.state.btnsColor.subscriptionsBtn}
              startIcon={<SubscriptionsIcon />} 
              onClick={() => {this.props.dispatch({type : "CHANGE_MENU_BTN_COLOR", payload : { moviesBtn: 'default', subscriptionsBtn: 'primary', adminBtn: 'default' }})
                              this.props.history.push('/MainPage/SubscriptionsPage')}}>
              Subscriptions
            </Button>
          </Grid>
          <Grid item xs={3}>
            {this.state.id == 1 && <Button size="small" variant="contained" className={classes.btn}
              color={this.state.btnsColor.adminBtn}
              startIcon={<SupervisorAccountIcon />}

              onClick={() => {this.props.dispatch({type : "CHANGE_MENU_BTN_COLOR", payload : { moviesBtn: 'default', subscriptionsBtn: 'default', adminBtn: 'primary' }})
                              this.props.history.push('/MainPage/ManageUsersPage')}}>
              Manage Users
            </Button>}
          </Grid>
        </Grid>
        {this.props.children}
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

//HOC
export default connect(mapStateToProps)((withStyles(useStyles)((MainComp))));
