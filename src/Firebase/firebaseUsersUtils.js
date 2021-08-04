import { db, today } from './firebaseConfig'

const usersDB = db.collection('Users');
const usersLoginDB = db.collection('UsersLogin');
const permissionsDB = db.collection('Permissions');

const validateCredentials = async (usrname, pwd) => {
  const collection = {};
  const snapshot = await usersLoginDB.where("UserName", "==", usrname)
    .where("Password", "==", pwd)
    .limit(1)
    .get();
  snapshot.forEach(doc => {
    collection["id"] = doc.data()._Id;
  });
  
  return collection;
}

const getUserName = async (usrid) => {
  const collection = {};
  const snapshot = await usersDB.where("Id", "==", usrid)
    .limit(1)
    .get();

  snapshot.forEach(doc => {
    collection["name"] = doc.data().First_Name;
    collection["timeout"] = doc.data().SessionTimeOut;
  });
  return collection;
}

const getUserPermissions = async (usrid) => {
  const collection = {};
  const snapshot = await permissionsDB.where("Id", "==", usrid.toString())
    .limit(1)
    .get();

  snapshot.forEach(doc => {
    collection["permissions"] = doc.data().Permissions;
  });
  return collection;
}

const validateNewUser = async (usrname) => {
  const collection = {};
  const snapshot = await usersLoginDB.where("UserName", "==", usrname)
    .where("Password", "==", '')
    .limit(1)
    .get();
  snapshot.forEach(doc => {
    collection["doc_id"] = doc.id;
  });
  return collection;
}

const updateUserPwd = (doc_id, pwd) => {
  usersLoginDB.doc(doc_id).update({ Password: pwd });
}

const getUsersData = async () => {
  let users = [];

  let snapshot = await usersLoginDB.orderBy("_Id").get();
  snapshot.forEach(doc => {
    let obj = {};
    obj["doc_id"] = doc.id;
    obj["id"] = doc.data()._Id;
    obj["username"] = doc.data().UserName;
    users.push(obj);
  });

  snapshot = await usersDB.orderBy("Id").get();
  snapshot.forEach(doc => {
    let obj = {};
    obj["name"] = doc.data().First_Name + ' ' + doc.data().Last_Name;
    obj["session"] = doc.data().SessionTimeOut;
    const date = new Date(doc.data().Created_Date.seconds * 1000);
    obj["created"] = date.toLocaleDateString("he-IL");
    users = users.map(user => (user.id == doc.data().Id ? Object.assign({}, user, obj) : user));
  });

  snapshot = await permissionsDB.orderBy("Id").get();
  snapshot.forEach(doc => {
    let obj = {};
    obj["permissions"] = doc.data().Permissions;
    users = users.map(user => (user.id == doc.data().Id ? Object.assign({}, user, obj) : user));
  });

  return users;
}

const deleteUser = async (id) => {
  let res = true;
  let snapshot = await usersLoginDB.where('_Id', '==', id).get().catch(error => { res = false; });;
  snapshot.forEach(doc => {
    doc.ref.delete();
  });

  snapshot = await usersDB.where('Id', '==', id).get().catch(error => { res = false; });;
  snapshot.forEach(doc => {
    doc.ref.delete();
  });

  snapshot = await permissionsDB.where('Id', '==', id).get().catch(error => { res = false; });;
  snapshot.forEach(doc => {
    doc.ref.delete();
  });

  return res;
}

const insertUser = async (obj) => {
  let docRef;
  let retVal = true;
  let snapshot = await usersLoginDB.add({
    Password: '',
    UserName: obj.username
  }).catch(error => { retVal = false; });

  docRef = snapshot.id;

  await usersLoginDB.doc(docRef).set({ _Id: docRef }, { merge: true }).catch(error => { retVal = false; });

  await usersDB.add({
    Id: docRef,
    First_Name: obj.fname,
    Last_Name: obj.lname,
    SessionTimeOut: obj.session,
    Created_Date: today
  }).catch(error => { retVal = false; });

  await permissionsDB.add({
    Id: docRef,
    Permissions: obj.permissions
  }).catch(error => { retVal = false; });

  return retVal;
}

const updateUser = async (obj) => {
  debugger;
  let docRef;
  let snapshot;
  if (obj.id === 1) {
    snapshot = await usersLoginDB.where("_Id", "==", obj.id)
      .limit(1)
      .get();

    docRef = snapshot.docs[0].id;
  } else docRef = obj.id;

  usersLoginDB.doc(docRef).update({ UserName: obj.username });

  snapshot = await usersDB.where("Id", "==", obj.id)
    .limit(1)
    .get();

  docRef = snapshot.docs[0].id;

  usersDB.doc(docRef).update({
    First_Name: obj.fname,
    Last_Name: obj.lname,
    SessionTimeOut: obj.session
  });

  snapshot = await permissionsDB.where("Id", "==", obj.id.toString())
    .limit(1)
    .get();

  docRef = snapshot.docs[0].id;

  permissionsDB.doc(docRef).update({
    Permissions: obj.permissions
  });
}

export default {
  validateCredentials,
  getUserName,
  getUserPermissions,
  validateNewUser,
  updateUserPwd,
  getUsersData,
  deleteUser,
  insertUser,
  updateUser
};