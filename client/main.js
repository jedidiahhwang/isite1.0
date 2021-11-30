
const baseURL = 'http://localhost:5432'

//grab INPUT elements first and store them in variables
const regContainer = document.getElementById('register');
const loginContainer = document.getElementById('login');
//register section
const fname = document.getElementById('fname');
const username = document.getElementById('username');
const regEmail = document.getElementById('email');
const regPswd = document.getElementById('psw');
const confirmPswd = document.getElementById('psw-repeat')
//login section
let uname = document.getElementById('uname');
let upsw = document.getElementById('upsw');

//grab BUTTON elements and store them in variables
const regBtn = document.getElementById('reg');
const loginBtn = document.getElementById('loginBtn');
const closeSpan = document.getElementsByClassName('close')[0];
const signUpBtn = document.getElementById('signup');
const signInBtn = document.getElementById('submit')
const forgotPsw = document.getElementById('forgot')
const rememberBtn = document.getElementById('remember')
//register new user
const getAllUsers = () => axios.get(`${baseURL}/users`).then(res => console.log(res.data))
const regUser = (body) => axios.post(`${baseURL}/users/register`, body).then(res => regCB(res.data))
const deleteUser = user_id => axios.delete(`${baseURL}/users/:${user_id}`).then(res=> console.log(res.data))
const loginUser= (body) =>axios.post(`${baseURL}/users/login`,body).then(res=> userCB(res.data))
 
//add event listeners
regBtn.onclick = function(){
    regContainer.style.display = "block"
    loginContainer.style.display="none"
}
closeSpan.onclick = function(){
    regContainer.style.display="none" 
}
loginBtn.onclick = function(){
    regContainer.style.display="none";
    loginContainer.style.display='block'
}
//if all fields are valid send registered data to db
signUpBtn.onclick = function(){
   if (alphanumeric(username) && regPswd.value === confirmPswd.value && validateEmail(regEmail) && regPswd.value.length >= 6){
     registerHandler()
    } else if (regPswd.value !== confirmPswd.value){
        swal("Passwords did not match")
    }  else if (regPswd.value < 6){
        swal("Please enter an alphanumeric password of at least six characters")
    }
}

function registerHandler () {  
    let bodyObj = {
        fname: fname.value,
        username: username.value,
        regEmail: regEmail.value,
        regPswd: regPswd.value
    }
    regUser(bodyObj)
        fname.value = ""
        username.value = ""
        regEmail.value = ""
        regPswd.value = ""
}
function regCB(res){
    if(res === false){
        return swal("Username already taken. Please try again")
    } else {
        return window.location.href="profile.html"
    }
};
signInBtn.onclick = function(){
    alphanumeric(uname)
    loginHandler()
}
function loginHandler() {
    let bodyObj = {
        uname: uname.value,
        upsw: upsw.value
    }
    loginUser(bodyObj)
    uname.value = ""
    upsw.value = ""
}
const userCB = (res) => {
    if (res === false){
        return swal("Username doesn't exist or Password was incorrect")
    } else {
        return window.location.href="profile.html";
    }    
}

function alphanumeric(inputTxt) {
    let letterNumber = /^[0-9a-zA-Z]+$/;
    if (inputTxt.value.match(letterNumber)){
        return true;
    } else {
        swal("Username requires letters and numbers only")
        return false;
    }
}
//validate if email contains a string followed by '@' a string and '.'
function validateEmail(inputText){
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(inputText.value.match(mailformat)){
        return true;
    }
     else {
        return swal("You have entered an invalid email address");
    }
}