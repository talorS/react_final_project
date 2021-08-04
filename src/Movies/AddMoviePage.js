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
import firebase from '../Firebase/firebaseMoviesUtils'

class AddMovieComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userPermissions: this.props.data.permissions,
      name: '',
      genres: [],
      img: '',
      premiered: '',
      isEdited: true,
      created: false
    }
  }

  componentDidUpdate(previousState, currentProps) {
    this.setState({ isEdited: this.state !== currentProps && !this.state.created ? false : true });
  }

  addMovie = async (e) => {
    e.preventDefault();

    let obj = {
      name: this.state.name,
      genres: this.state.genres,
      image: this.state.img,
      premiered: this.state.premiered
    }

    let res = await firebase.insertMovie(obj);
    this.setState({ created: res });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.state.userPermissions.indexOf('Create Movies') != -1 ? (
          <Container component="main" maxWidth="xs" item xs='auto'>
          <form className={classes.form} onSubmit={e => this.addMovie(e)}>
          <Typography component="h1" variant="h6" style={{ textAlign: 'center' }}>
            Add New Movie
           </Typography>
          {this.state.created && <Typography variant="body1" gutterBottom style={{ textAlign: 'center', 
           backgroundColor: "#a5d6a7" }}> A new movie created!</Typography>}
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
            label="Genres"
            name="genres"
            type="text"
            inputProps={{pattern:"[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*" ,title:"genre,genre"}}
            onChange={e => this.setState({ genres: e.target.value.split(',') })}
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            label="Image URL"
            name="img"
            type="url"
            onChange={e => this.setState({ img: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            name="date"
            label="Date"
            type="date"
            onChange={e => this.setState({ premiered: e.target.value})}
            InputLabelProps={{shrink: true}}
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
              onClick={() => this.props.history.push('/MainPage/MoviesPage/AllMovies')}
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
export default connect(mapStateToProps)((withStyles(useStyles)(AddMovieComp)));
