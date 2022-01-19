// Audio
// ==========================================
var soundClick = new Howl({
    src: ['audio/button_click.mp3'],
    volume: 0.2
});
var soundSlot = new Howl({
    src: ['audio/rolling.mp3'],
    loop: true,
    volume: 1
});
var soundSlotEnd = new Howl({
    src: ['audio/cash.mp3'],
    volume: .5
});

var soundWin1 = new Howl({
    src: ['audio/win1.mp3'],
    volume: 1
});

var soundWin2 = new Howl({
    src: ['audio/win2.mp3'],
    volume: .6
});


//================================
var slotData = Array.from(dataName);

// ====================
// 單人 slot
// ====================
var $slotResult = $('#slotResult'),
    $endText = $('#endText'),
    random_index,
    listLength = 100;


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

        list.push('<li class="item" index=' + _.random(slotData.length - 1) + '><div class="name">' + slotData[index].name + '</div><div class="dept">' + slotData[index].dept + '</div></li>');
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
    time: 400,
    loops: 1,
    easing : 'easeOutCirc', 
    endNum: 2, // * spins backwards through the list. endNum 1 ends on the same value we started on
    onStart : function(){
        
        $('.single .empty').hide();
        $('#btnSingleGo').hide();
        soundSlot.play();
    },
    onEnd: function (finalElement) {

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
        
        $slotResult.html('<div class="name">' + slotData[random_index].name + '</div><div class="dept">' + slotData[random_index].dept + '</div>');
        
        // * hide spinner
        $(this.spinner).hide();
    
        $('#endText').addClass('animate__animated animate__infinite animate__pulse');
        $('#endText').click(function () { 
            soundWin2.fade(.6, 0, 1000);
            soundClick.play();
            $('#endText').removeClass('animate__animated animate__infinite animate__pulse');
            $('#btnSingleGo').show();
            $slotResult.html('<div class="empty"></div>');
            
        });

        // * delete selected object from array
        slotData.splice(random_index, 1);
    }
});

$('#btnSingleGo').on('click', function(e){
    e.preventDefault();
    soundClick.play();

    // * before spinning, build out list to spin through and insert into the DOM
    // * start with current value
    var resultList = ['<li class="item">' + $slotResult.html() + '</li>'];

    // * call recursive list builder that won't spin slots until it's finished
    makeSlotList(resultList);
});

// ====================
// 多人 slot
// ====================
var $slotResult_multi_1 = $('#slotResult_multi_1'),
    $slotResult_multi_2 = $('#slotResult_multi_2'),
    $slotResult_multi_3 = $('#slotResult_multi_3'),
    $slotResult_multi_4 = $('#slotResult_multi_4'),
    $slotResult_multi_5 = $('#slotResult_multi_5'),
    $endTextMulti = $('#endTextMulti'),
    random_index_m1,
    random_index_m2,
    random_index_m3,
    random_index_m4,
    random_index_m5,
    listLength_multi = 35,
    multiSlot_opt_time = 1000,
    multiSlot_opt_loops = 1,
    multiSlot_opt_easing = 'easeOutCirc';



function multiAppendItem (){
    for (i = 0; i < listLength_multi; i++) {
        $('#slot_multi_1,#slot_multi_2,#slot_multi_3,#slot_multi_4,#slot_multi_5').append('<li class="item">');
    }
}
multiAppendItem();

// 分組
function group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}
var groupedData = [];

// 產生data list
function makeSlotList_m1(list) {
    if (list.length < listLength_multi) {
        var index = _.random(groupedData[0].length - 1);
        if (list.length === 1) {
            random_index_m1 = index;
        }
        list.push('<li class="item" index=' + _.random(groupedData[0].length - 1) + '><div class="name">' + groupedData[0][index].name + '</div><div class="dept">' + groupedData[0][index].dept + '</div></li>');
        return makeSlotList_m1(list);
    } else {
        $slotResult_multi_1.html('');
        $('#slot_multi_1').html(list.join('')).parent().show().trigger('spin_multi_1');
        return list;
    }
}

function makeSlotList_m2(list) {
    if (list.length < listLength_multi) {
        var index = _.random(groupedData[1].length - 1);
        if (list.length === 1) {
            random_index_m2 = index;
        }
        list.push('<li class="item" index=' + _.random(groupedData[1].length - 1) + '><div class="name">' + groupedData[1][index].name + '</div><div class="dept">' + groupedData[1][index].dept + '</div></li>');
        return makeSlotList_m2(list);
        
    } else {
        $slotResult_multi_2.html('');
        $('#slot_multi_2').html(list.join('')).parent().show().trigger('spin_multi_2');
        return list;
    }
}

function makeSlotList_m3(list) {
    if (list.length < listLength_multi) {
        var index = _.random(groupedData[2].length - 1);
        if (list.length === 1) {
            random_index_m3 = index;
        }
        list.push('<li class="item" index=' + _.random(groupedData[2].length - 1) + '><div class="name">' + groupedData[2][index].name + '</div><div class="dept">' + groupedData[2][index].dept + '</div></li>');
        return makeSlotList_m3(list);
        
    } else {
        $slotResult_multi_3.html('');
        $('#slot_multi_3').html(list.join('')).parent().show().trigger('spin_multi_3');
        return list;
    }
}

function makeSlotList_m4(list) {
    if (list.length < listLength_multi) {
        var index = _.random(groupedData[3].length - 1);
        if (list.length === 1) {
            random_index_m4 = index;
        }
        list.push('<li class="item" index=' + _.random(groupedData[3].length - 1) + '><div class="name">' + groupedData[3][index].name + '</div><div class="dept">' + groupedData[3][index].dept + '</div></li>');
        return makeSlotList_m4(list);
        
    } else {
        $slotResult_multi_4.html('');
        $('#slot_multi_4').html(list.join('')).parent().show().trigger('spin_multi_4');
        return list;
    }
}

function makeSlotList_m5(list) {
    if (list.length < listLength_multi) {
        var index = _.random(groupedData[4].length - 1);
        if (list.length === 1) {
            random_index_m5 = index;
        }
        list.push('<li class="item" index=' + _.random(groupedData[4].length - 1) + '><div class="name">' + groupedData[4][index].name + '</div><div class="dept">' + groupedData[4][index].dept + '</div></li>');
        return makeSlotList_m5(list);
        
    } else {
        $slotResult_multi_5.html('');
        $('#slot_multi_5').html(list.join('')).parent().show().trigger('spin_multi_5');
        return list;
    }
}

// 從slotData 裡刪除五組結果
function delSlotDataSame(idx){
    var slotDataSameIndex = slotData.findIndex(function(item){
        return item.id == idx;
    });
    slotData.splice(slotDataSameIndex, 1);
}

// =========
// jSlots 1
// =========

$('#slot_multi_1').jSlots({
    number: 1,
    spinner: '.multi-1 .jSlots-wrapper',
    spinEvent: 'spin_multi_1',
    time: multiSlot_opt_time,
    loops: multiSlot_opt_loops,
    easing : multiSlot_opt_easing, 
    endNum: 2, 
    onStart : function(){
        $('.multi .empty').hide();
        $('#btnMultiGo').hide();
        soundSlot.play();
    },
    onEnd: function (finalElement) {
        // * hide spinner
        $(this.spinner).hide();
        
        // * set result
        $slotResult_multi_1.html('<div class="name">' + groupedData[0][random_index_m1].name + '</div><div class="dept">' + groupedData[0][random_index_m1].dept + '</div>');
        
        // * delete selected object from array
        groupedData[0].splice(random_index_m1, 1);
        // * 從slotData 裡刪除五組結果
        var sameIndex = groupedData[0][random_index_m1].id;
        delSlotDataSame(sameIndex);
    }
});

// =========
// jSlots 2
// =========
$('#slot_multi_2').jSlots({
    number: 1,
    spinner: '.multi-2 .jSlots-wrapper',
    spinEvent: 'spin_multi_2',
    time: multiSlot_opt_time,
    loops: multiSlot_opt_loops,
    easing : multiSlot_opt_easing,  
    endNum: 2, 
    onStart : function(){
        $('.multi .empty').hide();
        $('#btnMultiGo').hide();
    },
    onEnd: function (finalElement) {

        // * hide spinner
        $(this.spinner).hide();
        
        // * set result
        $slotResult_multi_2.html('<div class="name">' + groupedData[1][random_index_m2].name + '</div><div class="dept">' + groupedData[1][random_index_m2].dept + '</div>');

        // * delete selected object from array
        groupedData[1].splice(random_index_m2, 1);

        // * 從slotData 裡刪除五組結果
        var sameIndex = groupedData[1][random_index_m1].id;
        delSlotDataSame(sameIndex);
        //slotData.splice(random_index_m2, 1);

    }
});

// =========
// jSlots 3
// =========
$('#slot_multi_3').jSlots({
    number: 1,
    spinner: '.multi-3 .jSlots-wrapper',
    spinEvent: 'spin_multi_3',
    time: multiSlot_opt_time,
    loops: multiSlot_opt_loops,
    easing : multiSlot_opt_easing,  
    endNum: 2, 
    onStart : function(){
        $('.multi .empty').hide();
        $('#btnMultiGo').hide();
    },
    onEnd: function (finalElement) {

        // * hide spinner
        $(this.spinner).hide();
        
        // * set result
        $slotResult_multi_3.html('<div class="name">' + groupedData[2][random_index_m3].name + '</div><div class="dept">' + groupedData[2][random_index_m3].dept + '</div>');
 
        // * delete selected object from array
        groupedData[2].splice(random_index_m3, 1);

        // * 從slotData 裡刪除五組結果
        var sameIndex = groupedData[2][random_index_m1].id;
        delSlotDataSame(sameIndex);
        //slotData.splice(random_index_m3, 1);
    }
});

// =========
// jSlots 4
// =========
$('#slot_multi_4').jSlots({
    number: 1,
    spinner: '.multi-4 .jSlots-wrapper',
    spinEvent: 'spin_multi_4',
    time: multiSlot_opt_time,
    loops: multiSlot_opt_loops,
    easing : multiSlot_opt_easing, 
    endNum: 2, 
    onStart : function(){
        $('.multi .empty').hide();
        $('#btnMultiGo').hide();
    },
    onEnd: function (finalElement) {

        // * hide spinner
        $(this.spinner).hide();
        
        // * set result
        $slotResult_multi_4.html('<div class="name">' + groupedData[3][random_index_m4].name + '</div><div class="dept">' + groupedData[3][random_index_m4].dept + '</div>');

        // * delete selected object from array
        groupedData[3].splice(random_index_m4, 1);

        // * 從slotData 裡刪除五組結果
        var sameIndex = groupedData[3][random_index_m1].id;
        delSlotDataSame(sameIndex);
        //slotData.splice(random_index_m4, 1);
    }
});

// =========
// jSlots 5
// =========
$('#slot_multi_5').jSlots({
    number: 1,
    spinner: '.multi-5 .jSlots-wrapper',
    spinEvent: 'spin_multi_5',
    time: multiSlot_opt_time,
    loops: multiSlot_opt_loops,
    easing : multiSlot_opt_easing,  
    endNum: 2, 
    onStart : function(){
        $('.multi .empty').hide();
        $('#btnMultiGo').hide();
    },
    onEnd: function (finalElement) {

        soundSlot.stop();
        soundSlotEnd.play();
        
        setTimeout(function() {
            soundWin1.play();
        }, 300);

        setTimeout(function() {
            soundWin2.play();
            soundWin2.fade(0, .6, 0);
        }, 600);

        // * hide spinner
        $(this.spinner).hide();
        
        // * set result
        $slotResult_multi_5.html('<div class="name">' + groupedData[4][random_index_m5].name + '</div><div class="dept">' + groupedData[4][random_index_m5].dept + '</div>');

        // * delete selected object from array
        groupedData[4].splice(random_index_m5, 1);

        // * 從slotData 裡刪除五組結果
        var sameIndex = groupedData[4][random_index_m1].id;
        delSlotDataSame(sameIndex);
        //slotData.splice(random_index_m5, 1);

        // show endtext and button
        $endTextMulti.addClass('animate__animated animate__infinite animate__pulse');
        $endTextMulti.click(function () { 
            soundWin2.fade(.6, 0, 1000);
            soundClick.play();
            $endTextMulti.removeClass('animate__animated animate__infinite animate__pulse');
            $('.multi .slot-result').html('<div class="empty"></div>');
            $('#btnMultiGo').show();
        });
    }
});

$('#btnMultiGo').on('click', function(e){
    e.preventDefault();
    groupedData = group(slotData, listLength_multi - 10);

    soundClick.play();

    // * before spinning, build out list to spin through and insert into the DOM
    // * start with current value
    var resultList_1 = ['<li class="item">' + $slotResult_multi_1.html() + '</li>'];
    var resultList_2 = ['<li class="item">' + $slotResult_multi_2.html() + '</li>'];
    var resultList_3 = ['<li class="item">' + $slotResult_multi_3.html() + '</li>'];
    var resultList_4 = ['<li class="item">' + $slotResult_multi_4.html() + '</li>'];
    var resultList_5 = ['<li class="item">' + $slotResult_multi_5.html() + '</li>'];
   
    // * call recursive list builder that won't spin slots until it's finished
    makeSlotList_m1(resultList_1);
    makeSlotList_m2(resultList_2);
    makeSlotList_m3(resultList_3);
    makeSlotList_m4(resultList_4);
    makeSlotList_m5(resultList_5);
    // setTimeout(() => makeSlotList_m2(resultList_2), 150);
    // setTimeout(() => makeSlotList_m3(resultList_3), 300);
    // setTimeout(() => makeSlotList_m4(resultList_4), 450);
    // setTimeout(() => makeSlotList_m5(resultList_5), 600);
});

// =======================
// 控制按鈕
// =======================
$('#btnReset').click(function (e) {
    e.preventDefault();
    soundClick.play();
    slotData = [];
    slotData = Array.from(dataName);
    $('.slot').html('');
    $('.slot-result').html('<div class="empty"></div>');
    $('.endtext').removeClass('animate__animated animate__infinite animate__pulse');
    $('.btn-go').show();
    singleAppendItem();
    multiAppendItem();
    alert('抽獎資料已重置')
});

$('#btnFullScreen').click(function (e) {
    e.preventDefault();
    soundClick.play();
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
});

$('#btnSingleShow').click(function (e) {
    e.preventDefault();
    $('#arenaSingle').addClass('is-show');
    $('#arenaMulti').removeClass('is-show');
    $(this).addClass('active');
    $('#btnMultiShow').removeClass('active');
    $('.section').removeClass('is-multi');
    $endTextMulti.removeClass('animate__animated animate__infinite animate__pulse');
    $('.multi .slot-result').html('<div class="empty"></div>');
    $('#btnMultiGo').show();
    soundClick.play();
});

$('#btnMultiShow').click(function (e) {
    e.preventDefault();
    $('#arenaSingle').removeClass('is-show');
    $('#arenaMulti').addClass('is-show');
    $(this).addClass('active');
    $('#btnSingleShow').removeClass('active');
    $('.section').addClass('is-multi');
    $('#endText').removeClass('animate__animated animate__infinite animate__pulse');
    $('#btnSingleGo').show();
    $slotResult.html('<div class="empty"></div>');
    soundClick.play();
});