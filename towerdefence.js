 (function(){

        var theCanvas = document.querySelector("#canvasone");
        var context = theCanvas.getContext("2d");

        

        var allObj = [];   // 存储所有怪物对象
        var allT = [];     // 存储所有塔对象
        var startTime = +new Date();   // 游戏开始时间
        var gameloop = null;


        var empty = [
            [0,0,0,0,1,1,1,1,0,0,0],
            [1,1,0,0,1,0,0,1,0,0,0],
            [0,1,0,0,1,0,0,1,0,1,1],
            [0,1,0,0,1,1,0,1,0,1,0],
            [0,1,0,0,0,1,0,1,1,1,0],
            [0,1,1,1,1,1,0,0,0,0,0]
        ];
        var ifShowEmpty = false;
        var ul = document.querySelector("ul");
        var tempT = -1;         // 保存1~5，表示点击要哪个塔
        var showRemoveSign = false;   // 显示remove标志
        var removeX = 0;                // 显示标志的x下标
        var removeY = 0;                // 显示标志的y下标
        
        
        // 5种塔对象
        var TObj = function(name, x, y, power){
            this.name = name;
            this.x = x;                // 代表的是在empty中的下标！！！
            this.y = y;
            this.power = power;         // 攻击力
        };
        var coldObj = function(name, x, y, power){
            TObj.call(this, name, x, y, power);     // 继承
            this.mintime = 0;
            this.maxtime = 10;     // 记录冷却时间, 刷新时间为20ms，所以冷却时间为20ms x 10
            this.minr = 50;
            this.maxr = 150;         // 攻击半径
        };
        var heartObj = function(name, x, y, power){
            TObj.call(this, name, x, y, power);     // 继承
            this.mintime = 0;
            this.maxtime = 30;     // 记录冷却时间, 刷新时间为20ms，所以冷却时间为20ms x 50
            this.minr = 50;         // 全屏攻击，所以最大半径取max(theCanvas.width, theCanvas.height)
        };
        var fireObj = function(name, x, y, power){
            TObj.call(this, name, x, y, power);     // 继承
            this.mintime = 0;
            this.maxtime = 20;     // 记录冷却时间, 刷新时间为20ms，所以冷却时间为20ms x 20
            this.minr = 50;
            this.maxr = 120;         // 攻击半径
        };
        var bgObj = function(name, x, y, power){
            TObj.call(this, name, x, y, power);     // 继承
            this.mintime = 0;
            this.maxtime = 30;     // 冷却时间, 刷新时间为20ms，所以冷却时间为20ms x 30
            this.bctime = 0;    // 记录纵横转换冷却时间， 用0.1表示，可以带进globalAlpha中
            this.ectime = 1;
            this.direction = 0;     // 0表示横向攻击， 1表示纵向攻击
        };
        var fishObj = function(name, x, y, power){
            TObj.call(this, name, x, y, power);     // 继承
            this.mintime = 0;
            this.maxtime = 30;     // 冷却时间, 刷新时间为20ms，所以冷却时间为20ms x 30
            this.isattack = false;   // 是否在击打
            this.attackobj = null;   // 正在击打的目标    
            this.gjtime = 50;
            this.nctime = 50;        // 过20*20ms再攻击一次
            this.balls = [];         // 每个fish塔都有自己的炮弹数组
        };


        // 怪物图标
        var img0 = new Image();
        img0.src = "tfimg/0.png";
        var img1 = new Image();
        img1.src = "tfimg/1.png";
        var img2 = new Image();
        img2.src = "tfimg/2.png";
        var img3 = new Image();
        img3.src = "tfimg/3.png";
        var img4 = new Image();
        img4.src = "tfimg/4.png";
        var img5 = new Image();
        img5.src = "tfimg/5.png";
        var img6 = new Image();
        img6.src = "tfimg/6.png";
        var img7 = new Image();
        img7.src = "tfimg/7.png";
        var img8 = new Image();
        img8.src = "tfimg/8.png";
        var img9 = new Image();
        img9.src = "tfimg/9.png";

        // 5个塔图标
        var cold = new Image();
        cold.src = "tfimg/cold.png";
        var heart = new Image();
        heart.src = "tfimg/heart.png";
        var fire = new Image();
        fire.src = "tfimg/fire.png";
        var bg = new Image();
        bg.src = "tfimg/bg.png";
        var fish = new Image();
        fish.src = "tfimg/fish.png";

        // 爱心攻击图标
        var littleheart = new Image();
        littleheart.src = "tfimg/littleheart.png";

        // 拆塔图标
        var removeimg = new Image();
        removeimg.src = "tfimg/remove.png";

                                
        DrawBackground(context);
        // 开始动画
        CanvasApp();
        function CanvasApp(){

            function DrawScreen(){
                DrawBackground(context);

                ShowAttack(context);


                // 显示拆塔标志
                if (showRemoveSign){
                    RemoveT(removeX, removeY, context);     // 调用拆塔标志显示函数
                }


                // 出怪
                for (var i = 0; i < allObj.length; i++){
                    
                    var obj = allObj[i];
                    NextDirection(obj);
                    obj.x += obj.speedX;
                    obj.y += obj.speedY;


                    switch (obj.name){
                        case "0":
                            context.drawImage(img0, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "1":
                            context.drawImage(img1, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "2":
                            context.drawImage(img2, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "3":
                            context.drawImage(img3, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "4":
                            context.drawImage(img4, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "5":
                            context.drawImage(img5, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "6":
                            context.drawImage(img6, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "7":
                            context.drawImage(img7, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "8":
                            context.drawImage(img8, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                        case "9":
                            context.drawImage(img9, obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                            break;
                    }


                    // 根据塔范围伤血
                    for (var j = 0; j < allT.length; j++){
                        var tempobj = allT[j];
                        var deg = 0;
                        var pointx, pointy;
                        switch (tempobj.name){
                            
                            case "coldObj":
                                for (deg = 0; deg < 360; deg++){
                                    pointx = tempobj.y*100+50+Math.sin(deg*Math.PI/180)*tempobj.minr;
                                    pointy = tempobj.x*100+50+Math.cos(deg*Math.PI/180)*tempobj.minr;

                                    if (obj.x > pointx && obj.x < pointx+5  && obj.y > pointy && obj.y < pointy+5){  // 打到
                                        obj.tempblood -= tempobj.power;   // 伤血
                                        if (obj.speedX !== 0){          // 减速
                                            if (Math.abs(obj.speedX) !== obj.speed/2){
                                                obj.speedX = obj.speedX / 2;
                                            }
                                        }else{
                                            if (Math.abs(obj.speedY) !== obj.speed/2){
                                                obj.speedY = obj.speedY / 2;
                                            }
                                        }
                                    }else{
                                        if (obj.speedX !== 0 && obj.x % 5 === 0){          // 减速
                                            if (Math.abs(obj.speedX) !== obj.speed){
                                                obj.speedX = obj.speedX * 2;
                                            }
                                        }else if (obj.speedY !== 0 && obj.y % 5 === 0){
                                            if (Math.abs(obj.speedY) !== obj.speed){
                                                obj.speedY = obj.speedY * 2;
                                            }
                                        }
                                    }

                                    // 血条归0
                                    if (obj.tempblood <= 0){
                                        obj.tempblood = 0;
                                    }
                                }

                                break;
                            case "heartObj":
                                if ((obj.x > tempobj.y*100+50-10 && obj.x < tempobj.y*100+50+10 && obj.y > tempobj.x*100+50-tempobj.minr-10 && obj.y < tempobj.x*100+50-tempobj.minr+10) || 
                                    (obj.x > tempobj.y*100+50+Math.sin(45*Math.PI/180)*(tempobj.minr)-10 && obj.x < tempobj.y*100+50+Math.sin(45*Math.PI/180)*(tempobj.minr)+10 && obj.y > tempobj.x*100+50-Math.cos(45*Math.PI/180)*(tempobj.minr)-10 && obj.y < tempobj.x*100+50-Math.cos(45*Math.PI/180)*(tempobj.minr)+10) || 
                                    (obj.x > tempobj.y*100+50+Math.sin(90*Math.PI/180)*(tempobj.minr)-10 && obj.x < tempobj.y*100+50+Math.sin(90*Math.PI/180)*(tempobj.minr)+10 && obj.y > tempobj.x*100+50-Math.cos(90*Math.PI/180)*(tempobj.minr)-10 && obj.y < tempobj.x*100+50-Math.cos(90*Math.PI/180)*(tempobj.minr)+10) ||
                                    (obj.x > tempobj.y*100+50-Math.cos(135*Math.PI/180)*(tempobj.minr)-10 && obj.x < tempobj.y*100+50-Math.cos(135*Math.PI/180)*(tempobj.minr)+10 && obj.y > tempobj.x*100+50+Math.sin(135*Math.PI/180)*(tempobj.minr)-10 && obj.y < tempobj.x*100+50+Math.sin(135*Math.PI/180)*(tempobj.minr)+10) || 
                                    (obj.x > tempobj.y*100+50-10 && obj.x < tempobj.y*100+50+10 && obj.y > tempobj.x*100+50-Math.cos(180*Math.PI/180)*(tempobj.minr)-10 && obj.y < tempobj.x*100+50-Math.cos(180*Math.PI/180)*(tempobj.minr)+10) || 
                                    (obj.x > tempobj.y*100+50+Math.cos(225*Math.PI/180)*(tempobj.minr)-10 && obj.x < tempobj.y*100+50+Math.cos(225*Math.PI/180)*(tempobj.minr)+10 && obj.y > tempobj.x*100+50-Math.sin(225*Math.PI/180)*(tempobj.minr)-10 && obj.y < tempobj.x*100+50-Math.sin(225*Math.PI/180)*(tempobj.minr)+10) || 
                                    (obj.x > tempobj.y*100+50+Math.sin(270*Math.PI/180)*(tempobj.minr)-10 && obj.x < tempobj.y*100+50+Math.sin(270*Math.PI/180)*(tempobj.minr)+10 && obj.y > tempobj.x*100+50-10 && obj.y < tempobj.x*100+50+10) || 
                                    (obj.x > tempobj.y*100+50+Math.sin(315*Math.PI/180)*(tempobj.minr)-10 && obj.x < tempobj.y*100+50+Math.sin(315*Math.PI/180)*(tempobj.minr)+10 && obj.y > tempobj.x*100+50-Math.cos(315*Math.PI/180)*(tempobj.minr)-10 && obj.y < tempobj.x*100+50-Math.cos(315*Math.PI/180)*(tempobj.minr)+10))
                                {
                                    obj.tempblood -= tempobj.power;   // 伤血
                                }

                                // 血条归0
                                if (obj.tempblood <= 0){
                                    obj.tempblood = 0;
                                }

                                break;
                            case "fireObj":
                                for (deg = 0; deg < 360; deg++){
                                    pointx = tempobj.y*100+50+Math.sin(deg*Math.PI/180)*tempobj.minr;
                                    pointy = tempobj.x*100+50+Math.cos(deg*Math.PI/180)*tempobj.minr;

                                    if (obj.x > pointx && obj.x < pointx+5  && obj.y > pointy && obj.y < pointy+5){  // 打到
                                        obj.tempblood -= tempobj.power;
                                    }
                                    if (obj.tempblood <= 0){
                                        obj.tempblood = 0;
                                    }
                                }
                                break;
                            case "bgObj":
                                if (obj.y > tempobj.x*100+50-2 && obj.y < tempobj.x*100+50+2 && tempobj.direction === 0 && tempobj.bctime > 0 && tempobj.bctime < 0.02){
                                    // 碰到横向激光
                                    obj.tempblood -= tempobj.power;   // 伤血
                                }else if (obj.x > tempobj.y*100+50-2 && obj.x < tempobj.y*100+50+2 && tempobj.direction === 1 && tempobj.bctime > 0 && tempobj.bctime < 0.02){
                                    obj.tempblood -= tempobj.power;   // 伤血
                                }
                                if (obj.tempblood <= 0){
                                    obj.tempblood = 0;
                                }
                                break;
                        }
                    }


                    // 画血条
                    context.fillStyle = "red";
                    context.fillRect(obj.x - obj.r/2, obj.y - obj.r, obj.r*(obj.tempblood/obj.allblood), 5);
                    context.strokeStyle = "#333";
                    context.strokeRect(obj.x - obj.r/2, obj.y - obj.r, obj.r, 5);

                    // 如果血条为0，去掉这个怪物
                    if (obj.tempblood === 0){
                        allObj.splice(i, 1);
                        i--;
                    }

                    // 怪物已经通关，删除怪物并扣血
                    if (obj.x > 1100){
                        allObj.splice(i, 1);
                        i--;
                        var userblood = document.querySelector("#userblood");
                        if (userblood.children.length){
                            userblood.removeChild(userblood.children[0]);    // 扣血
                        }else{
                            //血扣完了
                            alert("Game Over! 你个菜B");
                            clearInterval(gameloop);
                        }
                        
                    }



                    // 如果这批怪杀完了，出下一批
                    if (allObj.length === 0 && circleNum < 10){
                        monsterNum = 0;
                        circleNum++;
                        addmonster = setInterval(AddMonster, 2000);
                    }

                    if (allObj.length === 0 && circleNum === 10){     // 赢了
                        alert("Yeeeeeeeeeeeeeeeeeee");
                    }
                    
                }
                ShowEmpty(context);
            }
            gameloop = setInterval(DrawScreen, 20);

        }
        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // 暂停、开始按钮
        var controlbutton = document.querySelector("#controlbutton");

        controlbutton.addEventListener("click", function(e){


            if (e.target.value === "STOP"){
                e.target.value = "BEGIN";
                e.target.style.background = "green";
                clearInterval(gameloop);
            }else{
                e.target.value = "STOP";
                e.target.style.background = "#336699";
                CanvasApp();
            }

        }, false);





////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // 加怪代码块
        var monsterNum = 0;
        var circleNum = 0;     // 一共10组怪物，最后一组是终极boss

        var monsterName = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var monsterSpeed = [0.5, 1];

        var addmonster = setInterval(AddMonster, 2000);

        function Monster(name, x, y, speed, speedX, speedY, r, allblood, tempblood){
            this.name = name;
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.speedX = speedX;
            this.speedY = speedY;
            this.r = r;
            this.allblood = allblood;
            this.tempblood = tempblood;
        }
        function AddMonster(){

            var name = monsterName[Math.floor(Math.random()*10)];  // 生成0到9的下标 
            var speed = monsterSpeed[Math.floor(Math.random()*2)];        // 速度0.5 到 1.5之间
            var speedX = speed;
            var speedY = 0;
            var r = Math.floor(Math.random()*20) + 40;  // 生成40到60间的身躯
            var allblood = Math.floor(Math.random()*450) + 50 + circleNum*20;    // 生成50到500的血量, 每一轮怪物都加20滴血
            var tempblood = allblood;

            if (circleNum === 10){
                monsterNum = 10;    // 用于clearInterval
                r = 80;
                allblood += 2000;   // 终极boss加2000的血
                tempblood = allblood;
            }else{
                
                monsterNum++;
            }

            allObj.push(new Monster(name, 0, 150, speed, speedX, speedY, r, allblood, tempblood));



            if (monsterNum === 10){       // 出100个怪
                clearInterval(addmonster);
            }
        }




///////////////////////////////////////////////////////////////////////////////////////////////////////////

        // 显示可以拆除塔的代码

        function RemoveT(removex, removey, context){

            context.save();
            context.drawImage(removeimg, removex*100+25, removey*100+25, 50, 50);
            context.restore();
        }       



////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        // 加塔代码块

        

        // 显示可以放置的区域
        function ShowEmpty(context){
            if (ifShowEmpty){
                for (var i = 0; i < empty.length; i++){

                    for (var j = 0; j < empty[0].length; j++){

                        if (empty[i][j] === 0){
                        // 空的地方显示加号
                            
                            context.save();
                            context.globalAlpha = 0.3;
                            context.fillStyle = "#f1f1f1";
                            context.fillRect(j*100+25, i*100+40, 50 ,10);
                            context.fillRect(j*100+45, i*100+20, 10 ,50);
                            context.restore();
                        }
                    }
                }
            } 
        }


        // 点击加塔事件
        ul.addEventListener("click", function(e){
            ifShowEmpty = true;
            tempT = e.target.name;   // 保存点击的塔的名字

        }, false);


        theCanvas.addEventListener("click", function(e){

            var tempx = e.clientX + "",
                tempy = e.clientY + "";

            // tempx 是从1开始，到11
            if (tempx.length === 3){
                tempx = parseInt(tempx[0]) - 1;
            }else{
                tempx = parseInt(tempx[0] + tempx[1]) - 1;
            }

            // tempy 是从0开始，到5
            if (tempy.length === 2){
                tempy = 0;
            }else{
                tempy = parseInt(tempy[0]);
            }
            
            if (ifShowEmpty){
                // 证明可以建塔
                if (empty[tempy][tempx] === 0){
                    // 根据tempT建塔, 修改empty
                    switch (tempT){
                        case "cold":
                            empty[tempy][tempx] = 2;
                            allT.push(new coldObj("coldObj", tempy, tempx, 0.5));      // 加入一个cold塔对象 
                            break;
                        case "heart":
                            empty[tempy][tempx] = 3;
                            allT.push(new heartObj("heartObj", tempy, tempx, 10));      // 加入一个heart塔对象
                            break;
                        case "fire":
                            empty[tempy][tempx] = 4;
                            allT.push(new fireObj("fireObj", tempy, tempx, 2));      // 加入一个fire塔对象
                            break;
                        case "bg":
                            empty[tempy][tempx] = 5;
                            allT.push(new bgObj("bgObj", tempy, tempx, 5));      // 加入一个bg塔对象
                            break;
                        case "fish":
                            empty[tempy][tempx] = 6;
                            allT.push(new fishObj("fishObj", tempy, tempx, 10));      // 加入一个fish塔对象
                            break;
                    }
                }
                ifShowEmpty = false;
            }
            else if (empty[tempy][tempx] !== 0 && empty[tempy][tempx] !== 1){ // 显示可以拆除塔标志

                if (showRemoveSign && tempx === removeX && tempy === removeY){ // 证明又点了一次拆除标记
                    empty[tempy][tempx] = 0;        // 返回草地状态

                    for (var h = 0; h < allT.length; h++){
                        if (allT[h].x === tempy && allT[h].y === tempx){
                            allT.splice(h, 1);        // 从塔对象中删除这个塔
                            break;
                        }
                    }

                    showRemoveSign = false;
                }else{
                    showRemoveSign = true;      // 传递给drawScreen表示显示拆除标志
                    removeX = tempx;
                    removeY = tempy;
                }
                
            }else{
                showRemoveSign = false;
            }

        }, false);






///////////////////////////////////////////////////////////////////////////////////////////////////////////


        // 5种塔的攻击效果

        function ShowAttack(context){

            for (var i = 0; i < allT.length; i++){

                var tempobj = allT[i];

                if (tempobj.mintime < tempobj.maxtime){

                    tempobj.mintime++;

                }else{

                    if (tempobj instanceof coldObj){     // 是不是cold塔对象
                    
                        if (tempobj.minr < tempobj.maxr){
                            // 显示攻击圆圈
                            context.save();
                            context.globalAlpha = 0.5;
                            context.strokeStyle = "#336699";
                            context.lineWidth=10;
                            context.beginPath();
                            context.arc(tempobj.y*100+50, tempobj.x*100+50, tempobj.minr, 0, 2*Math.PI, false);
                            context.closePath();
                            context.stroke();
                            context.restore();

                            tempobj.minr++;
                        }else{
                            // 已经最大了， 攻击半径，冷却时间归0
                            tempobj.minr = 50;
                            tempobj.mintime = 0;
                        }
                    }
                    else if (tempobj instanceof fireObj){         // 是不是fire塔对象

                        if (tempobj.minr < tempobj.maxr){
                            // 显示攻击圆圈
                            context.save();
                            context.globalAlpha = 0.5;
                            context.strokeStyle = "#ce0000";
                            context.lineWidth = 10;
                            context.beginPath();
                            context.arc(tempobj.y*100+50, tempobj.x*100+50, tempobj.minr, 0, 2*Math.PI, false);
                            context.closePath();
                            context.stroke();
                            context.restore();

                            tempobj.minr++;
                        }else{
                            // 已经最大了， 攻击半径，冷却时间归0
                            tempobj.minr = 50;
                            tempobj.mintime = 0;
                        }
                    }
                    else if (tempobj instanceof bgObj){      // 是不是bg塔对象

                        if (tempobj.direction === 0 && tempobj.bctime < tempobj.ectime){  // 横向攻击

                            context.save();
                            context.globalAlpha = 1 - tempobj.bctime;
                            context.fillStyle = "#e1e1e1";          // 形成一个2px宽的攻击柱
                            context.fillRect(0, tempobj.x*100+50-2, theCanvas.width, 4);
                            context.restore();

                            tempobj.bctime += 0.01;

                        }else if (tempobj.direction === 1 && tempobj.bctime < tempobj.ectime){   // 纵向攻击

                            context.save();
                            context.globalAlpha = 1 - tempobj.bctime;
                            context.fillStyle = "#e1e1e1";          // 形成一个2px宽的攻击柱
                            context.fillRect(tempobj.y*100+50-2, 0, 4, theCanvas.height);
                            context.restore();

                            tempobj.bctime += 0.01;

                        }else{
                            tempobj.bctime = 0;
                            tempobj.direction = tempobj.direction === 0 ? 1 : 0;
                        }
                    }

                    else if (tempobj instanceof heartObj){      // 是不是heart对象

                        if (tempobj.minr < theCanvas.width){
                            // 第一颗❤
                            context.save();
                            context.drawImage(littleheart, tempobj.y*100+50-10, tempobj.x*100+50-tempobj.minr-10, 20, 20);
                            context.restore();

                            // 第二颗❤
                            context.save();
                            var angle = 45*Math.PI/180;
                            context.translate(tempobj.y*100+50+Math.sin(angle)*(tempobj.minr), tempobj.x*100+50-Math.cos(angle)*(tempobj.minr));
                            context.rotate(angle);
                            context.drawImage(littleheart, -10, -10, 20, 20);
                            context.restore();

                            // 第三颗❤
                            context.save();
                            angle = 90*Math.PI/180;
                            context.translate(tempobj.y*100+50+Math.sin(angle)*(tempobj.minr), tempobj.x*100+50-Math.cos(angle)*(tempobj.minr));
                            context.rotate(angle);
                            context.drawImage(littleheart, -10, -10, 20, 20);
                            context.restore();

                            // 第四颗❤
                            context.save();
                            angle = 135*Math.PI/180;
                            context.translate(tempobj.y*100+50-Math.cos(angle)*(tempobj.minr), tempobj.x*100+50+Math.sin(angle)*(tempobj.minr));
                            context.rotate(angle);
                            context.drawImage(littleheart, -10, -10, 20, 20);
                            context.restore();

                            // 第五颗❤
                            context.save();
                            angle = 180*Math.PI/180;
                            context.translate(tempobj.y*100+50, tempobj.x*100+50-Math.cos(angle)*(tempobj.minr));
                            context.rotate(angle);
                            context.drawImage(littleheart, -10, -10, 20, 20);
                            context.restore();

                            // 第六颗❤
                            context.save();
                            angle = 225*Math.PI/180;
                            context.translate(tempobj.y*100+50+Math.cos(angle)*(tempobj.minr), tempobj.x*100+50-Math.sin(angle)*(tempobj.minr));
                            context.rotate(angle);
                            context.drawImage(littleheart, -10, -10, 20, 20);
                            context.restore();

                            // 第七颗❤
                            context.save();
                            angle = 270*Math.PI/180;
                            context.translate(tempobj.y*100+50+Math.sin(angle)*(tempobj.minr), tempobj.x*100+50);
                            context.rotate(angle);
                            context.drawImage(littleheart, -10, -10, 20, 20);
                            context.restore();

                            // 第八颗❤
                            context.save();
                            angle = 315*Math.PI/180;
                            context.translate(tempobj.y*100+50+Math.sin(angle)*(tempobj.minr), tempobj.x*100+50-Math.cos(angle)*(tempobj.minr));
                            context.rotate(angle);
                            context.drawImage(littleheart, -10, -10, 20, 20);
                            context.restore();


                            tempobj.minr += 5;
                        }else{

                            tempobj.minr = 50;
                            tempobj.mintime = 0;
                        }

                    }
                    else if (tempobj instanceof fishObj){
                        if (tempobj.isattack === false){
                            // 没有击打
                            for (var k = 0; k < allObj.length; k++){
                                // 遍历所有怪物，找到攻击范围内最近的，保存为攻击对象
                                if (allObj[k].x > tempobj.y*100+50-150 && allObj[k].x < tempobj.y*100+50+150 && allObj[k].y > tempobj.x*100+50-150 && allObj[k].y < tempobj.x*100+50+150){
                                    tempobj.isattack = true;
                                    tempobj.attackobj = allObj[k];
                                    break;
                                }
                            }

                        }else{

                            // 在范围内
                            if (tempobj.attackobj.x > tempobj.y*100+50-150 && tempobj.attackobj.x < tempobj.y*100+50+150 && tempobj.attackobj.y > tempobj.x*100+50-150 && tempobj.attackobj.y < tempobj.x*100+50+150){


                                // 加入炮弹对象进列表
                                var ball = {x : tempobj.y*100+50, y : tempobj.x*100+50};
                                if (tempobj.gjtime < tempobj.nctime){
                                    tempobj.gjtime++;
                                }else{
                                    tempobj.balls.push(ball);
                                    tempobj.gjtime = 0;
                                }
                                
                                for (var p = 0; p < tempobj.balls.length; p++){

                                    var nowx = tempobj.balls[p].x - tempobj.attackobj.x;
                                    var nowy = tempobj.balls[p].y - tempobj.attackobj.y;
                                    var nowangle = 0;
                                    if(nowx >= 0 && nowy >= 0){
                                        // 第四象限, 即球的x, y坐标都大于攻击目标的
                                        nowangle = Math.atan(nowy/nowx)*180/Math.PI + 180;
                                    }else if (nowx >= 0 && nowy <= 0){
                                        // 第三象限， 即球的x>攻击目标x, y < 攻击目标y
                                        nowangle = Math.atan(Math.abs(nowx/nowy))*180/Math.PI + 90;
                                    }else if (nowx <= 0 && nowy <= 0){
                                        // 第二象限， 球x<攻击目标x, y < 攻击目标y
                                        nowangle = Math.atan(nowy/nowx)*180/Math.PI;
                                    }else{
                                        // 第一象限， 球x<攻击目标x, y > 攻击目标y
                                        nowangle = Math.atan(Math.abs(nowx/nowy))*180/Math.PI + 270;
                                    }
                                    

                                    
                                    context.save();
                                    context.globalAlpha = 0.5;
                                    context.fillStyle = "blue";
                                    context.beginPath();
                                    context.arc(tempobj.balls[p].x, tempobj.balls[p].y, 20, 0, 2*Math.PI, false);
                                    context.closePath();
                                    context.fill();
                                    context.restore();

                                    tempobj.balls[p].x += 3*Math.cos(nowangle*Math.PI/180);
                                    tempobj.balls[p].y += 3*Math.sin(nowangle*Math.PI/180);

                                    // 无限接近就去掉这个小球
                                    if (Math.abs(nowx) < 5 && Math.abs(nowy) < 5){
                                        tempobj.attackobj.tempblood -= tempobj.power;
                                        if (tempobj.attackobj.tempblood <= 0){
                                            tempobj.attackobj.tempblood = 0;    // 怪物死了，要重新确定
                                            tempobj.isattack = false;
                                            tempobj.attackobj = null;
                                            tempobj.balls = [];    // 清空炮弹
                                        }
                                        tempobj.balls.splice(p, 1);
                                        p--;
                                    }
                                }


                            } else{
                                // 不在范围内
                                tempobj.isattack = false;
                                tempobj.attackobj = null;
                                tempobj.balls = [];    // 清空炮弹
                            }
                        }
                    }

                }
            }
        }



////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 判断如何转向
        function NextDirection(obj){

            // 根据x,y判断转向
            if (obj.x === 150){

                if (obj.y === 150){  // 第一次转向，向下
                    obj.speedX = 0;
                    obj.speedY = obj.speed;
                }else if (obj.y === 550){ // 第二次转向，向右
                    obj.speedX = obj.speed;
                    obj.speedY = 0;
                }

            }else if(obj.x === 550){

                if (obj.y === 550){  // 第三次转向，向上
                    obj.speedX = 0;
                    obj.speedY = -obj.speed;
                }else if (obj.y === 350){ // 第四次转向，向左
                    obj.speedX = -obj.speed;
                    obj.speedY = 0;
                }

            }else if(obj.x === 450){

                if (obj.y === 350){  // 第五次转向，向上
                    obj.speedX = 0;
                    obj.speedY = -obj.speed;
                }else if (obj.y === 50){ // 第六次转向，向右
                    obj.speedX = obj.speed;
                    obj.speedY = 0;
                }

            }else if(obj.x === 750){

                if (obj.y === 50){  // 第七次转向，向下
                    obj.speedX = 0;
                    obj.speedY = obj.speed;
                }else if (obj.y === 450){ // 第八次转向，向右
                    obj.speedX = obj.speed;
                    obj.speedY = 0;
                }

            }else if(obj.x === 950){

                if (obj.y === 450){  // 第九次转向，向上
                    obj.speedX = 0;
                    obj.speedY = -obj.speed;
                }else if (obj.y === 250){ // 第十次转向，向右
                    obj.speedX = obj.speed;
                    obj.speedY = 0;
                }

            }

        }




        // 绘制地图
        function DrawBackground(context){

            context.fillStyle = "#f1f1f1";
            context.fillRect(0, 0, theCanvas.width, theCanvas.height);
            context.strokeStyle = "#336699";
            context.strokeRect(0, 0, theCanvas.width, theCanvas.height);

            // 根据empty数值绘制地图
            for (var i = 0; i < empty.length; i++){
                    for (var j = 0; j < empty[0].length; j++){

                        if (empty[i][j] === 0){
                        // 空的地方显示绿地
                            context.save();
                            context.fillStyle = "#467500";
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.restore();
                        }else if (empty[i][j] === 1){
                            // 显示土地
                            context.save();
                            context.fillStyle = "#844200";
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.restore();
                        }else if (empty[i][j] === 2){
                            // 显示cold
                            context.save();
                            context.fillStyle = "#467500";
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.drawImage(cold, j*100, i*100, 100 ,100);
                            context.restore();
                        }else if (empty[i][j] === 3){
                            // 显示cold
                            context.save();
                            context.fillStyle = "#467500";
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.drawImage(heart, j*100, i*100, 100 ,100);
                            context.restore();
                        }else if (empty[i][j] === 4){
                            // 显示cold
                            context.save();
                            context.fillStyle = "#467500";
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.drawImage(fire, j*100, i*100, 100 ,100);
                            context.restore();
                        }else if (empty[i][j] === 5){
                            // 显示cold
                            context.save();
                            context.fillStyle = "#467500";
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.drawImage(bg, j*100, i*100, 100 ,100);
                            context.restore();
                        }else if (empty[i][j] === 6){
                            // 显示cold
                            context.save();
                            context.fillStyle = "#467500";
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.fillRect(j*100, i*100, 100 ,100);
                            context.drawImage(fish, j*100, i*100, 100 ,100);
                            context.restore();
                        }
                    }
            }
            
        }

    })();