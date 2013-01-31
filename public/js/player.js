(function () {

  var
    AUDIO_FILE = '../songs/zircon_devils_spirit',
    box = document.getElementById( 'box' ),
    dancer, kick;

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
      console.log('fly up')
      socket.emit('fly up');
    },
    offKick: function () {
      box.className = ''
      console.log('fly down a bit')
      socket.emit('fly down');
    }
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

    anchor.addEventListener( 'click', function () {
      socket.emit('takeoff');
      setTimeout(function() { dancer.play(); }, 2000)
      document.getElementById('loading').style.display = 'none';
    });
  }

  // For debugging
  window.dancer = dancer;

})();
