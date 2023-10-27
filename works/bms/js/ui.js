$(function() {

    // * Audio
    // ==========================================
    var soundClick = new Howl({
        src: ['audio/button_click.mp3'],
        volume: 0.2
    });
    var soundSpining = new Howl({
        src: ['audio/rolling.mp3'],
        loop: true,
        volume: 1
    });
    var soundSpinEnd = new Howl({
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

    // * slot
    // ==========================================

    var _duration = 2000; // ms
    var _slotsDelay = 0; // ms
    var $slot = new SpinTwoThree(document.querySelector("#slot"), "btn-start", _slotsDelay, _duration);

    var $btnStart= $('#btnStart'),
        $endText = $('#endText'),
        $overlay = $('.overlay');

    $btnStart.click(function(e) {
        e.preventDefault;
        soundClick.play();
    });

    // * Events Start
    function onSpinStart(e) {
		// console.log('Start');

        // * hide "?" slice and selected slice
        //setTimeout(function() {
            //$('#slot .slice:not(.selected)').first().addClass('selected');
        //}, 300);

        // * sheffle items
        $slot.shuffle(0);

        $btnStart.addClass('hide');
        soundSpining.play();
	}

    // * Events Complete
    function onSpinComplete(e) {
	    // console.log('Complete');
        // * hide "?" slice and selected slice
        //$('#slot .slice').first().animate({height: 0}, 100);

        // * Play Sounds
        soundSpining.stop();
        soundSpinEnd.play();

        setTimeout(function() {
            soundWin1.play();
        }, 300);

        // setTimeout(function() {
        //     soundWin2.play();
        //     soundWin2.fade(0, .6, 0);
        // }, 600);

        $btnStart.removeClass('hide');

        // * Show End Text
        //$endText.show().addClass('show');

        // setTimeout(function() {
        //     $endText.removeClass('show').addClass('infinite bounce')
        // }, 600);

        // * overlay button
        // $overlay.show().click(function() {
        //     soundWin2.fade(.6, 0, 1000);
        //     soundClick.play();

        //     $(this).hide();
        //     $endText.fadeOut(150, function(){
        //         $btnStart.show();
        //     });
        // });;

        //var _selectedID = $("#slot .slice").first().attr('data-id');
        // console.log(_selectedID);
	}

    $slot.setCallbackStart(onSpinStart);
    $slot.setCallbackComplete(onSpinComplete);

});
