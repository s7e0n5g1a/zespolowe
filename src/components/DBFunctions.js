import firebase from "firebase";
import db from './firebaseInit'

// dodaj uzytkownika
// wzorzec:
// if (firebase.auth().currentUser)
//   addUser(firebase.auth().currentUser.uid,firebase.auth().currentUser.email);
function addUser(id,email) {
    let data = {
        email: '',
        last_name: '',
        name: '',
        password: '',
        photo: ''
    };
    data.email = email;
    db.collection('Users').doc(id).set(data);
    let profileData = {
        desc: '',
        followers: 0,
        following: 0,
        home: '',
        id_user: db.doc('Users/' + id),
        photo: '',
    };
    db.collection('Profiles').doc().set(profileData);
    // eslint-disable-next-line no-console
    console.log('account created');
}

function addJourney(dest,endd,userid,begd) {
    let data = {
        destination: dest,
        end_date: firebase.firestore.Timestamp.fromDate(endd),
        id_organizer: userid,
        start_date: firebase.firestore.Timestamp.fromDate(begd),
        travelers: [userid],
        pending: []
    };
    db.collection('Travels').add(data);
}

// ustal imie uzytkownika
// wzorzec:
// if (firebase.auth().currentUser)
//   setUserName(firebase.auth().currentUser.uid,"Adam");
function setUserName(id,name) {
    db.collection('Users').doc(id).update({name: name});
}

// ustal nazwisko uzytkownika
// wzorzec:
// if (firebase.auth().currentUser)
//   setUserLastName(firebase.auth().currentUser.uid,"Kowalski");
function setUserLastName(id,nazwisko) {
    db.collection('Users').doc(id).update({last_name: nazwisko});
}

// pobierz uzytkownika
// wzorzec
// if (firebase.auth().currentUser)
//   getUser(firebase.auth().currentUser.uid).then(function (output) {
//           somestring = output;
//   }
function getUser(id) {
    let userRef = db.collection('Users').doc(id);
    return userRef.get()
        .then( function(doc) {
            if (!doc.exists) {
                // eslint-disable-next-line no-console
                console.log('No such document!');
                return "";
            } else {
                // eslint-disable-next-line no-console
                console.log('Document data:',doc.data());
                return doc.data();
            }
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.log('Error getting document', err);
            return "";
        });
}
// pobierz podroze uzytkownika
// wzorzec
// if (firebase.auth().currentUser)
//   getTravels(firebase.auth().currentUser.uid).then(function (output) {
//       somestring = output; // zwroci array ze stringami
//   }
function getTravels(id) {
    let userRef = db.collection('Travels');
    return userRef.where('travelers', 'array-contains', id).get()
        .then(snapshot => {
            var travs = [];
            if (snapshot.empty) {
                // eslint-disable-next-line no-console
                console.log('No matching documents.',id);
                return travs;
            }

            snapshot.forEach(doc => {
                // eslint-disable-next-line no-console
                console.log(doc.id, '=>', doc.data(),);
                travs.push(doc);
            });
            return travs;
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.log('Error getting documents', err);
            return;
        });
}

function getTravel(id) {
    let Ref = db.collection('Travels').doc(id);
    return Ref.get()
        .then( function(doc) {
            if (!doc.exists) {
                // eslint-disable-next-line no-console
                console.log('No such document!');
                return "";
            } else {
                // eslint-disable-next-line no-console
                console.log('Document data:',doc.data());
                return doc.data();
            }
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.log('Error getting document', err);
            return "";
        });
}

function getRecommendations() {
    let userRef = db.collection('Recommendations');
    return userRef.get()
        .then(snapshot => {
            var recs = [];
            if (snapshot.empty) {
                // eslint-disable-next-line no-console
                console.log('No matching documents.');
                return recs;
            }

            snapshot.forEach(doc => {
                // eslint-disable-next-line no-console
                console.log(doc.id, '=>', doc.data());
                recs.push(doc.data().dest);
            });
            return recs;
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.log('Error getting documents', err);
            return;
        });
}

function allusers() {
    let userRef = db.collection('Users');
    return userRef.get()
        .then(snapshot => {
            var users = [];
            if (snapshot.empty) {
                // eslint-disable-next-line no-console
                console.log('No matching documents.');
                return users;
            }

            snapshot.forEach(doc => {
                // eslint-disable-next-line no-console
                console.log(doc.id, '=>', doc.data());
                users.push(doc.data());
            });
            return users;
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.log('Error getting documents', err);
            return;
        });
}

function allTravels() {
    let userRef = db.collection('Travels');
    return userRef.get()
        .then(snapshot => {
            var travels = [];
            if (snapshot.empty) {
                // eslint-disable-next-line no-console
                console.log('No matching documents.');
                return travels;
            }

            snapshot.forEach(doc => {
                // eslint-disable-next-line no-console
                console.log(doc.id, '=>', doc);
                travels.push(doc);
            });
            return travels;
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.log('Error getting documents', err);
            return;
        });
}

function deleteFromJourney(id,jourid) {
    const FieldValue = firebase.firestore.FieldValue;
    // eslint-disable-next-line no-console
    console.log('jourid2: ', id);
    return db.collection('Travels').doc(jourid).update({"travelers": FieldValue.arrayRemove(id)}).then({

    })
}
function pendingtotraveler(id,jourid) {
    const FieldValue = firebase.firestore.FieldValue;

    db.collection('Travels').doc(jourid).update({"travelers": FieldValue.arrayUnion(id)});
    return db.collection('Travels').doc(jourid).update({"pending": FieldValue.arrayRemove(id)}).then({

    })
}

function pendingdecline(id,jourid) {
    const FieldValue = firebase.firestore.FieldValue;

    return db.collection('Travels').doc(jourid).update({"pending": FieldValue.arrayRemove(id)}).then({

    })
}

function addpending(id,jourid) {
    const FieldValue = firebase.firestore.FieldValue;

    db.collection('Travels').doc(jourid).update({"pending": FieldValue.arrayUnion(id)});
}


export {addUser,setUserName,setUserLastName,getTravels,allusers,deleteFromJourney,addJourney,getRecommendations,getTravel,getUser,pendingtotraveler,allTravels,pendingdecline,addpending};
