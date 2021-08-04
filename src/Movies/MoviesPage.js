import useStyles from '../Style/styles';
import { withStyles } from '@material-ui/core/styles';
import { PureComponent } from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import { Switch, Route } from 'react-router-dom';
import AllMoviesComp from './AllMoviesPage';
import AddMovieComp from './AddMoviePage';
import EditMovieComp from './EditMoviePage';
import MovieComp from './MoviePage';

class MoviesComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected : {
        allMoviesBtn: 'default',
        addMovieBtn: 'default'
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container component="main" maxWidth="xs" item xs='auto'>
          <CssBaseline />
          <Typography component="h1" variant="h5" style={{ textAlign: "center" }}>
          Movies
        </Typography>
          <Grid container spacing={6}>
            <Grid item xs={4}>
              <Button size="small" variant="contained" className={classes.btn}
                color={this.state.selected.allMoviesBtn}
                onClick={() => this.setState({selected: {addMovieBtn:'default', allMoviesBtn: 'secondary'}},
                () => this.props.history.push('/MainPage/MoviesPage/AllMovies'))}
                startIcon={<MovieFilterIcon/>}>
                All Movies
            </Button>
            </Grid>
            <Grid item xs={5} style ={{marginRight: "60px"}}>
              <Button size="small" variant="contained" className={classes.btn}
                color={this.state.selected.addMovieBtn}
                onClick={() => this.setState({selected: {addMovieBtn:'secondary', allMoviesBtn: 'default'}},
                () => this.props.history.push('/MainPage/MoviesPage/AddMovie'))}
                startIcon={<AddAPhotoIcon/>}>
                   Add Movie
            </Button>
            </Grid>
          </Grid>
        </Container>
        <Switch>
          <Route exact path='/MainPage/MoviesPage/AllMovies' component={AllMoviesComp} />
          <Route exact path='/MainPage/MoviesPage/AddMovie' component={AddMovieComp} />
          <Route exact path='/MainPage/MoviesPage/AllMovies/EditMovie/movie/:id' component={EditMovieComp} />
          <Route exact path='/MainPage/MoviesPage/AllMovies/movie/:id' component={MovieComp} />
        </Switch>
        </div>
    )
  }
}
//HOC
export default withStyles(useStyles)(MoviesComp);
