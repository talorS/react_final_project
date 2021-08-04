import { db} from './firebaseConfig'

const moviesDB = db.collection('Movies');
const subscriptionsDB = db.collection('Subscriptions');

const addMovie = async(movie) => {
  await moviesDB.add(movie);
}

const getMoviesData = async () => {
  let movies = [];
  let snapshot = await moviesDB.orderBy("_id").get();
  snapshot.forEach(doc => {
    let obj = {};
    obj["id"] = doc.data()._id;
    obj["name"] = doc.data().Name;
    obj["premiered"] = doc.data().Premiered;
    obj["genres"] = doc.data().Genres;
    obj["image"] = doc.data().Image.medium;
    movies.push(obj);
  });

  return movies;
}

const insertMovie = async(obj) => {
  let retVal = true;
  let snapshot = await moviesDB.add({
    Genres : obj.genres,
    Image : {medium : obj.image},
    Name : obj.name,
    Premiered : obj.premiered
  }).catch(error => { retVal = false; });

  const docRef = snapshot.id;

  await moviesDB.doc(docRef).set({ _id: docRef },{merge:true}).catch(error => { retVal = false; });

  return retVal;
}

const deleteMovie = async(id) => {
  let resp = true;
  let snapshot = await moviesDB.where('_id', '==', id).get().catch(error => { resp = false; });;
  snapshot.forEach((doc) => {
    doc.ref.delete();
  });
  
  snapshot = await subscriptionsDB.where('Movies.movieId', '==', id).get().catch(error => { resp = false; });;
  snapshot.forEach((doc) => {
    doc.ref.delete();
  });
  return resp;
}

const editMovie = async(obj) => {
  let docRef;
  let success = true;
  let snapshot = await moviesDB.where("_id", "==", obj.id)
    .limit(1)
    .get().catch(error => { success = false; });

  snapshot.forEach(doc => {
    docRef = doc.id;
  });

  await moviesDB.doc(docRef).update({ 
    Genres : obj.genres,
    Image : {medium : obj.image},
    Name : obj.name,
    Premiered : obj.premiered
  })
  .catch(error => { success = false; });

  return success;
}

const getWatchedMovies = async (memberId) => {
  const snap = await subscriptionsDB.where("MemberId", "==", memberId).get();
  const movies = [];
  for (const doc of snap.docs) {
    let obj = {};
    const movieId = doc.data().Movies.movieId;
    obj["id"] = movieId;
    obj["date"] = doc.data().Movies.date;
    const snapshot = await moviesDB.where("_id", "==", movieId).limit(1).get();
    snapshot.forEach((doc) => {
      obj["name"] = doc.data().Name;
    });
    movies.push(obj);
  }

  return movies;
}

const getUnWatchedMovies = async (memberId) => {
  let snap = await subscriptionsDB.where("MemberId", "==", memberId).get();
  const watchedMovies = [];
  const unwatchedMovies = [];
  snap.forEach((doc) => {
    watchedMovies.push(doc.data().Movies.movieId);
  });

  if(watchedMovies.length === 0){
    snap = await moviesDB.orderBy("_id").get();
    snap.forEach((doc) => {
      let obj = {};
      obj["name"] = doc.data().Name;
      obj["id"] = doc.data()._id; 
      unwatchedMovies.push(obj);
    });
  }else{
    snap = await moviesDB.where("_id", "not-in", watchedMovies).orderBy("_id").get();
    snap.forEach((doc) => {
      let obj = {};
      obj["name"] = doc.data().Name;
      obj["id"] = doc.data()._id; 
      unwatchedMovies.push(obj);
    });
  }

  return unwatchedMovies;
}

const subscribeMovie = async (obj) => {
  let retVal = true;
  let snapshot = await subscriptionsDB.add(obj).catch(error => { retVal = false; });

  const docRef = snapshot.id;

  await subscriptionsDB.doc(docRef).set({ _id: docRef },{merge:true}).catch(error => { retVal = false; });

  return retVal;
}

const getMovie = async (movieId) => {
  let movie = {};
  const snapshot = await moviesDB.where('_id', "==", movieId).limit(1).get();
  snapshot.forEach(doc => {
    movie["genres"] = doc.data().Genres;
    movie["name"] = doc.data().Name;
    movie["premiered"] = doc.data().Premiered;
    movie["image"] = doc.data().Image.medium;
  });

  return movie;
}

export default {
  addMovie,
  getMoviesData,
  insertMovie,
  deleteMovie,
  editMovie,
  getWatchedMovies,
  getUnWatchedMovies,
  subscribeMovie,
  getMovie
};