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
import Pagination from '@material-ui/lab/Pagination';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import firebase from '../Firebase/firebaseMembersUtils';
import WatchedMoviesComp from './SubWatchedPage';

class AllMembersComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userPermissions: this.props.data.permissions,
      members: [],
      page: 1,
      membersPerPage: 3,
      msg : ''
    }
  }

  componentDidMount = async () => {
    const resp = await firebase.getMembers();
    this.setState({ members: resp});
  }

  componentDidUpdate(previousState, currentProps){
    if(this.state.page !== currentProps.page)
      this.setState({msg : ''}); 
  }

  deleteMember = async (id,name) => {
    const resp = await firebase.deleteMember(id);
    if(resp){
    let sliceMembers = [...this.state.members];
    let index = sliceMembers.map(member => { return member.id; }).indexOf(id);
    if (index !== -1) {
      sliceMembers.splice(index, 1);
      this.setState({members: sliceMembers, 
                     msg : "Member: " + name + " deleted succsfully!",
                     page : (this.state.page > Math.ceil(sliceMembers.length / this.state.membersPerPage) 
                     && sliceMembers.length > 0? 
                            Math.ceil(sliceMembers.length / this.state.membersPerPage) : this.state.page)
                    });
      }
    }
  }

  handlePage = (event, value) => {
    this.setState({ page: Number.parseInt(value) });
  }

  render() {
    const { classes } = this.props;
    const membersList = this.state.members.map((member) => {
      return <div key={member.id} style={{ border: "2px solid black" }}>
        <ListItem>
          <ListItemText style={{ textAlign: 'center' }}
           primary={<Typography type="body2" style={{fontWeight: "bold"}}>{member.name}</Typography>}
            secondary={         
              <div>
                <div>{"Email: " + member.email}</div>
                <div>{"City: " + member.city}</div>
              </div>
              }
          />
        </ListItem>

        <Grid>
        <WatchedMoviesComp data={member.id}/>
        </Grid>
    
        <Button size="small" variant="contained"
          disabled={this.state.userPermissions.indexOf('Update Subscriptions') == -1}
          onClick={() => this.props.history.push('/MainPage/SubscriptionsPage/AllMembers/EditMember/member/' + member.id, member)}>
          <EditOutlinedIcon />
          Edit
        </Button>
        <Button size="small" variant="contained"
          disabled={this.state.userPermissions.indexOf('Delete Subscriptions') == -1}
          onClick={() => this.deleteMember(member.id,member.name)}>
          <HighlightOffRoundedIcon />
          Delete
          </Button>
      </div>
    });

    // Logic for displaying movies
    const { page, membersPerPage } = this.state;
    const indexOfLastMember = page * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMember = membersList.slice(indexOfFirstMember, indexOfLastMember);

    // Logic for displaying page numbers
    const pageNumbers = Math.ceil(membersList.length / membersPerPage);

    return (
            <Container component="main" maxWidth="xs" item xs='auto'>
              <CssBaseline />
              <Typography variant="body1" gutterBottom style={{ textAlign: 'center', 
               backgroundColor: "#a5d6a7" }}> {this.state.msg}</Typography>
              <List dense={true} className={classes.list}>
                {currentMember}
              </List>
              <Typography>Page: {this.state.page}</Typography>
              <Pagination count={pageNumbers} page={this.state.page} 
              onChange={this.handlePage} />
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
export default connect(mapStateToProps)((withStyles(useStyles)(AllMembersComp)));
