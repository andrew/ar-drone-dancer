$(function(){
  (function () {

    var
      AUDIO_FILE = '../songs/zircon_devils_spirit',
      box = document.getElementById( 'box' ),
      speaker = document.getElementById( 'speaker' ),
      dancer, kick;

    var free = true
    var last_move = 'fly down'
    /*
     * Dancer.js magic
     */
    Dancer.setOptions({
      flashSWF : 'lib/soundmanager2.swf',
      flashJS  : 'lib/soundmanager2.js'
    });

    dancer = new Dancer();
    kick = dancer.createKick({
      onKick: function () {
        box.className = 'beat'
        speaker.className = 'beat'
        $('body, #loading').addClass('beat')
        
        if(free == true && last_move === 'fly down'){
          console.log('fly up')
          socket.emit('fly up');
          free = false
          last_move = 'fly up'
          setTimeout(function(){
            console.log('stop')
            socket.emit('stop')
            free = true
          }, 800)
        }
      },
      offKick: function () {
        box.className = ''
        speaker.className = ''
        $('body, #loading').removeClass('beat')
        if(free == true && last_move === 'fly up'){
          console.log('fly down')
          socket.emit('fly down');
          last_move = 'fly down'
          free = false
          setTimeout(function(){
            console.log('stop')
            socket.emit('stop')
            free = true
          }, 800)
        }
      },
      threshold: 0.4
    }).on();


    dancer
      .load({ src: AUDIO_FILE, codecs: [ 'ogg', 'mp3' ]});

    Dancer.isSupported() || loaded();
    !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

    /*
     * Loading
     */

    function loaded () {
      var
        loading = document.getElementById( 'loading' ),
        anchor  = document.createElement('A'),
        supported = Dancer.isSupported(),
        p;

      anchor.appendChild( document.createTextNode( supported ? 'Play!' : 'Close' ) );
      anchor.setAttribute( 'href', '#' );
      loading.innerHTML = '';
      loading.appendChild( anchor );

      if ( !supported ) {
        p = document.createElement('P');
        p.appendChild( document.createTextNode( 'Your browser does not currently support either Web Audio API or Audio Data API. The audio may play, but the visualizers will not move to the music; check out the latest Chrome or Firefox browsers!' ) );
        loading.appendChild( p );
      }

      $('#loading a').addClass('play')

      var play = function(){
        socket.emit('takeoff');
        socket.emit('fly up');
        setTimeout(function() {
          socket.emit('stop');
        }, 1500)
        
        $('#loading a').text('Get Ready')
        setTimeout(function() {
          dancer.play();
          $('#loading a').removeClass('play')
          $('#loading a').addClass('pause').text('Pause')
          $('#loading a').off('click')
          $('.pause').on('click', pause)
        }, 5000)
      }
      
      var pause = function(){
        socket.emit('land');
        $('#loading a').removeClass('pause')
        $('#loading a').addClass('play')
        $('#loading a').text('Play')
        dancer.pause();
        $('#loading a').off('click')
        $('.play').on('click', play)
      }
      
      $('.play').on('click', play)
      $('.pause').on('click', pause)
    }

    // For debugging
    window.dancer = dancer;

  })();
  
})
