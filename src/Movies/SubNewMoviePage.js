import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import firebase from '../Firebase/firebaseMoviesUtils'
import { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

class SubNewMovieComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      movieId: '',
      movies: []
    }
  }

  componentDidMount = async () => {
    const resp = await firebase.getUnWatchedMovies(this.props.data);
    this.setState({ movies: resp });
  }

  subscribe = async () => {
    const movie = {MemberId : this.props.data,
                   Movies : {date : this.state.date,
                             movieId : this.state.movieId}};
    let resp = await firebase.subscribeMovie(movie);
    this.props.showMsgCallback(resp);
    if(resp){
      resp = await firebase.getUnWatchedMovies(this.props.data);
      this.setState({ movies: resp, movieId : '' , date : '' });
    }
  }

  render() {
    const { classes } = this.props;
    return (
        <Grid container spacing={1} item xs
          style={{ border: "1px solid red", marginLeft: "1px", marginTop: "5px" }} className={classes.root}>
          <Typography variant="body2" style={{ textAlign: 'center', fontWeight: "bold" }}>
            Add a new movie</Typography>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="name-native-simple">Movie</InputLabel>
            <Select
              native
              value={this.state.movieId}
              onChange={(e) => this.setState({ movieId: e.target.value })}
            >
              <option aria-label="None" value="" selected disabled/>
              {this.state.movies.map(movie => { return <option value={movie.id}>{movie.name}</option> })}
            </Select>
          </FormControl>
          <TextField
            variant="standard"
            margin="dense"
            name="date"
            label="Date"
            type="date"
            value={this.state.date}
            onChange={e => this.setState({ date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="button"
            variant="outlined"
            color="default"
            onClick={() => this.subscribe()}
            size="small"
            style={{ textTransform: 'none' }}
            disabled = {!(this.state.date.length > 0 && this.state.movieId.length > 0)}
          >
            Subscribe
          </Button>
        </Grid >
    )
  }
}


export default withStyles(useStyles)(SubNewMovieComp);
