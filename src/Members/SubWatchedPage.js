import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import firebase from '../Firebase/firebaseMoviesUtils'
import { PureComponent } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SubNewMovieComp from '../Movies/SubNewMoviePage';

class WatchedComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      subNewMovieBtn: false,
      msg : ''
    }
  }

  componentDidMount = async () => {
    const resp = await firebase.getWatchedMovies(this.props.data);
    this.setState({ movies: resp });
  }

  showMsg = async(data) =>{
    if(data){
      const resp = await firebase.getWatchedMovies(this.props.data);
      this.setState({movies: resp, msg : 'The movie subscribed!'});
    }
  }

  render() {
    const { classes } = this.props;
    const moviesList = this.state.movies.map((movie) => {
      const date = new Date(movie.date);
      const formatted_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      return <div key={movie.id}>
        <ListItem>
          <ListItemText
            primary={<div>
              <Link to={'/MainPage/MoviesPage/AllMovies/movie/' + movie.id}>
                {movie.name + ' '}</Link>,{formatted_date}
            </div>}
          />
        </ListItem>
      </div>
    });

    return (
      <List dense={true} className={classes.list} style={{
        border: "1px solid black", width: "60%", marginLeft: "70px", marginBottom: "10px"
      }}>
        <Typography variant="subtitle2" style={{ textAlign: 'center', 
           backgroundColor: "#a5d6a7" }}> {this.state.msg}</Typography>
        <Typography variant="body2" gutterBottom style={{ textAlign: 'center', fontWeight: "bold" }}>
          Movies Watched:</Typography>
        <Button size="small" variant="outlined" style={{ textTransform: 'none' }}
          onClick={() => this.setState({ subNewMovieBtn: !this.state.subNewMovieBtn })}>
          Subscribe to new movie
        </Button>
        {!this.state.subNewMovieBtn ? moviesList : <SubNewMovieComp data={this.props.data} showMsgCallback={data => this.showMsg(data)}/>}
      </List>
    )
  }
}

export default withStyles(useStyles)(WatchedComp);
