$(function() {

    $('.toggle-box').click(function(e) {
        el = $(e.target);
        toggleBoxSwitch(el);
    });


    function toggleBoxOpen(el) {
        var openContent = el.data('open-content');
        el.html(openContent);
        el.addClass('open');
    };

    function toggleBoxClose(el) {
        var closedContent = el.data('closed-content');
        el.html(closedContent);
        el.removeClass('open');
    };

    function toggleBoxSwitch(el) {
        if (el.hasClass('open') == false) {
            toggleBoxOpen(el);
        } else {
            toggleBoxClose(el);
        }
    };


    //open the about section when the link in the footer is clicked
    $('.open-about').click(function(e) {
        e.preventDefault();
        window.scrollTo(0, 0);
        $('#about-link').addClass('pink-bg');
        setTimeout(function() {
            $('#about-info').collapse('show');
            toggleBoxOpen($('#about-link'));
            $('#about-link').removeClass('pink-bg');
        }, 200);
    });


    //close the about section when the logo is clicked
    $('#title-link').click(function(e) {
        e.preventDefault();
        $('#about-info').collapse('hide');
        toggleBoxClose($('#about-link'));
    });



    //init plyr
    var plyrOptions = {
        controls: ['play-large', 'play', 'progress', 'current-time', 'forward'],
        keyboardShortcuts: {
            focused: true,
            global: true
        },
        toolTips: {
            controls: false,
            seek: true
        }
    };
    var player = plyr.setup('#player', plyrOptions)[0];

    //if the player can play, play
    player.on('canplay', function() {
        displayDuration(player.getDuration());
        player.play();
        $('.plyr').removeClass('plyr--loading');
    });

    //handle episode click
    $('.episode').click(function(e) {
        //ignore click if an <a> element or episode is already playing
        if ($(e.target).hasClass('playing') == false) {
            $('.stickyp').css({
                'bottom': '0'
            });
            player.stop();
            $('.episode').removeClass('playing');
            //get the url of the MP3 from the link
            var url = $(this).data('mp3');
            $('.plyr').addClass('plyr--loading');
            player.source({
                type: 'audio',
                sources: [{
                    src: url,
                    type: 'audio/mpeg'
                }]
            });
            $(this).addClass('playing');
            //analytics
            var ep = $(this).text();
            var show = $(this).closest('.podcast-card').data('show-title');
            gtag('event', 'play', {
                'podcast_title': show,
                'episode_title': ep,
                'event_label': show + " __ " + ep
            });
        }
    });

    function displayDuration(secs) {
        var time = secs.toString().toHHMMSS();
        var style = $("style#duration");
        style.html('.plyr__time--current:after{content: " / ' + time + '"}');
    }

    String.prototype.toHHMMSS = function() {
        var sec_num = parseInt(this, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        //zero pad mins and secs
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        //only display hours if there are hours
        var formatted
        if (hours == 0) {
            formatted = minutes + ':' + seconds;
        } else {
            formatted = hours + ':' + minutes + ':' + seconds;
        }
        return formatted
    }

    // detect if the device is a touchscreen
    var touchsupport = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    if (!touchsupport) { // browser doesn't support touch
        document.documentElement.className += " non-touch";
    };

    // detect if iOS device
    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    if (iOS == true) {
        $('.ios-only').removeClass('hidden');
    } else {
        $('.no-ios').removeClass('hidden');
    }

    $('.rss-option').click(function() {
        window.location = $(this).data('link');
    })


});