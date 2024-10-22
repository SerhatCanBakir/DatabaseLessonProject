document.getElementById('addBookButton').addEventListener('click',()=>{
/* 
title,author,genre,description,stock,price
*/
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const genre = document.getElementById('bookGenre').value;
    const desc = document.getElementById('bookSummary').value;
    const stock = document.getElementById('bookStock').value;
    const price = document.getElementById('bookPrice').value;

    fetch('/api/addnewbook',{method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({title:title,author:author,genre:genre,description:desc,stock:stock,price:price})
    }).then(resp=>{if(resp.status==200){
        resp.json()
        console.log(resp);
        alert('kitap eklendi :'+resp);
    }else if(resp.status==400){
   alert('pls control the inputs')
    }else{
        alert('there is a problem in server :/');
    }})

})

document.getElementById('addAuthorButton').addEventListener('click',()=>{
    const author = document.getElementById('authorName').value;
    fetch('/api/addauthor',{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({authorName:author})}).then(resp=>{if(resp.status==200){
        return resp.json();
    }else if(resp.status==500){
        alert('sunucu patladı');
    }else{
        alert('control input');
    }}).then(data=>{
        console.log(data);
    })
   
})

document.getElementById('stockActionButton').addEventListener('click',()=>{
    
})

//burda da stock ve yazar seçenekleri gereken yerlerde datalar doldurulucak !!!
const bookSelector =  document.getElementById('selectedBook');
fetch('/api/getallbooks').then(res=>res.json()).then(resp=>{
    if(Array.isArray(resp.titles)){
        for(let i=0;i<resp.titles.length;i++){
            console.log(resp.titles[i])
        let opt = document.createElement('option');
        opt.value =resp.titles[i];
        opt.innerHTML= resp.titles[i];
        bookSelector.appendChild(opt);
        }
       }
}

)

const authorSelector = document.getElementById('bookAuthor');
fetch('/api/getallauthers').then(resp=>resp.json()).then(data=>{
   const authors = data.author;
   if(Array.isArray(authors)){
    for(let i=0;i<authors.length;i++){
        console.log(authors[i]);
        let opt = document.createElement('option');
        opt.value=authors[i]
        opt.innerHTML=authors[i];
        authorSelector.appendChild(opt);
    }
   }
})

/* */