$(document).ready(function(){
    $("#BPTrigger").click(function(){
        var isShowingbp=$(event.target).attr('showbp')=='true';
        var txt=isShowingbp?"显示底图":"隐藏底图";
        var optcity=isShowingbp?1:0.7;
        event.target.innerHTML=txt;
        $(event.target).attr('showbp',!isShowingbp);
        $('#colors_sketch').css('background-color', 'rgba(255,255,255,'+optcity+')');
    });
    $("#close-btn").click(function(){
        /*
        if (myScroll != null) {
         //  myScroll.destroy();
         //  myScroll.disable();
         }
         */
        // $("#huise").css("display","none");
        $("#huise").css("display","none");
        $("#huise").css("visibility","hidden");
        $("#toptips").css("display","none");
        $("#righttips").css("display","none");
        clearpicnum();
        ghavezan=false;
    });
    $("#pinglun-btn").click(function(){
        if(getCookie("picnum")>0){   
            TINY.box.show({html:"<div class='messege_content'>请尽情吐槽吧~</div> <input type='text' id='type-box' name='type-box' maxlength='140' style='width:80%;' />  <div style='margin: 7px;'><a onclick='SubmitComment()'>确定</a></div> ",width:150,height:100,boxid:"messege",animate:false});
          }else{
            TINY.box.show({html:"<div class='messege_content'>提交作品后<br>才可以吐槽哟</div>",boxid:"messege",animate:false});
        }
        // var comment =  $("#type-box").val();
        //alert(comment);
    });
    $("#zan-btn").click(function(){
        zan();
        // $("#bigpic").attr("src","http://nya.oss-cn-hangzhou.aliyuncs.com/nya/1.png");
    });
    $("#comment-btn").click(function(){
        SubmitComment();
        
        // $("#bigpic").attr("src","http://nya.oss-cn-hangzhou.aliyuncs.com/nya/1.png");
    });
    $("#searchconfirm").click(function(){
        TINY.box.show({html:"<div class='messege_content'>请输入作品编号!</div> <input  type='text' id='search-box' name='search-box' maxlength='10' style='width:80%;' />  <div style='margin: 7px;'><a onclick='searchpic()'>确定</a></div> ",width:150,height:100,boxid:"messege",animate:false,close:true});
    });
    var cuxi = 1;
    $("#yl_btn").click(function(){
        if(cuxi == 1){
            $("#yl_btn").attr("data-size","7");
            $("#yl_btn img").attr("src","imges/button01-2.gif");
            cuxi = 2;
        }else{
            $("#yl_btn").attr("data-size","15");
            $("#yl_btn img").attr("src","imges/button01-1.gif");
            cuxi = 1;
        }
    });
    // 先判断cookie看是否第一次访问，否则刷新
    /*
    var Sec = 3;
    var exp = new Date();
    exp.setTime(exp.getTime() + Sec*1000);

    if(!getCookie("indexfirst")||getCookie("indexfirst")=="0"){
        document.cookie="indexfirst=1;expires=" + exp.toGMTString();
        window.location.reload();
    }
    */

    $('.changeBP').bind('click',function(){
        $('#imagePicker').click();
    });
    $('#imagePicker').bind('change',function(){

        var img = event.target.files[0];

        // 判断是否图片
        if(!img){
            return ;
        }

        // 判断图片格式
        if(!(img.type.indexOf('image')==0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name)) ){
            alert('图片只能是jpg,gif,png');
            return ;
        }

        var reader = new FileReader();
        reader.readAsDataURL(img);

        reader.onload = function(e){ // reader onload start
            $('#sketch-wrap').css('background-image',"url("+e.target.result+")");
        } // reader onload end
    });
});

//点赞部分
var ghavezan=false;//全局点赞
function zan(){
    if(ghavezan)return;
    ghavezan=true;
    var file = gfile;
    $.ajax({
        type:"post",
        url:"zan.php",
        data:{
            picnum:file
        },
        success:function(msg){
            //接收PHP返回的信息,是否点赞成功,如果成功,前台JS进行特效转换来提醒用户点赞成功  如果未成功则提示原因等等
            if(msg=="已经赞过")
            {
                $.tipsBox({
                    obj: $(document.getElementById(file)),
                    str: "已赞过~",
                    startSize: "20px",  //动画开始的文字大小
                    endSize: "20px",    //动画结束的文字大小
                    interval: 1500,  //动画时间间隔
                    callback: function(){
                        //alert(5);
                    }
                });
            }else{
                //document.getElementById(file).innerHTML = parseInt(document.getElementById(file).innerHTML)+1;
                $("#"+file).text(parseInt($("#"+file).text())+1);
                $.tipsBox({
                    obj: $(document.getElementById(file)),
                    str: "+1",
                    callback: function(){
                        //alert(5);
                    }
                });
                // document.getElementById("zan"+file).innerHTML = parseInt(document.getElementById(document.getElementById("zan"+file).innerHTML).innerHTML)+1;
            }
        }
    });
}

//发表作品
function confirm(){
    if(pencount<3) {
        TINY.box.show({html:"您画得太简单了啦！",boxid:"success",top:100,autohide:2,top:100});
    }else {
        var radio="";
        var name=getCookie('name')||"";
        if(getCookie('picnum'))radio="<br><input type='checkbox' id='updateCheck' name='updateCheck' checked='true'/> <label for='update'>覆盖原图</label>";
        TINY.box.show({html:"<div class='messege_content'>请留下您的大名!</div> <input type='text' id='name' name='name' value='"+name+"' maxlength='8' style='width:80%;' /> "+radio+" <div style='margin: 7px;'><a onclick='submit()'>确定</a></div> ",width:150,height:100,boxid:"messege",top:100});
    }
}

function submit(){
    var updateCheckBox=document.getElementById('updateCheck');
    var shouldUpdate=updateCheckBox&&updateCheckBox.checked?true:false;
    var name = document.getElementById('name').value;
    if(name==""){
        TINY.box.show({html:"对不起，姓名不能为空",boxid:"success",top:100,autohide:2,top:100});
    } else postdata(name,shouldUpdate);
}

function a(obj){
    var cc = document.getElementById("c");
    cc.setAttribute("data-color",obj.value);
    cc.style.cssText = "background-color:"+obj.value+";cursor:pointer";
    cc.click();
}

function b(obj){
    var ww = document.getElementById("w");
    ww.setAttribute("data-size",obj.value);
    ww.click();
}

function postdata(name,update){
    var pic = document.getElementById("colors_sketch");
    var mysketch=$('#colors_sketch').data('sketch');
    var actions=mysketch.actions;
    var canvasSize={w:$('#colors_sketch').width(),h:$('#colors_sketch').height()};
    TINY.box.show({html:"<div style='text-align: center;' >正在提交图片<br>请耐心等待哟!<div>",animate:true,close:false,boxid:"success",top:100});
    var data={
        name:name,
        canvasSize:JSON.stringify(canvasSize),
        actions:JSON.stringify(actions),
        picdata:pic.toDataURL()
    };

    if(update){
        data.imgid=getCookie('picnum');
    }
    setTimeout(function(){
        post('storage',data);
    }, 500);
}

function post(url, data)
{
    $.ajax({
        type: "post",
        url: url,
        data:data,
        contentType: "application/x-www-form-urlencoded; charset=utf-8", 
        success: function(result){
            if(result=="false"){
                TINY.box.show({html:"服务器异常，请稍后再试",animate:true,close:false,boxid:"success",top:100});
            } else if(result=="error1"){
                TINY.box.show({html:"不允许使用该名称",animate:true,close:false,boxid:"success",top:100});
            } else {
                var Day = 20;
                //  var Min = 60;
                var exp = new Date();
                exp.setTime(exp.getTime() + Day*24*60*60*1000);
                document.cookie="picnum="+result+";expires=" + exp.toGMTString();
                document.cookie="name="+encodeURIComponent(data.name, "UTF-8")+";expires=" + exp.toGMTString();
                TINY.box.show({html:"作品保存成功,<br>您的作品编号:"+result,animate:true,close:false,boxid:"success",top:100,autohide:2});
                //TINY.box.show({html:"<a href='http://192.168.1.166/mwapp/tuya?picnum="+result+"' style='text-decoration:none; color: white;'>作品保存成功,<br>您的作品编号:"+result+"<br>2秒后跳转至作品！</a>",animate:true,close:false,boxid:"success",top:100,autohide:2,closejs:function(){gomypic()}});
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            TINY.box.show({html:"网络故障，请稍后再试",animate:true,close:false,boxid:"success",top:100});
        }
    });
}

function gomypic(){
    window.location.href="tuya?picnum="+getCookie("picnum");
}

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)) return decodeURIComponent(arr[2], "UTF-8");
    else return null;
}

function getpic(){
    var name = getCookie("name");
    var imgid = getCookie("picnum");
    var url='tuya';
    $.ajax({
        type: "get",
        url: url,
        contentType: "application/x-www-form-urlencoded; charset=utf-8", 
        data:{
            imgid:imgid,
            name:name
        },
        success: function(result){
            var picUrl=result.url;
            if(picUrl.indexOf("error")==0){
                TINY.box.show({html:picUrl.substr(6),animate:true,close:false,boxid:"success",top:100});
                return;
            }
            var actions=result.actions;
            var pic = document.getElementById("colors_sketch");
            var mysketch=$('#colors_sketch').data('sketch');
            mysketch.actions=actions;
            mysketch.replay();

        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            TINY.box.show({html:"网络故障，请稍后再试",animate:true,close:false,boxid:"success",top:100});
        }
    });
}

function getPicList(){
    //var name = getCookie("name");
    //var imgid = getCookie("picnum");
    var url='tuya';
    $.ajax({
        type: "get",
        url: url,
        data:{piclist:true},
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(result){
            var status=result.status;
            if(status=="error"){
                TINY.box.show({html:picUrl.substr(6),animate:true,close:false,boxid:"success",top:100});
                return;
            }

            updatePicList(result.piclist);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            updatePicList();
            console.log("getPicList 网络故障，使用测试数据");
            //TINY.box.show({html:"网络故障，请稍后再试",animate:true,close:false,boxid:"success",top:100});
        }
    });
}

function updatePicList(pics){
    var piclist=pics||["qdyBwHL-S1avv05CEPJGRg.png","XhF-guuoS9ephrthwXfNow.png"];
    var picList = $("#pic-list");
    var piclistUL=$('<ul>');
    $.each(piclist,function(i,pic){
        piclistUL.append($('<li>').append($("<a onclick='pullmeBack()' class='jsc-sidebar-trigger' picnum='"+pic.replace('.png','')+"'>").append($('<img>').attr('picnum',pic.replace('.png','')).attr('src','upload/'+pic))));

    });
    picList.empty().append(piclistUL);

}
//点赞动画
(function($) {
    $.extend({
        tipsBox: function(options) {
            options = $.extend({
                obj: null,  //jq对象，要在那个html标签上显示
                str: "+1",  //字符串，要显示的内容;也可以传一段html，如: "<b style='font-family:Microsoft YaHei;'>+1</b>"
                startSize: "25px",  //动画开始的文字大小
                endSize: "25px",    //动画结束的文字大小
                interval: 1500,  //动画时间间隔
                color: "red",    //文字颜色
                callback: function() {}    //回调函数
            }, options);
            $("body").append("<span class='num'>"+ options.str +"</span>");
            var box = $(".num");
            var left = options.obj.offset().left + options.obj.width() / 2;
            var top = options.obj.offset().top - options.obj.height();
            box.css({
                "position": "absolute",
                "left": left + "px",
                "top": top + "px",
                "z-index": 9999,
                "font-size": options.startSize,
                "line-height": options.endSize,
                "color": options.color
            });
            box.animate({
                "font-size": options.endSize,
                "opacity": "0",
                "top": top - parseInt(options.endSize) + "px"
            }, options.interval , function() {
                box.remove();
                options.callback();
            });
        }
    });
})(jQuery);
