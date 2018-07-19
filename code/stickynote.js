/*
* @Author: Marte
* @Date:   2018-03-23 16:10:11
* @Last Modified by:   Marte
* @Last Modified time: 2018-03-26 15:54:42
*/

'use strict';
var colorJson=[
    {
        toplan:"#F8F7B6",
        bgColor:"LightGoldenRodYellow"
    },
    {
        toplan:"paleGreen",
        bgColor:"#C5F7C1"
    },
    {
        toplan:"#F1C3F1",
        bgColor:"#F5D0F5"
    },
    {
        toplan:"LightBlue",
        bgColor:"#C9ECF8"
    }
];

window.onload=function(){
    var stickiesArray=getStickiesArray();
    for(var i=0;i<stickiesArray.length;i++){
        var key=stickiesArray[i];
        var stickyObj=JSON.parse(localStorage.getItem(key));
        addStickyToDOM(key,stickyObj);
    }
    /*localStorage.clear();*/

}
function text(){
        for(var i=0;i<stickiesArray.length;i++){
        var key=stickiesArray[i];
        var stickyObj=JSON.parse(localStorage.getItem(key));
        addStickyToDOM(key,stickyObj);
    }
}
function deleteSticky(e){
    //1、删除DOM；2、删除stickiesArray；3、删除web本地内存
    var key=e.target.parentNode.parentNode.id;
    var li=document.getElementById(key);
    li.parentNode.removeChild(li);

    localStorage.removeItem(key);
    var stickiesArray=getStickiesArray();
    if(stickiesArray.indexOf(key)!=(-1)){
        stickiesArray.splice(stickiesArray.indexOf(key),1)
        localStorage.setItem("stickiesArray",JSON.stringify(stickiesArray));
    }

}


function getStickiesArray(){
    var stickiesArray=localStorage["stickiesArray"];
    //如果这个数组不存在或者为空
    if(!stickiesArray||stickiesArray=="[]"){
        stickiesArray=[];
        var key="sticky_"+(new Date()).getTime();
        stickiesArray.push(key);
        var stickyObj={
            value:"欢迎使用小便签应用程序！\n\n使用说明：\n1、添加便签：点击‘+’可添加；\n2、删除便签：点击‘x’可删除\n&nbsp;&nbsp;注:一旦点击数据永久删除\n3、点击右键更换颜色",
            color:colorJson[0]
        }
        localStorage.setItem("stickiesArray",JSON.stringify(stickiesArray));
        localStorage.setItem(key,JSON.stringify(stickyObj));
    }
    else{
        stickiesArray=JSON.parse(stickiesArray);
    }
    return stickiesArray;
}
function addStickyToDOM(key,stickyObj){
        var ul=document.getElementById("stickies");
        var sticky=document.createElement("li");
        sticky.setAttribute("id",key);
        sticky.style.backgroundColor=stickyObj.color;
        var toplan=document.createElement("span");
        toplan.setAttribute("class","toplan");
        var mi_addnote=document.createElement("p");
        mi_addnote.setAttribute("class","addnote fa fa-plus");
        var mi_delete=document.createElement("p");
        mi_delete.setAttribute("class","delete fa fa-close");
        var text=document.createElement("textarea");
        text.innerHTML=stickyObj.value;
        toplan.appendChild(mi_delete);
        toplan.appendChild(mi_addnote);
        sticky.appendChild(toplan);
        sticky.appendChild(text);
        ul.appendChild(sticky);
        changeColor(stickyObj.color,text);
        mi_addnote.onclick=addSticky;
        mi_delete.onclick=deleteSticky;
        text.onchange=addText;
        //绑定菜单弹出事件
        sticky.oncontextmenu=addMenu;
}
function addMenu(e){
    var e=e||document.event;
    var liTarget=e.target;
    var colors=document.getElementById("colors");
    colors.style.display="block";
    colors.style.left = e.clientX+ 'px';
    colors.style.top = (e.clientY+ document.body.scrollTop)+ 'px';
    document.onclick = function() {
        colors.style.display = 'none';
    }
    document.oncontextmenu=function(){return false};
    var colorlis=document.getElementsByClassName("color");
    for(var i=0;i<colorlis.length;i++){
        colorlis[i].onclick=function(event){
            var event=event||document.event;

            if(event.target.tagName.toLowerCase()=="li"){
                switch(event.target.innerHTML){
                    case "黄":
                    changeColor(colorJson[0],liTarget);
                    break;
                    case "绿":
                    changeColor(colorJson[1],liTarget);
                    break;
                    case "粉":
                    changeColor(colorJson[2],liTarget);
                    break;
                    case "蓝":
                    changeColor(colorJson[3],liTarget);
                    break;
                    default:
                    alert("选色出错！");
                }
            }
            else{
                alert("点击有误！");
            }
        }
    }
    return false;
}
function changeColor(colors,target){
    var liTarget=target;
    if(liTarget.tagName.toLowerCase()=="textarea"||liTarget.tagName.toLowerCase()=="span"){
        liTarget=liTarget.parentNode;
    }
    var bgColor=colors.bgColor;
    var toplanColor=colors.toplan;
    liTarget.style.background=bgColor;

    liTarget.childNodes[0].style.background=toplanColor;
    liTarget.childNodes[1].style.background=bgColor;
    var key=liTarget.id;
    var stickyObj=JSON.parse(localStorage.getItem(key));
    stickyObj.color=colors;
    localStorage.setItem(key,JSON.stringify(stickyObj));
}
function addSticky(){
    var key="sticky_"+(new Date()).getTime();
    var stickyObj={
        value:"",
        color:colorJson[0]
    }
    var stickiesArray=getStickiesArray();
    stickiesArray.push(key);
    localStorage.setItem("stickiesArray",JSON.stringify(stickiesArray));
    localStorage.setItem(key,JSON.stringify(stickyObj));
    addStickyToDOM(key,stickyObj);
}
function addText(e){
    if(e.target.tagName.toLowerCase()=="textarea"){
        var key=e.target.parentNode.id;
        var text=e.target;
        var stickyObj=JSON.parse(localStorage.getItem(key));
        stickyObj.value=text.value;
        localStorage.setItem(key,JSON.stringify(stickyObj));
    }
    else{
        alert("出错了！")
    }
}