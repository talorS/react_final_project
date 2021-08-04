import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import { connect } from 'react-redux'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WatchedMoviesComp from './SubWatchedPage';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import firebase from '../Firebase/firebaseMembersUtils'

class MemberComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userPermissions: this.props.data.permissions,
      member: { id: this.props.match.params.id },
      msg: '',
      done : false
    }
  }

  componentDidMount = async () => {
    const obj = {moviesBtn: 'default', subscriptionsBtn: 'primary', adminBtn: 'default'};
    this.props.dispatch({type : "CHANGE_MENU_BTN_COLOR", payload : obj});
    const resp = await firebase.getMember(this.state.member.id);
    this.setState({
      member: {
        ...this.state.member, name: resp.name,
        city: resp.city,
        email: resp.email
      }
    });
  }

  deleteMember = async () => {
    const resp = await firebase.deleteMember(this.state.member.id);
    if (resp) {
      this.setState({ msg: "Member: " + this.state.member.name + " deleted succsfully!" , done : true});
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs" item xs='auto'>
        <CssBaseline />
        <Typography variant="body1" gutterBottom style={{ textAlign: 'center', backgroundColor: "#a5d6a7" }}>
          {this.state.msg}
        </Typography>
        <List dense={true} className={classes.list} style={{ border: "2px solid black" }}>
          <ListItem>
            <ListItemText style={{ textAlign: 'center' }}
              primary={<Typography type="body2" style={{ fontWeight: "bold" }}>{this.state.member.name}</Typography>}
              secondary={
                <div>
                  <div>{"Email: " + this.state.member.email}</div>
                  <div>{"City: " + this.state.member.city}</div>
                </div>
              }
            />
          </ListItem>

          <Grid>
            <WatchedMoviesComp data={this.state.member.id} />
          </Grid>

          <Button size="small" variant="contained"
            disabled={this.state.userPermissions.indexOf('Update Subscriptions') == -1 || this.state.done}
            onClick={() => this.props.history.push('/MainPage/SubscriptionsPage/AllMembers/EditMember/member/' + this.state.member.id, this.state.member)}>
            <EditOutlinedIcon />
          Edit
        </Button>
          <Button size="small" variant="contained"
            disabled={this.state.userPermissions.indexOf('Delete Subscriptions') == -1 || this.state.done}
            onClick={() => this.deleteMember()}>
            <HighlightOffRoundedIcon />
          Delete
          </Button>
        </List>
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
export default connect(mapStateToProps)((withStyles(useStyles)(MemberComp)));
