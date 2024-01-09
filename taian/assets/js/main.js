document.addEventListener("DOMContentLoaded", (event) => {
   $('.loading').fadeOut(300);
});

//===============
// Fireworks
//===============
const fwContainer = document.querySelector('#fireworks');
const fw = new Fireworks.default(fwContainer,{
    sound:{
        enabled: true,
        files: [
            'assets/audio/explosion0.mp3',
            'assets/audio/explosion1.mp3',
            'assets/audio/explosion2.mp3',
        ],
        volume: {
            min: 20,
            max: 50
        }
    },
    rocketsPoint: {
        min: 20,
        max: 100
    },
    lineWidth: {
        explosion: {
            min: 1,
            max: 5
        },
        trace: {
            min: 1,
            max: 2
        }
    },
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
const fullArray = Array.from({ length: 108 }, (_, index) => index + 1);
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
        
        fireworksGo();

        $('#endText').addClass('animate__animated animate__infinite animate__pulse');
        
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
            $('#endText').removeClass('animate__animated animate__infinite animate__pulse');
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
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
});

