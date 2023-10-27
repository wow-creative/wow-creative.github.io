var isBegin = false,
    _startText = 'Start. ',
    _rollingText = 'Rolling';

function testReturn(_b, _r) {
    $('#res').text('Test : Return result = ' + _r);
}

function numRand() {
    var numMax = 191; //上限
    var numMin = 101; //下限
    //
    var str = '' + (Math.floor(Math.random() * (numMax - numMin + 1)) + numMin); // 取亂數
    var pad = '000'; // n位數
    var rand = pad.substring(0, pad.length - str.length) + str; // 前面補零
    return rand;
}

function isRolling(_b) {
    if (!_b) {
        $('#btnStart').text(_startText).removeClass('desabled');
    } else {
        //$('#btnStart').text(_rollingText).addClass('desabled');
        $('#btnStart').text('').fadeOut(150);
    }
}

$(function() {
    var soundClick = new Howl({
        src: ['audio/button_click.mp3'],
        volume: 0.5
    });
    var soundRolling = new Howl({
        src: ['audio/rolling.mp3'],
        volume: 1
    });
    var soundCash = new Howl({
        src: ['audio/cash.mp3'],
        volume: .5
    });

    var soundWin1 = new Howl({
        src: ['audio/win1.mp3'],
        volume: 1
    });

    var soundWin2 = new Howl({
        src: ['audio/win2.mp3'],
        volume: 0
    });

    isRolling(isBegin);

    function restart() {

        $('#btnStart').hide();

        setTimeout(function() {
            soundWin1.play();
        }, 300);

        setTimeout(function() {
            soundWin2.play();
            soundWin2.fade(0, 1, 0);
        }, 600);

        setTimeout(function() {
            $('.celebrate').removeClass('show').addClass('infinite bounce')
        }, 550);

        $('.celebrate').show().addClass('show').one('click', function() {
            soundWin2.fade(1, 0, 500);
            soundClick.play();

            $('.num').animate({
                backgroundPositionY: 0
            }, {
                duration: 100,
                easing: 'easeInOutCirc'
            }); // 號碼歸位


            // 狀態恢復
            isBegin = false;
            isRolling(isBegin);
            now = 0;
            index = -1;
            $('.celebrate').hide();
            $('#btnStart').fadeIn(150).text(_startText + (now + 1));
        })
    }

    /* Slot
    =============================================================== */
    u = 265; // 每個數字圖片的高度
    _duration = 5000; // 轉動時間
    _easing = 'easeInOutCirc';
    result = 'undefined';
    max = 3;
    now = 0;
    index = -1;

    $('#btnStart').text(_startText + (now + 1));
    //testReturn(isBegin, result); // Test (可刪)
    $('#btnStart').click(function() {
        if (isBegin) return false;
        soundClick.play();

        now = now + 1;
        $('#btnStart').text(_startText + (now + 1));
        // Start Rolling
        if (now <= max) {
            index = index + 1;
            soundRolling.stop();
            soundRolling.play();
            if (now == 1) {
                $('.num').css('backgroundPositionY', 0); // 號碼歸位
                result = numRand(); // 取得亂數結果
                num_arr = (result + '').split(''); // 將號碼分割
                //testReturn(isBegin, result); // Test (可刪)
                console.log(result);
            }
            if (now == max) {
                isBegin = true;
                isRolling(isBegin);
                $('.num').eq(index).animate({
                    backgroundPositionY: (u * 45) + (u * num_arr[index])
                }, {
                    duration: _duration,
                    easing: _easing,
                    complete: function() {
                        soundRolling.stop();
                        soundCash.play();
                        restart();
                    }
                });
            } else {
                $('.num').eq(index).animate({
                    backgroundPositionY: (u * 45) + (u * num_arr[index])
                }, {
                    duration: _duration,
                    easing: _easing,
                    complete: function() {
                        soundCash.play();
                    }
                });
            }
            // console.log('now:' + now);
            // console.log('index:' + index);
            // console.log('result:' + result);
            // console.log('num_arr:' + num_arr);
        }
    });
});
