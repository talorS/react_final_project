import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TodayIcon from '@material-ui/icons/Today';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import firebase from '../Firebase/firebaseUsersUtils'

class AllUsersComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      page : 1,
      usersPerPage: 3,
      msg : ''
    }
  }

  componentDidMount = async () => {
    const resp = await firebase.getUsersData();
    this.setState({ users: resp });
  }

  componentDidUpdate(previousState, currentProps){
    if(this.state.page !== currentProps.page)
      this.setState({msg : ''}); 
  }

  deleteUser = async (id,usrname) => {
    const resp = await firebase.deleteUser(id);
    if(resp){
    let sliceUsers = [...this.state.users];
    let index = sliceUsers.map(user => { return user.id; }).indexOf(id);
    if (index !== -1) {
      sliceUsers.splice(index, 1);
      this.setState({users: sliceUsers, 
                     msg : "user: " + usrname + " deleted succsfully!",
                     page : (this.state.page > Math.ceil(sliceUsers.length / this.state.usersPerPage) 
                     && sliceUsers.length > 0? 
                            Math.ceil(sliceUsers.length / this.state.usersPerPage) : this.state.page)
                    });
      }
    }
  }

  handlePage = (event, value) => {
    this.setState({page : Number.parseInt(value)});
  }

  render() {
    const { classes } = this.props;
    const usersList = this.state.users.map(user => {
      return <div style={{ border: "2px solid black" }} key={user.id}>
        <ListItem>
          <FaceOutlinedIcon/>
          <ListItemText
            primary={"Name: " + user.name}
          />
        </ListItem>
        <ListItem>
        <PersonOutlineOutlinedIcon/>
          <ListItemText
            primary={"User Name: " + user.username}
          />
        </ListItem>
        <ListItem>
          <HourglassEmptyOutlinedIcon/>
          <ListItemText
            primary={"Session timeout (minutes) : " + user.session}
          />
        </ListItem>
        <ListItem key={"created" + user.id}>
          <TodayIcon/>
          <ListItemText
            primary={"Created Date : " + user.created}
          />
        </ListItem>
        <ListItem>
        <List dense={true}>
            Permissions :
          {user.permissions.map((per,index) => {
            return <ListItem key={"permission" + index}>
              <CheckBoxRoundedIcon/>
              <ListItemText
                primary={per}
              />
            </ListItem>
          })}
          </List>
        </ListItem>
        <Button size="small" variant="contained"
          onClick={() => this.props.history.push('/MainPage/ManageUsersPage/Users/EditUser/user/' + user.id, user)}>
          <EditOutlinedIcon/>
          Edit
        </Button>
        <Button size="small" variant="contained"
          disabled={user.id == 1}
          onClick={() => this.deleteUser(user.id,user.username)}>
            <HighlightOffRoundedIcon/>
          Delete
          </Button>
      </div>
    });
    // Logic for displaying users
    const { page, usersPerPage } = this.state;
    const indexOfLastUser = page * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUser = usersList.slice(indexOfFirstUser, indexOfLastUser);

     // Logic for displaying page numbers
     const pageNumbers = Math.ceil(usersList.length / usersPerPage);

    return (
        <Container component="main" maxWidth="xs" item xs='auto'>
          <CssBaseline />
          <Typography variant="body1" gutterBottom style={{ textAlign: 'center', 
           backgroundColor: "#a5d6a7" }}> {this.state.msg}</Typography>
          <List dense={true} className={classes.list}>
            {currentUser}
          </List>
          <Typography>Page: {this.state.page}</Typography>
          <Pagination count={pageNumbers} page={this.state.page} onChange={this.handlePage} />
        </Container>
    )
  }
}
//HOC
export default withStyles(useStyles)(AllUsersComp);
