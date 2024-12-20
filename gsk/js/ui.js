$(function() {
    // * DNA canvas
    // ==========================================
    $('#canvas').dnaAnimate();

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

    var _duration = 5000; // ms
    var $slot = new SpinTwoThree(document.querySelector("#slot"), "btn-start", 0, _duration);

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
            $('#slot .slice:not(.selected)').first().addClass('selected');
        //}, 300);

        // * sheffle items
        $slot.shuffle(0);

        $btnStart.fadeOut(150);
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

        setTimeout(function() {
            soundWin2.play();
            soundWin2.fade(0, .6, 0);
        }, 600);

        // * Show End Text
        $endText.show().addClass('show');

        setTimeout(function() {
            $endText.removeClass('show').addClass('infinite bounce')
        }, 600);

        // * overlay button
        $overlay.show().click(function() {
            soundWin2.fade(.6, 0, 1000);
            soundClick.play();

            $(this).hide();
            $endText.fadeOut(150, function(){
                $btnStart.show();
            });
        });;

        var _selectedID = $("#slot .slice").first().attr('data-id');
        // console.log(_selectedID);
	}

    $slot.setCallbackStart(onSpinStart);
    $slot.setCallbackComplete(onSpinComplete);

});

/*
 * DNA Animate
 ============================================================*/

(function($) {
    $.fn.dnaAnimate = function(options) {
        var settings = {
            fps:       27,
            fgColor:   "110,140,181",
            bgColor:   "transparent",
            lineColor: "104,136,180",
            dotSize:   4,
            speed:     1
        }

        var cbSize = 180;

        if (options) {
            settings = $.extend(settings, options);
        }

        var calculator = function(c, dim, t, y) {
            var x1 = 0,
                x2 = 0,
                z1 = 0,
                z2 = 0;

            var drawShape = function(x, y, opacity) {
                c.fillStyle = "rgba(" + settings.fgColor + "," + opacity + ")";
                c.beginPath();
                c.arc(x + settings.dotSize, y + settings.dotSize, settings.dotSize, 0, Math.PI * 2, true);
                c.closePath();
                c.fill();
            }

            var drawLine = function(y, x1, x2, z1, z2) {
                c.beginPath();
                c.moveTo(x1 + settings.dotSize, y + settings.dotSize);
                c.lineTo(x2 + settings.dotSize, y + settings.dotSize);
                var g = c.createLinearGradient(x1, y, x2, y);
                g.addColorStop(0, "rgba(" + settings.fgColor + "," + z1 + ")");
                g.addColorStop(1, "rgba(" + settings.lineColor + "," + z2 + ")");
                c.strokeStyle = g;
                c.lineWidth= 2;
                c.stroke();
            }

            var fix = function(n) {
                return Math.round(n * 10) / 10;
            }

            return {
                calculate: function() {
                    t += settings.speed;
                    x1 = Math.cos(t / 360 * (Math.PI * 2));
                    x2 = Math.sin((t + 270) / 360 * (Math.PI * 2));
                    z1 = Math.cos((t + 90) / 360 * (Math.PI * 2));
                    z2 = Math.sin((t + 360) / 360 * (Math.PI * 2));
                },

                draw: function() {
                    var _x1 = fix((x1 * (dim.halfWidth - settings.dotSize)) + dim.halfWidth - settings.dotSize);
                    var _x2 = fix((x2 * (dim.halfWidth - settings.dotSize)) + dim.halfWidth - settings.dotSize);
                    var _z1 = (z1 + 1) / 2;
                    var _z2 = (z2 + 1) / 2;

                    if (_x1 != 45) {
                        drawLine(y, _x1, _x2, _z1, _z2);
                    }

                    drawShape(_x1, y, _z1);
                    drawShape(_x2, y, _z2);
                }
            }
        }

        return this.each(function(i) {
            var c = this.getContext('2d');

            var dim = {
                width: c.canvas.width,
                height: c.canvas.height,
                halfHeight: c.canvas.height / 2,
                halfWidth: c.canvas.width / 2
            }

            var buffer = document.createElement('canvas');

            buffer.setAttribute('width', dim.width);
            buffer.setAttribute('height', cbSize);

            var cb = buffer.getContext('2d');

            var calculators = [];
            for (n = 0; n < 18; n++) {
                var calc = new calculator(cb, dim, n * 12, n * 12);
                calculators[n] = calc;
            }

            var copies = dim.height > cbSize ? Math.ceil(dim.height / (cbSize)) : 1;

            var now, delta;
            var then = Date.now();
            var interval = 1000 / settings.fps;

            var draw = function() {
                requestAnimationFrame(draw);

                now = Date.now();
                delta = now - then;

                if (delta >= interval) {
                    cb.clearRect(0, 0, dim.width, dim.height);
                    cb.fillStyle = settings.bgColor;
                    cb.fillRect(0, 0, dim.width, dim.height);
                    $.each(calculators, function(i, calc) {
                        calc.calculate();
                        calc.draw();
                    });

                    c.clearRect(0, 0, dim.width, dim.height);
                    for (var n = 0; n < copies; n++) {
                        c.drawImage(buffer, 0, n * cbSize);
                    }

                    then = now - (delta % interval);
                }
            }

            draw();
        });
    }
})(jQuery);
