import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import SaveAltOutlinedIcon from '@material-ui/icons/SaveAltOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import firebase from '../Firebase/firebaseUsersUtils'

class AddUserComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      created: false,
      isEdited: true,
      fname: '',
      lname: '',
      username: '',
      session: 0,
      permissions: [
        {
          permission: 'View Subscriptions',
          checked: false
        },
        {
          permission: 'Create Subscriptions',
          checked: false
        },
        {
          permission: 'Delete Subscriptions',
          checked: false
        },
        {
          permission: 'Update Subscriptions',
          checked: false
        },
        {
          permission: 'View Movies',
          checked: false
        },
        {
          permission: 'Create Movies',
          checked: false
        },
        {
          permission: 'Delete Movies',
          checked: false
        },
        {
          permission: 'Update Movies',
          checked: false
        }
      ]
    }
  }

  componentDidUpdate(previousState, currentProps) {
    this.setState({ isEdited: this.state !== currentProps && !this.state.created ? false : true });
  }

  addUser = async (e) => {
    e.preventDefault();

    let obj = {
      fname: this.state.fname,
      lname: this.state.lname,
      username: this.state.username,
      session: this.state.session,
      permissions: this.state.permissions.filter(obj => (obj.checked))
        .map(obj => (obj.permission))
    }
    let res = await firebase.insertUser(obj);
    this.setState({ created: res });
  }

  handleChange = (e) => {
    let arr = [...this.state.permissions];

    arr.forEach(per => {
      if (per.permission == e.target.value)
        per.checked = e.target.checked;
    });

    let result = arr.filter(obj => (obj.checked)).map(obj => (obj.permission));

    if (result.indexOf("Create Subscriptions") != -1 && result.indexOf("Update Subscriptions") != -1
      && result.indexOf("Delete Subscriptions") != -1 && result.indexOf("View Subscriptions") == -1) {
      var ind = arr.findIndex(elm => (elm.permission == "View Subscriptions"));
      arr[ind].checked = true;
    }

    if (result.indexOf("Create Movies") != -1 && result.indexOf("Update Movies") != -1
      && result.indexOf("Delete Movies") != -1 && result.indexOf("View Movies") == -1) {
      var ind = arr.findIndex(elm => (elm.permission == "View Movies"));
      arr[ind].checked = true;
    }

    this.setState({ permissions: arr });
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
        <form className={classes.form} onSubmit={e => this.addUser(e)}>
          <Typography component="h1" variant="h6" style={{ textAlign: 'center' }}>
            Add New User
           </Typography>
          {this.state.created && <Typography variant="body1" gutterBottom style={{ textAlign: 'center', 
           backgroundColor: "#a5d6a7" }}> A new user created!</Typography>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="fname"
            label="First Name"
            name="fname"
            autoComplete="fname"
            autoFocus
            onChange={e => this.setState({ fname: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="lname"
            label="Last Name"
            name="lname"
            autoComplete="lname"
            onChange={e => this.setState({ lname: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="username"
            label="User Name"
            name="username"
            autoComplete="username"
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
            autoComplete="session"
            onChange={e => this.setState({ session: Number.parseInt(e.target.value) })}
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
              startIcon={<SaveAltOutlinedIcon />}
              size="small"
              disabled={this.state.isEdited}
            >
              Save
          </Button>
            <Button
              type="button"
              variant="contained"
              color="default"
              onClick={() => this.props.history.push('/MainPage/ManageUsersPage')}
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
export default withStyles(useStyles)(AddUserComp);
