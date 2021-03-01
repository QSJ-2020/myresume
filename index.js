// String.prototype
~function (pro) {
    function queryURLParameter() {
        var reg = /([^?=&#]+)=([^?=&#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }

    pro.queryURLParameter = queryURLParameter;
}(String.prototype);



// LOADING 第一部分！！！！
var loadingRender=(function(){
    var ary=["icon.png","zf_concatAddress.png","location.jpg","zf_concatPhone.png","zf_course.png","zf_course1.png","zf_course2.png","zf_course3.png","zf_course4.png","zf_course5.png","zf_course6.png","cube11.png","cube22.png","cube33.png","cube44.png","cube55.png","cube66.png","zf_cubeBg.jpg","zf_cubeTip.png","zf_emploment.png","zf_messageArrow1.png","zf_messageArrow2.png","zf_messageChat.png","zf_messageKeyboard.png","zf_messageLogo.png","zf_messageStudent.png","zf_outline.png","zf_phoneBg.jpg","zf_phoneDetail.png","zf_phoneListen.png","zf_phoneLogo.png","zf_return.png","zf_style1.jpg","zf_style2.jpg","zf_style3.jpg","styletip.png","myinfo1.png","myinfo2.png","myinfo3.png","myinfo4.png","myinfo5.png","myinfo6.png","teacherTip.png"]
    //获取需要操作的元素
    var $loading=$('#loading'),
        $progressEm=$loading.find('.progressEm');
    var step=0;
        totalpic=ary.length;
    return {
        init:function(){
            //循环加载所有的图片，控制进度条的宽度
            $loading.css('display','block');
            $.each(ary,function(index,item){
                item='img/'+item;
                var oImg=new Image;
                oImg.src=item;
                oImg.onload=function(){
                    step++;
                    // 控制进度
                 
                   
                    $progressEm.css('width',step/totalpic*100+"%");
                    oImg=null;
                    //所有图片都已经加载完成：关闭loading，显示PHONE区域
                    if(step===totalpic){
                        if(page===0) return;
                        window.setTimeout(function(){
                            $loading.css('display','none');
                            phoneRender.init();
                        },2000)
                    }
                }
            })
        }
    }
})();


// PHONE 第二部分！！！！！
var phoneRender=(function(){
    var $phone = $('#phone'),
    $details=$phone.children('.details'),
    $listen = $phone.children('.listen'),
    $listenTouch = $listen.children('.touch'),
    $detailsTouch = $details.children('.touch'),
    $time = $phone.children('.time');

    
    var listenMusic=$('#listenMusic')[0],
        detailsMusic=$('#detailsMusic')[0],
        musicTimer=null,
    
        //detailsMusicFn播放自我介绍的音频，计算时间。
        detailsMusicFn=function (){
            detailsMusic.play();
            musicTimer=window.setInterval(function(){
                var curTime = detailsMusic.currentTime,
                minute = Math.floor(curTime / 60),
                second = Math.floor(curTime)+1;
                minute < 10 ? minute = '0' + minute : null;
                second < 10 ? second = '0' + second : null;
                $time.html(minute + ':' + second);

            //->音频播放完成
            if (curTime === detailsMusic.duration) {
                window.clearInterval(musicTimer);
                closePhone();
            }
            },1000);
        }
    
    //关闭当前的phone区域，展示下一个区域
        function closePhone(){
            detailsMusic.pause();
            $phone.css('transform', 'translateY(' + document.documentElement.clientHeight + 'px)').on('webkitTransitionEnd', function () {
                $phone.css('display', 'none');
            });
            messageRender.init();
            }
    return {
        init:function(){
            console.log('第二部分区域');
            $phone.css('display','block');
            listenMusic.play();
            //给listen中的touch绑定点击事件：移动端的点击事件使用click会有300ms的延迟
            $listenTouch.singleTap(function(){
                listenMusic.pause();
                $listen.css('display','none');


                $time.css('display','block');
                $details.css('transform','translateY(0)');
                detailsMusicFn();
            
            })
            //给detailsTouch绑定单击事件
            $detailsTouch.singleTap(closePhone);
        }
    }
})();


//MESSAGE 第三部分！！！！
var messageRender=(function(){
    var $message = $('#message'),
    $messageList = $message.children('.messageList'),
    $list = $messageList.children('li'),
    $keyBoard = $message.children('.keyBoard'),
    $textTip = $keyBoard.children('.textTip'),
    $submit = $keyBoard.children('.submit');

var autoTimer=null;
    step=-1;
    total=$list.length,
    bounceTop=0;

var messageMusic=$("#messageMusic")[0];
    //消息发送
    function messageMove(){
        autoTimer=window.setInterval(function(){
            step++;
            var $cur=$list.eq(step);
            $cur.css({
                opacity:1,
                transform:'translateY(0)'
            });

            //当发送完成第三条的时候，开启我们的键盘操作
            if(step==2){
                window.clearInterval(autoTimer);
                $keyBoard.css('transform','translateY(0)');
                $textTip.css('display','block');
                textMove();
            }

            //从第四条开始，我们每发送一条消息，我们就让整个消息区域向上移动
            if(step>=3){
                bounceTop -= $cur[0].offsetHeight + 10;
                $messageList.css('transform', 'translateY(' + bounceTop + 'px)');
            }

            //当消息发送完成，进入下一部分
            if(step===total-1){
                window.clearInterval(autoTimer);
                window.setTimeout(function(){
                    if(page==2) return;
                    $message.css('display','none');
                    messageMusic.pause();
                    cubeRender.init();
                }, 1500);
                
            }
        },1500)
    }

    //实现文字打印机效果
    function textMove(){
        var text="我想面试贵公司的前端工程师这一职",
            n=-1;
            result='';
        var textTimer=window.setInterval(function(){
            n++;
            result+=text[n];
            $textTip.html(result);
            if(n===text.length-1){
                window.clearInterval(textTimer);
                $submit.css('display','block').singleTap(function(){
                    $textTip.css('display','none');
                    $keyBoard.css('transform','translateY(3.7rem)');
                    messageMove();
                })
            }
        },100)
    }
    return {
        init:function(){
            $message.css('display','block');
            console.log("第三部分区域");
            messageMusic.play();
            messageMove();
        }
    }
})();

// cube 第四部分 魔方区域
var cubeRender=(function(){
    var $cube=$('#cube'),
        $cubeBox=$cube.children('.cubeBox'),
        $cubeBoxList=$cubeBox.children('li');

        //滑动的处理
        //判断是否滑动超过30，如果小于30，判定为用户只是手误没有想滑动
        function isSwipe(changeX, changeY) {
            return Math.abs(changeX) > 30 || Math.abs(changeY) > 0;
        }

        function start(ev) {
            var point = ev.touches[0];
            $(this).attr({
                strX: point.clientX,
                strY: point.clientY,
                changeX: 0,
                changeY: 0
            });
        }
    
        function move(ev) {
            var point = ev.touches[0];
            var changeX = point.clientX - $(this).attr('strX'),
                changeY = point.clientY - $(this).attr('strY');
            $(this).attr({
                changeX: changeX,
                changeY: changeY
            });
        }
    
        function end(ev) {
            var changeX = parseFloat($(this).attr('changeX')),
                changeY = parseFloat($(this).attr('changeY'));
            var rotateX = parseFloat($(this).attr('rotateX')),
                rotateY = parseFloat($(this).attr('rotateY'));
            if (isSwipe(changeX, changeY) === false) return;
            rotateX = rotateX - changeY / 3;
            rotateY = rotateY + changeX / 3;
            $(this).attr({
                rotateX: rotateX,
                rotateY: rotateY
            }).css('transform', 'scale(0.6) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
        }


    return  {
        init:function(){
            console.log("第四部分区域")
            $cube.css('display','block');

            //模仿区域的滑动
            $cubeBox.attr({
                rotateX:-35,
                rotateY:45
            }).on('touchstart',start).on('touchmove',move).on('touchend',end);
            // 每一个页面的点击操作
            $cubeBoxList.singleTap(function () {
                var index = $(this).index();
                $cube.css('display', 'none');
                swiperRender.init(index);
            });
        }

    }
})();


// swiper 第五部分
var swiperRender= (function(){
    var $swiper=$('#swiper'),
        $makisu=$('#makisu'),
        $return=$swiper.children('.return');

    //实现每一屏幕滑动切换
  function change(example)
    {
        var allSlides=example.slides,
            curslideIndex=example.activeIndex;
    //给第一页样式
    if(curslideIndex===0){
        $makisu.makisu({
            selector:'dd',
            overlap:0.6,
            speed:0.8
        });
        $makisu.makisu('open');
    }else{
        $makisu.makisu({
            selector: 'dd',
            overlap: 0.6,
            speed: 0
        });
        $makisu.makisu('close');
    }
    //判断如果当前活动页是循环中的当前页则给他相应的样式，用CSS中的id选择器控制样式
    $.each(allSlides,function(index,item){
        // console.log(item);
        if(index===curslideIndex){
            item.id='page'+(curslideIndex+1);
            return;
        }
        item.id=null;
    }) 
}
    
   return {
       init: function (index) {
        $swiper.css('display', 'block');
       
        //初始化SWIPER实现六个页面之间的切换，slides存放的是所有的块，activeIndex当前页的索引
        var mySwiper=new Swiper('.swiper-container',{
            effect: 'coverflow',
            //执行回调函数change
             onTransitionEnd:change,
            onInit:change
         
             
        })
        index = index || 0;
        mySwiper.slideTo(index, 0);

        // 给返回按钮绑定点击事件
        $return.singleTap(function(){
            $swiper.css('display','none');
            $('#cube').css('display','block');
        })
   }
}
})();
    

 

var urlObj = window.location.href.queryURLParameter(),
    page = parseFloat(urlObj['page']);
    console.log(page);
if (page === 0 || isNaN(page)) {
    console.log(0);
    loadingRender.init();
}

if (page === 1) {
    console.log(111);
    phoneRender.init();
}

if (page === 2) {
    console.log(222);
    messageRender.init();
}

if (page === 3) {
    console.log(3333);
    cubeRender.init();
}

if (page === 4) {
    console.log(4444);
    swiperRender.init(0);
}