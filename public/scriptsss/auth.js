const mymodal = document.querySelectorAll('.modal')
async function signup(e){
    e.preventDefault()
    const email = document.querySelector('#signupemail')
    const pass = document.querySelector('#signuppass')
    
    try{
        const res = await firebase.auth().createUserWithEmailAndPassword(email.value,pass.value)
        await res.user.updateProfile({
            displayName: "user"
        })
        createUserCollection(res.user)
    }
    catch(err){
        console.log(err);
        alert(err.message)
    }
    email.value = ""
    pass.value = ""
    $('#exampleModal1').modal('hide')
}
async function login(e){
    e.preventDefault()
    const email = document.querySelector('#loginEmail')
    const pass = document.querySelector('#loginPass')
    try{
        const res = await firebase.auth().signInWithEmailAndPassword(email.value,pass.value)
        alert(`Welcome ${res.user.email}`)
        console.log(res);
    }
    catch(err){
        console.log(err);
        alert("Invalid Email/ Password")
    }
    email.value = ""
    pass.value = ""
    // mymodal[0].modal('hide')
    $('#exampleModal').modal('hide')
}

function logout(){
    firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      if(user.uid == '2OLnVp4tW0doXWwqASkbRjqNITJ2')
      {
          alluserdetails();
          return;
      }
      document.getElementById('table').style.display = 'none'
      getuserInfoRealTime(user.uid)
    } else {
        document.getElementById('table').style.display = 'none'
        getuserInfoRealTime(null)
      alert("Sign Out Success")
    }
  });