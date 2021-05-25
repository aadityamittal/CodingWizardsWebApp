const userDet = document.querySelector('.userDetails')
const editProfile = document.querySelector('#editProfile')
function createUserCollection(user){
    firebase.firestore().collection('users')
    .doc(user.uid)
    .set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        telegram: "",
        speciality: "",
        github_url: "",
        experience: ""
    })
    console.log("Success");
}

async function getuserInfo(userID){
    if(userID){
        const userInffo = await firebase.firestore().collection('users').doc(userID).get()

        const userInfo = userInffo.data();
    
        if(userInfo){
            document.querySelector(".to_be_hide").style.display = "none"
            document.querySelector(".det").style.display = "block"
            userDet.innerHTML = `
                <h3>${userInfo.name}</h3>
                <h3>${userInfo.email}</h3>
                <h3>${userInfo.telegram}</h3>
                <h3>${userInfo.speciality}</h3>
                <h3>${userInfo.github_url}</h3>
                <h3>${userInfo.experience}</h3>
            `
        }
    }
    else{
        document.querySelector(".to_be_hide").style.display = "block"
        document.querySelector(".det").style.display = "none"
    }
}

async function getuserInfoRealTime(userID){
    if(userID){
        const userInffo = await firebase.firestore().collection('users').doc(userID)
        userInffo.onSnapshot((doc)=>{
            if(doc.exists){
                userInfo = doc.data()
                if(userInfo){
                    document.querySelector(".to_be_hide").style.display = "none"
                    document.querySelector(".det").style.display = "block"
                    userDet.innerHTML = `<hr>
                        <h3>Name: ${userInfo.name}</h3><hr>
                        <h4>Email: ${userInfo.email}</h4><hr>
                        <h4>Telegram: <a href = ${userInfo.telegram}>Click Here</a></h4><hr>
                        <h4>Speciality: ${userInfo.speciality}</h4><hr>
                        <h4>Github: <a href = ${userInfo.github_url}>Click Here</a></h4><hr>
                        <h4>Experience: ${userInfo.experience}</h4><hr>
                        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal2">Update</button>
                    `
                        editProfile['profileName'].value = userInfo.name
                        editProfile['profileEmail'].value = userInfo.email
                        editProfile['telegramLink'].value = userInfo.telegram
                        editProfile['speciality'].value = userInfo.speciality
                        editProfile['github'].value = userInfo.github_url
                        editProfile['experience'].value = userInfo.experience

                        if(firebase.auth().currentUser.photoURL){
                            document.querySelector('#proimg').src = firebase.auth().currentUser.photoURL
                            console.log("Sces");
                        }
                            
                }
            }
            
        })
        
    }
    else{
        document.querySelector(".to_be_hide").style.display = "block"
        document.querySelector(".det").style.display = "none"
    }
}

function updateuserProfile(e){
    e.preventDefault();
    const userDocRef = firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    userDocRef.update({
        name: editProfile['profileName'].value,
        email: editProfile['profileEmail'].value,
        telegram: editProfile['telegramLink'].value,
        speciality: editProfile['speciality'].value,
        github_url: editProfile['github'].value,
        experience: editProfile['experience'].value
        
        
    })
    $('#exampleModal2').modal('hide')
}

function uploadImage(e)
{
    console.log(e.target.files[0]);
    const uid = firebase.auth().currentUser.uid
    const uploadTask = firebase.storage().ref().child(`/users/${uid}/profile`).put(e.target.files[0]);
    uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    if(progress == 100)
        alert("Uploaded")
  }, 
  (error) => {
    console.log(error);
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      console.log('File available at', downloadURL);
     firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL
    })
    });
  }
);
}

async function alluserdetails(){
    document.getElementById('table').style.display = 'table'
    document.querySelector(".to_be_hide").style.display = "none"
     document.querySelector(".det").style.display = "none"

    document.getElementById('tbody').innerHTML = ""
    const userref = await firebase.firestore().collection('users').get()
    userref.docs.forEach(docu=>{
        const info = docu.data()
        document.getElementById('tbody').innerHTML +=`
        <tr>
                     <td>${info.name}</td>
                    <td>${info.email}</td>
                    <td>${info.telegram}</td>
                    <td>${info.speciality}</td>
                    <td>${info.experience}</td>
                    <td><a href = ${info.github_url}>Click here</a></td>
        </tr>
        `
    })

}