import axios from 'axios';

const usrsUrl = "https://jsonplaceholder.typicode.com/users";
const moviesUrl = "https://api.tvmaze.com/shows";

const getAllUsersData = async () => {
    let resp = await axios.get(usrsUrl);
    let allUsersdata = resp.data;

    const keys_to_keep = ['id', 'name', 'email', 'address'];
    allUsersdata = allUsersdata.map(element => Object.assign({}, ...keys_to_keep.map(key => ({ [key]: element[key]}))));
    return allUsersdata;
}

const getAllMovies = async () => {
    let resp = await axios.get(moviesUrl);
    let allMoviesdata = resp.data;

    const keys_to_keep = ['id', 'name', 'genres', 'premiered', 'image'];
    allMoviesdata = allMoviesdata.map(element => Object.assign({}, ...keys_to_keep.map(key => ({ [key]: element[key]}))));
    return allMoviesdata;
}


export default { getAllUsersData, getAllMovies };