import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import { connect } from 'react-redux'
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import SaveAltOutlinedIcon from '@material-ui/icons/SaveAltOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import firebase from '../Firebase/firebaseMembersUtils'

class AddMemberComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userPermissions: this.props.data.permissions,
      name: '',
      email: '',
      city: '',
      isEdited: true,
      created: false
    }
  }

  componentDidUpdate(previousState, currentProps) {
    this.setState({ isEdited: this.state !== currentProps && !this.state.created ? false : true });
  }

  addMember = async (e) => {
    e.preventDefault();
    let obj = {
      _id : '',
      Name: this.state.name,
      Email: this.state.email,
      City: this.state.city,
    }

    let res = await firebase.insertMember(obj);
    this.setState({ created: res });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.state.userPermissions.indexOf('Create Subscriptions') != -1 ? (
          <Container component="main" maxWidth="xs" item xs='auto'>
          <form className={classes.form} onSubmit={e => this.addMember(e)}>
          <Typography component="h1" variant="h6" style={{ textAlign: 'center' }}>
            Add New Member
           </Typography>
          {this.state.created && <Typography variant="body1" gutterBottom style={{ textAlign: 'center', 
           backgroundColor: "#a5d6a7" }}> A new member created!</Typography>}
          <TextField
            variant="outlined"
            margin="dense"
            required
            label="Name"
            name="name"
            autoFocus
            onChange={e => this.setState({ name: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            label="Email"
            name="email"
            type="email"
            inputProps={{pattern:"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$",
                         title:"characters@characters.domain"}}
            onChange={e => this.setState({ email: e.target.value})}
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            label="City"
            name="city"
            onChange={e => this.setState({ city: e.target.value })}
          />
          <Grid container spacing={3} item xs>
            <Button
              type="submit"
              variant="contained"
              color="default"
              startIcon={<SaveAltOutlinedIcon />}
              size="small"
              disabled={this.state.isEdited}
              className={classes.btn}
            >
              Save
          </Button>
            <Button
              type="button"
              variant="contained"
              color="default"
              onClick={() => this.props.history.push('/MainPage/SubscriptionsPage/AllMembers')}
              startIcon={<ClearOutlinedIcon />}
              size="small"
              className={classes.btn}
              style ={{marginLeft : "-10px"}}
            >
              Cancel
          </Button>
          </Grid>
        </form>
        </Container>
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
export default connect(mapStateToProps)((withStyles(useStyles)(AddMemberComp)));
