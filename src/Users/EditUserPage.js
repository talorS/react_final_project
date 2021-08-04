import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import {connect} from 'react-redux'
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import firebase from '../Firebase/firebaseUsersUtils'

class EditUserComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdited : true,
      fname: this.props.location.state.name.split(' ')[0],
      lname: this.props.location.state.name.split(' ')[1],
      username: this.props.location.state.username,
      session: this.props.location.state.session,
      permissions: [
        {
          permission: 'View Subscriptions',
          checked: this.props.location.state.permissions.indexOf('View Subscriptions') != -1
        },
        {
          permission: 'Create Subscriptions',
          checked: this.props.location.state.permissions.indexOf('Create Subscriptions') != -1
        },
        {
          permission: 'Delete Subscriptions',
          checked: this.props.location.state.permissions.indexOf('Delete Subscriptions') != -1
        },
        {
          permission: 'Update Subscriptions',
          checked: this.props.location.state.permissions.indexOf('Update Subscriptions') != -1
        },
        {
          permission: 'View Movies',
          checked: this.props.location.state.permissions.indexOf('View Movies') != -1
        },
        {
          permission: 'Create Movies',
          checked: this.props.location.state.permissions.indexOf('Create Movies') != -1
        },
        {
          permission: 'Delete Movies',
          checked: this.props.location.state.permissions.indexOf('Delete Movies') != -1
        },
        {
          permission: 'Update Movies',
          checked: this.props.location.state.permissions.indexOf('Update Movies') != -1
        }
      ]
    }
  }

  componentDidUpdate(previousState, currentProps){
    this.setState({isEdited : this.state !== currentProps? false : true});    
  }

  updateUser = async (e) => {
    e.preventDefault();
    let checkedPers = this.state.permissions.filter(obj => (obj.checked))
    .map(obj =>(obj.permission));

    let obj ={
      id : this.props.location.state.id,
      fname : this.state.fname,
      lname: this.state.lname,
      username: this.state.username,
      session: this.state.session,
      permissions: checkedPers
    };

    await firebase.updateUser(obj);
    this.props.dispatch({type : "NAME", payload :this.state.fname});
    this.props.dispatch({type : "PERMISSIONS", payload : checkedPers});
    this.props.history.push('/MainPage/ManageUsersPage/Users');
  }

  handleChange = (e) => {
    let arr = [...this.state.permissions];

    arr.forEach(per => {
      if (per.permission == e.target.value)
        per.checked = e.target.checked;
    });

    let result = arr.filter(obj => (obj.checked)).map(obj =>(obj.permission));

    if (result.indexOf("Create Subscriptions") != -1 && result.indexOf("Update Subscriptions") != -1
      && result.indexOf("Delete Subscriptions") != -1 && result.indexOf("View Subscriptions") == -1) {
        var ind = arr.findIndex(elm => (elm.permission == "View Subscriptions" ));
        arr[ind].checked = true;
    }

    if (result.indexOf("Create Movies") != -1 && result.indexOf("Update Movies") != -1
      && result.indexOf("Delete Movies") != -1 && result.indexOf("View Movies") == -1) {
        var ind = arr.findIndex(elm => (elm.permission == "View Movies" ));
        arr[ind].checked = true;
    }

    this.setState({permissions: arr});
  }

  render() {
    const { classes } = this.props;
    let systemPermissons = this.state.permissions.map((per, index) => {
      return <FormControlLabel key={index}
        control={<Checkbox onChange={(e) => this.handleChange(e)} value={per.permission}
          checked={per.checked} />}
        label={per.permission}
      />
    })
    return (
        <form className={classes.form} onSubmit={e => this.updateUser(e)}>
          <Typography component="h1" variant="h6" style={{ textAlign: 'center' }}>
            Edit User : {this.props.location.state.name}
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            label="First Name"
            name="fname"
            autoFocus
            required
            value={this.state.fname}
            onChange={e => this.setState({ fname: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            label="Last Name"
            name="lname"
            required
            value={this.state.lname}
            onChange={e => this.setState({ lname: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            label="User Name"
            name="username"
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            name="session"
            label="Session time out (minutes)"
            id="session"
            type="number"
            inputProps={{min:"1"}}
            value={this.state.session}
            onChange={e => this.setState({ session: Number.parseInt(e.target.value) })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="created"
            label="Created Date"
            id="created"
            required
            value={this.props.location.state.created}
            disabled
          />
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Permissions: </FormLabel>
            <FormGroup>
              {systemPermissons}
            </FormGroup>
          </FormControl>
          <Grid container spacing={1}>
            <Button
              type="submit"
              variant="contained"
              color="default"
              startIcon={<CloudUploadIcon />}
              size="small"
              disabled = {this.state.isEdited}
            >
              Update
          </Button>
            <Button
              type="button"
              variant="contained"
              color="default"
              onClick={() => this.props.history.push('/MainPage/ManageUsersPage/Users')}
              startIcon={<ClearOutlinedIcon />}
              size="small"
            >
              Cancel
          </Button>
          </Grid>
        </form>
    )
  }
}
//HOC
export default connect()((withStyles(useStyles)(EditUserComp)));
