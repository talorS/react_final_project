import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupIcon from '@material-ui/icons/Group';
import AddMemberComp from './AddMemberPage';
import AllMembersComp from './AllMembersPage';
import EditMemberComp from './EditMemberPage';
import MemberComp from './MemberPage';
import { Switch, Route } from 'react-router-dom';

class SubscriptionsComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userPermissions: this.props.data.permissions,
      selected : {
        allMembersBtn: 'default',
        addMemberBtn: 'default'
      }
    }
  }


  render() {
    const { classes } = this.props;
    return (
      <div>
      {this.state.userPermissions.indexOf('View Subscriptions') != -1 ? (
        <div>
      <Container component="main" maxWidth="xs" item xs='auto'>
        <CssBaseline />
        <Typography component="h1" variant="h5" style={{ textAlign: "center" }}>
          Subscriptions
        </Typography>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Button size="small" variant="contained" className={classes.btn}
                color={this.state.selected.allMembersBtn}
                onClick={() => this.setState({selected: {addMemberBtn:'default', allMembersBtn: 'secondary'}},
                () => this.props.history.push('/MainPage/SubscriptionsPage/AllMembers'))}
                startIcon={<GroupIcon/>}>
                All Members
            </Button>
            </Grid>
            <Grid item xs={3} style ={{marginRight: "60px"}}>
              <Button size="small" variant="contained" className={classes.btn}
                color={this.state.selected.addMemberBtn}
                onClick={() =>  this.setState({selected: {addMemberBtn:'secondary', allMembersBtn: 'default'}},
                () => this.props.history.push('/MainPage/SubscriptionsPage/AddMember'))}
                startIcon={<PersonAddIcon/>}>
                   Add Member
            </Button>
            </Grid>
          </Grid>
      </Container>
      <Switch>
          <Route exact path='/MainPage/SubscriptionsPage/AllMembers' component={AllMembersComp} />
          <Route exact path='/MainPage/SubscriptionsPage/AddMember' component={AddMemberComp} />
          <Route exact path='/MainPage/SubscriptionsPage/AllMembers/member/:id' component={MemberComp} />
          <Route exact path='/MainPage/SubscriptionsPage/AllMembers/EditMember/member/:id' component={EditMemberComp} />
    </Switch>
    </div>
      ) :
      (
        <Typography style={{ textAlign: "center" }}>You don't have a permission to view this page!</Typography>
      )
    }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}
//HOC
export default connect(mapStateToProps)((withStyles(useStyles)(SubscriptionsComp)));
