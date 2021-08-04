import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import firebase from '../Firebase/firebaseMembersUtils'
import { PureComponent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class WatchedComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      members: []
    }
  }

  componentDidMount = async () => {
    const resp = await firebase.getWatchedMembers(this.props.data);
    this.setState({ members: resp });
  }

  render() {
    const { classes } = this.props;
    const membersList = this.state.members.map((member) => {
      const date = new Date(member.date);
      const formatted_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      return <div key={member.id}>
        <ListItem>
          <ListItemText
            primary={<div>
              <Link to={'/MainPage/SubscriptionsPage/AllMembers/member/' + member.id}>
               {member.name + ' '}</Link>,{formatted_date}
              </div>}
          />
        </ListItem>
      </div>
    });
    return (
      <List dense={true} className={classes.list} style={{ border: "1px solid black", width: "70%",
      marginLeft : "70px", marginBottom : "10px"}}>
        Subscriptions Watched:
        {membersList}
      </List>
    )
  }
}


export default withStyles(useStyles)(WatchedComp);
