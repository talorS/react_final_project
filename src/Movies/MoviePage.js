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
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import firebase from '../Firebase/firebaseMoviesUtils'
import WatchedComp from './SubsWatchedPage';

class MovieComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userPermissions: this.props.data.permissions,
      movie: { id: this.props.match.params.id },
      msg: '',
      done : false
    }
  }

  componentDidMount = async () => {
    const obj = {moviesBtn: 'primary', subscriptionsBtn: 'default', adminBtn: 'default'};
    this.props.dispatch({type : "CHANGE_MENU_BTN_COLOR", payload : obj});
    const resp = await firebase.getMovie(this.state.movie.id);
    this.setState({
      movie: {
        ...this.state.movie, name: resp.name,
        genres: resp.genres,
        premiered: resp.premiered,
        img: resp.image
      }
    });
  }

  deleteMovie = async () => {
    const resp = await firebase.deleteMovie(this.state.movie.id);
    if(resp)
      this.setState({ msg : "movie: " + this.state.movie.name + " deleted succsfully!", done : true});
  }

  render() {
    const { classes } = this.props;
    const currentTime = new Date(this.state.movie.premiered);
    return (
      <Container component="main" maxWidth="xs" item xs='auto'>
        <CssBaseline />
        <Typography variant="body1" gutterBottom style={{ textAlign: 'center', 
               backgroundColor: "#a5d6a7" }}> {this.state.msg}</Typography>
        <List dense={true} className={classes.list} style={{ border: "2px solid black" }}>
        <ListItem>
          <img src={this.state.movie.img} style={{
            height: "70px", width: "60px", marginTop: "20px",
            marginRight: "15px"
          }} />
          <ListItemText
            primary={this.state.movie.name + ", " + currentTime.getFullYear()}
            secondary={"genres: " + this.state.movie.genres}
          />
        </ListItem>
    
        <Grid>
        <WatchedComp data={this.state.movie.id}/>
        </Grid>

        <Button size="small" variant="contained"
          disabled={this.state.userPermissions.indexOf('Update Movies') == -1 || this.state.done}
          onClick={() => this.props.history.push('/MainPage/MoviesPage/AllMovies/EditMovie/movie/' + this.state.movie.id, this.state.movie)}>
          <EditOutlinedIcon />
          Edit
        </Button>
        <Button size="small" variant="contained" 
          disabled={this.state.userPermissions.indexOf('Delete Movies') == -1 || this.state.done}
          onClick={() => this.deleteMovie()}>
          <HighlightOffRoundedIcon />
          Delete
          </Button>
      </List>
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
export default connect(mapStateToProps)((withStyles(useStyles)(MovieComp)));
