// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//
const {ipcRenderer} = require('electron');
var $ = require('jquery');

document.getElementById("exit-btn").addEventListener("click", function(){
    ipcRenderer.send('asynchronous-message','exit');
});

document.getElementById("new-article-note-btn").addEventListener("click", function(){
    $('.nav-tabs li').removeClass('active');
    $('#new-article-note-btn-li').addClass('active');
    $(".articlelace-frame").css("display","none");
    $("#new-article-note-frame").css("display","block");
});
document.getElementById("list-btn").addEventListener("click", function(){
    $('.nav-tabs li').removeClass('active');
    $('#list-btn-li').addClass('active');
    $(".articlelace-frame").css("display","none");
    $("#article-list-frame").css("display","block");
    ipcRenderer.send('asynchronous-message','load-article-notes');
});
document.getElementById("new-article-save").addEventListener("click",function(){
    var articleItem = {
        "id" :-1,
        "title": $("#new-article-title").val(),
        "authors": $("#new-article-authors").val(),
        "year": $("#new-article-year").val(),
        "keywords": $("#new-article-keywords").val(),
        "abstract": $("#new-article-abstract").val(),
        "record-time": (new Date()).toUTCString()
    }
    console.log(articleItem);
    ipcRenderer.send('new-article-save',articleItem); 
});


ipcRenderer.on("asynchronous-reply", (event, arg)=>{
    if (arg === 'save-success'){
        document.getElementById("list-btn").click();
    }
    console.log(arg);
});

ipcRenderer.on('asyn-articles-data', (event, arg)=>{
    var articles = arg['articles'];
    var articleList = document.createElement('div');
    articleList.className = 'list-group';
    for (var i=0;i<articles.length;++i){
        var articleInfo = articles[i];
        var title = articleInfo['title'];
        var authors = articleInfo['authors'];
        var year = articleInfo['year'];
        var keywords = articleInfo['keywords'];
        var articleShowBlock = document.createElement('a');
        articleShowBlock.className='list-group-item';    
        var titleH4 = document.createElement('h4');
        titleH4.innerHTML=title;
        titleH4.className='list-group-item-heading';
        var authorsP = document.createElement('p');
        authorsP.innerHTML = authors+'('+year+')';
        var keywordsP = document.createElement('p');
        keywordsP.innerHTML = 'Keywords: '+ keywords;
        articleShowBlock.appendChild(titleH4);
        articleShowBlock.appendChild(authorsP);
        articleShowBlock.appendChild(keywordsP);
        articleShowBlock.setAttribute("id","article-list-item-"+i);
        articleShowBlock.setAttribute("href","#");
        articleList.appendChild(articleShowBlock);
    }
    var listFrame = document.getElementById('article-list-frame');
    while (listFrame.firstChild!==null){
        listFrame.removeChild(listFrame.firstChild);
    }
    listFrame.appendChild(articleList);
});

ipcRenderer.send('asynchronous-message','load-article-notes');
