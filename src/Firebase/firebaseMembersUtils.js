import { db } from './firebaseConfig'

const membersDB = db.collection('Members');
const subscriptionsDB = db.collection('Subscriptions');

const addMember = async(memeber) => {
  await membersDB.add(memeber);
}

const insertMember = async(memeber) => {
  let docRef;
  let retVal = true;
  let snapshot = await membersDB.add(memeber).catch(error => { retVal = false; });

  docRef = snapshot.id;

  await membersDB.doc(docRef).update({ _id: docRef }).catch(error => { retVal = false; });

  return retVal;
}

const existMembersDB = async () => {
  const collection = { flag: false };
  const snapshot = await membersDB.limit(1).get();
  snapshot.forEach(doc => {
    collection["flag"] = true;
  });
  return collection;
}

const getMembers = async () => {
  const memebrs = [];
  const snapshot = await membersDB.orderBy("_id").get();
  snapshot.forEach(doc => {
    let obj = {};
    obj["city"] = doc.data().City;
    obj["name"] = doc.data().Name;
    obj["email"] = doc.data().Email;
    obj["id"] = doc.data()._id;
    memebrs.push(obj);
  });
  return memebrs;
}

const editMember = async (obj) => {
  let docRef;
  let success = true;
  let snapshot = await membersDB.where("_id", "==", obj._id)
    .limit(1)
    .get().catch(error => { success = false; });

  snapshot.forEach(doc => {
    docRef = doc.id;
  });

  await membersDB.doc(docRef).update(obj).catch(error => { success = false; });

  return success;
}

const deleteMember = async (id) => {
  let res = true;
  let snapshot = await membersDB.where('_id', '==', id).get().catch(error => { res = false; });
  snapshot.forEach(doc => {
    doc.ref.delete();
  });

  snapshot = await subscriptionsDB.where('MemberId', '==', id).get().catch(error => { res = false; });
  snapshot.forEach(doc => {
    doc.ref.delete();
  });

  return res;
}

const getWatchedMembers = async (movieId) => {
  const snap = await subscriptionsDB.where("Movies.movieId", "==", movieId).get();
  const members = [];
  for (const doc of snap.docs) {
    let obj = {};
    const memberId = doc.data().MemberId;
    obj["id"] = memberId;
    obj["date"] = doc.data().Movies.date;
    const snapshot = await membersDB.where("_id", "==", memberId).limit(1).get();
    snapshot.forEach((doc) => {
      obj["name"] = doc.data().Name;
    });
    members.push(obj);
  }

  return members;
}

const getMember = async (memberId) => {
  const memebr = {};
  const snapshot = await membersDB.where('_id', "==", memberId).limit(1).get();
  snapshot.forEach(doc => {
    memebr["city"] = doc.data().City;
    memebr["name"] = doc.data().Name;
    memebr["email"] = doc.data().Email;
  });

  return memebr;
}

export default {
  addMember,
  existMembersDB,
  getWatchedMembers,
  getMembers,
  editMember,
  deleteMember,
  insertMember,
  getMember
};