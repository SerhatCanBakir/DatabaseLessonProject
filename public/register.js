

document.getElementById('loginBtn').addEventListener('click',()=>{  

    var username = document.getElementById('usernameText').value;
    var pass = document.getElementById('passwordText').value;
    console.log(username+"/"+pass);
    fetch('/api/register',{method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({username:username,password:pass}),
    }).then(res => {
        if(res.status==200){
            console.log('return 200')
            return res.json();
        }else{
            alert('user found');
        }
    }).then(data =>{
    document.cookie = 'token:'+data.token+';';
    if(data.role=='admin'){
    window.location.href='/adminpage';
    }else{
    window.location.href='/mainpage';
    }
    })})
    
    let deneme = ()=>console.log('burdayım');
    deneme();