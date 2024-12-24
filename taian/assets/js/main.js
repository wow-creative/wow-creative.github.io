document.addEventListener("DOMContentLoaded", (event) => {
   $('.loading').fadeOut(300);
});

//===============
// arena responsive size (需配合css)
//===============
// 更新 CSS 變量
function updateVwVariable() {
    document.documentElement.style.setProperty('--vw', window.innerWidth / 100);
    document.documentElement.style.setProperty('--vh', window.innerHeight / 100);
}

// 初始化和監聽視窗大小變化
window.addEventListener('resize', updateVwVariable);
updateVwVariable();

//===============
// Fireworks
//===============
const fwContainer = document.querySelector('#fireworks');
const fw = new Fireworks.default(fwContainer,{
    autoresize   :true,
    lineStyle    :'round',
    flickering   :50,
    trace        :3,
    traceSpeed   :25,
    intensity    :6,
    explosion    :5,
    gravity      :1.5,
    opacity      :0.5,
    particles    :50,
    friction     :0.95,
    acceleration :1,
    rocketsPoint: {
        min: 70,//20
        max: 100 //100
    },
    lineWidth: {
        explosion: {
            min: 0,
            max: 2
        },
        trace: {
            min: 0,
            max: 2
        }
    },
    decay: {
        min: 0.015,
        max: 0.03
    },
    delay: {
        min: 10,
        max: 50
    },
    brightness : {
        min: 50,
        max: 80
    },
    sound:{
        enabled: true,
        files: [
            'assets/audio/explosion0.mp3',
            'assets/audio/explosion1.mp3',
            'assets/audio/explosion2.mp3',
        ],
        volume: {
            min: 0,
            max: 50
        }
    }
});
function fireworksGo(){
    fw.start();
    setTimeout(() => {
        fw.stop();
    }, 8000);
}

// Audio
// ==========================================
var soundClick = new Howl({
    src: ['assets/audio/button_click.mp3'],
    volume: .1
});
var soundSlot = new Howl({
    src: ['assets/audio/rolling.mp3'],
    loop: true,
    volume: .5
});
var soundSlotEnd = new Howl({
    src: ['assets/audio/cash.mp3'],
    volume: .5
});

var soundWin1 = new Howl({
    src: ['assets/audio/win1.mp3'],
    volume: 1
});

var soundWin2 = new Howl({
    src: ['assets/audio/win2.mp3'],
    volume: .6
});


//================================
// var slotData = Array.from(dataName);

// 排除號碼
const exNum = [1, 2, 4, 10, 13, 14, 24, 34, 40, 44];
// 生成總抽獎數組
const fullArray = Array.from({ length: 109 }, (_, index) => index + 1);
// 過濾exNum的數字
//const filteredArray = fullArray.filter(num => !exNum.includes(num));
// 將數字轉為三位數
//const slotData = filteredArray.map(num => num.toString().padStart(3, '0'));
const slotData = fullArray.filter(num => !exNum.includes(num));

// ====================
// 單人 slot
// ====================
var $slotResult = $('#slotResult'),
    random_index,
    listLength = 80;


function singleAppendItem() {
    for (i = 0; i < listLength; i++) {
        $('#slot_single').append('<li class="item">');
    }
}
singleAppendItem();

function makeSlotList(list) {
    if (list.length < listLength) {
        var index = _.random(slotData.length - 1);
        if (list.length === 1) {
            /*
                This index will be second item in the list, which is our winning number
                Save this for future reference
                Instead of saving it, we could get the index attribute from the list item we end on
            */
            random_index = index;
        }

        //list.push('<li class="item" index=' + _.random(slotData.length - 1) + '><div class="name">' + slotData[index].name + '</div><div class="dept">' + slotData[index].dept + '</div></li>');
        list.push('<li class="item" index=' + _.random(slotData.length - 1) + '>' + slotData[index] + '</li>');
        return makeSlotList(list);
        
    } else {
        // * slot list is complete
        // * clear search field
        $slotResult.html('');
        // * attach list, show jslots, run animation
        $('#slot_single').html(list.join('')).parent().show().trigger('spin');
        return list;
    }
    
}

$('#slot_single').jSlots({
    number: 1,
    spinner: '.jSlots-wrapper',
    spinEvent: 'spin',
    time: 200,
    loops: 1,
    easing : 'easeOutCirc', 
    endNum: 2, // * spins backwards through the list. endNum 1 ends on the same value we started on
    onStart : function(){
        $('.single .empty').hide();
        soundSlot.play();
        $('.ctrls').hide();
    },
    onEnd: function (finalElement) {
        
        $('.ctrls').show();

        soundSlot.stop();
        soundSlotEnd.play();
        
        setTimeout(function() {
            soundWin1.play();
        }, 300);

        setTimeout(function() {
            soundWin2.play();
            soundWin2.fade(0, .6, 0);
        }, 600);
        
        

        // * set result
        //$slotResult.html('<div class="name">' + slotData[random_index].name + '</div><div class="dept">' + slotData[random_index].dept + '</div>');
        $slotResult.html( slotData[random_index]);

        // * hide spinner
        $(this.spinner).hide();

        $('#endText').addClass('animate__animated animate__pulse animate__repeat-3');
        fireworksGo();
        
        // $('#endText.animate__animated').click(function () { 
        //     soundWin2.fade(.6, 0, 1000);
        //     soundClick.play();
        //     $('#endText').removeClass('animate__animated animate__infinite animate__pulse');
        //     $slotResult.html('<div class="empty">?</div>');
        //     setTimeout(() => {
        //         $('#btnSingleGo').show().removeClass('disabled');
        //     }, 300);
        // });

        $('#replay').addClass('is-show');
        $('#replay').click(function () {
            soundWin2.fade(.6, 0, 1000);
            soundClick.play();
            $('#replay').removeClass('is-show');
            $('#endText').removeClass('animate__animated animate__pulse animate__repeat-3');
            $slotResult.html('<div class="empty">???</div>');
            setTimeout(() => {
                fw.stop();
                $('#btnSingleGo').show().removeClass('disabled');
            }, 300);
         });

        // * delete selected object from array
        slotData.splice(random_index, 1);
    }
});

$('#btnSingleGo').on('click', function(e){
    e.preventDefault();
    $(this).addClass('disabled').hide();
    fw.stop();
    soundClick.play();

    // * before spinning, build out list to spin through and insert into the DOM
    // * start with current value
    var resultList = ['<li class="item">' + $slotResult.html() + '</li>'];

    // * call recursive list builder that won't spin slots until it's finished
    makeSlotList(resultList);
});


// =======================
// 控制按鈕
// =======================
// $('#btnReset').click(function (e) {
//     e.preventDefault();
//     soundClick.play();
//     slotData.length = 0; // 清空slotdata array
//     slotData = Array.from(dataName);
//     $('.slot').html('');
//     $('.slot-result').html('<div class="empty"></div>');
//     $('.endtext').removeClass('animate__animated animate__infinite animate__pulse');
//     $('.btn-go').show();
//     singleAppendItem();
//     multiAppendItem();
//     alert('抽獎資料已重置')
// });

$('#btnFullScreen').click(function (e) {
    e.preventDefault();
    //soundClick.play();
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        $(this).addClass('--shrink').removeClass('--expand');
    } else {
        $(this).addClass('--expand').removeClass('--shrink');
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// =========================
// stars effect
// =========================
const DENSITY = 1;
const MAX_SIZE = 1.5;
let TIME = 0;
const cvs = document.querySelector('.stars');

// Set display size (css pixels).
cvs.style.width = `${window.innerWidth}px`;
cvs.style.height = `${window.innerHeight}px`;

// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio || 1; // Change to 1 on retina screens to see blurry canvas.

cvs.width = window.innerWidth * scale;
cvs.height = window.innerHeight * scale;

// Normalize coordinate system to use css pixels.
cvs.getContext('2d').scale(scale, scale);


// Stars
class Star {
  constructor(x,y,r,canvas) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.r2 = this.r;
    this.cvs = canvas;
    this.ctx = this.cvs.getContext('2d');
    this.hue = Math.random()*360;
    this.shine = this.r > (MAX_SIZE*0.8) && Math.random() > .5;
    this.rand = Math.random()*1000;
  }
  
  draw() {
    const { ctx, x, y, r } = this;
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.r2*4);
    gradient.addColorStop(0, `hsla(${this.hue},100%,100%,0.25)`);
    gradient.addColorStop(1, `hsla(${this.hue},100%,100%,0)`);
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.r2*4, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
    
    if (this.shine) {
      ctx.save();
      ctx.beginPath();
      ctx.transform(1.2,0,0,.2,0,0);
      let gradient = ctx.createRadialGradient(x/1.2, y/.2, 0, x/1.2, y/.2, this.r2*4);
      gradient.addColorStop(0, `hsla(${this.hue},100%,100%,0.8)`);
      gradient.addColorStop(1, `hsla(${this.hue},100%,100%,0)`);
      ctx.fillStyle = gradient;
      ctx.arc(this.x/1.2, this.y/.2, this.r2*4, 0, Math.PI*2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      
      ctx.save();
      ctx.beginPath();
      ctx.transform(.2,0,0,1.2,0,0);
      gradient = ctx.createRadialGradient(x/.2, y/1.2, 0, x/.2, y/1.2, this.r2*4);
      gradient.addColorStop(0, `hsla(${this.hue},100%,100%,0.8)`);
      gradient.addColorStop(1, `hsla(${this.hue},100%,100%,0)`);
      ctx.fillStyle = gradient;
      ctx.arc(this.x/.2, this.y/1.2, this.r2*4, 0, Math.PI*2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(this.x, this.y, this.r2, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
  }
  
  twinkle() {
    this.r2 = this.r + (Math.random() * this.r / 4) - this.r / 8;
  }
  
  sparkle() {
    this.r2 = Math.sin(TIME/(5*Math.PI) + this.rand)*this.r + this.r;
  }
  
  update() {
    //this.twinkle();
    this.sparkle();
    this.draw();
  }
}

class Starfield {
  constructor(amount, canvas) {
    this.amount = amount;
    this.cvs = canvas;
    this.stars = [];
    
    for (let i = 0, len = this.amount; i < len; i++) {
      const elem = new Star(
        Math.random() * this.cvs.width,
        Math.random() * this.cvs.height,
        Math.random() * MAX_SIZE,
        this.cvs
      );
      
      elem.update();
      
      this.stars.push(elem);
    }
  }
  
  twinkle() {
    this.stars.forEach(item => item.update());
  }
}

let stars;

function resizeCanvas() {
    const w = window.innerWidth * scale,
        h = window.innerHeight * scale;
    cvs.width = w;
    cvs.height = h;
    cvs.style.width = `${window.innerWidth}px`;
    cvs.style.height = `${window.innerHeight}px`;
    stars = new Starfield(w*h/20000, cvs);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function animate() {
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0,0,cvs.width,cvs.height);
    stars.twinkle();
    const gradient = ctx.createLinearGradient(0, 0, 0, cvs.height);
    // gradient.addColorStop(0,'rgba(10,12,25,0)');
    // gradient.addColorStop(1,'rgba(10,12,25,0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,cvs.width,cvs.height);
    TIME ++;
    window.requestAnimationFrame(animate);
}
animate();