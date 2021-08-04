import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import firebase from '../Firebase/firebaseMembersUtils'

class EditMemberComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdited : true,
      changed : false,
      name: this.props.location.state.name,
      email: this.props.location.state.email,
      city: this.props.location.state.city,
    }
  }

  componentDidUpdate(previousState, currentProps){
    this.setState({isEdited : (this.state !== currentProps && !this.state.changed? false : true)});    
  }

  updateMember = async (e) => {
    e.preventDefault();
   
    let obj ={
      _id : this.props.location.state.id,
      Name: this.state.name,
      Email: this.state.email,
      City: this.state.city,
    };

    let resp = await firebase.editMember(obj);
    this.setState({ changed : resp });
  }

  render() {
    const { classes } = this.props;
    return (
        <Container component="main" maxWidth="xs" item xs='auto'>
        <form className={classes.form} onSubmit={e => this.updateMember(e)}>
          <Typography component="h1" variant="h6" style={{ textAlign: 'center' }}>
            Edit Member : {!this.state.changed? this.props.location.state.name : this.state.name}
          </Typography>
          {this.state.changed && <Typography variant="body1" gutterBottom style={{ textAlign: 'center', 
           backgroundColor: "#a5d6a7" }}> The data updated successfully!</Typography>}
         <TextField
            variant="outlined"
            margin="dense"
            label="Name"
            name="name"
            required
            value={this.state.name}
            autoFocus
            onChange={e => this.setState({ name: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="dense"
            label="Email"
            name="email"
            type="email"
            inputProps={{pattern:"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$",
                         title:"characters@characters.domain"}}
            required
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="dense"
            label="City"
            name="city"
            required
            value={this.state.city}
            onChange={e => this.setState({ city: e.target.value })}
          />
          <Grid container spacing={3} item xs>
            <Button
              type="submit"
              variant="contained"
              color="default"
              startIcon={<CloudUploadIcon />}
              size="small"
              disabled={this.state.isEdited}
              className={classes.btn}
            >
              Update
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
    )
  }
}
//HOC
export default withStyles(useStyles)(EditMemberComp);
