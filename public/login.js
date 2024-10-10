var username = document.getElementById('usernameText').value;
var pass = document.getElementById('passwordText').value;
document.getElementById('loginBtn').addEventListener('click',()=>{
fetch('/api/login',{method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({username:username,password:pass}),
}).then(res => {
    if(res.status==200){
        return res.json();
    }else{
        alert('user not found');
    }
}).then(data =>{
document.cookie = 'token:'+data.token+';';
if(data.role=='admin'){
window.location.href='/adminpage';
}else{
window.location.href='/mainpage';
}
})})