window.onload = function() {
  function el( id ) {
    return document.getElementById( id );
  }

  function getParameterByName( name ) {
    name = name.replace( /[\[]/, "\\\[" ).replace( /[\]]/, "\\\]" );
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if ( results == null ) {
      return "";
    } else {
      return decodeURIComponent( results[1].replace( /\+/g, ' ' ) );
    }
  }

  var eyeHeight = parseInt( getParameterByName( 'eyeHeight' ) || '1' );

  function bresenhamLine( x0, y0, x1, y1 ) {
    var
      dx = Math.abs( x1 - x0 ),
      dy = Math.abs( y1 - y0 ),
      sx = x0 < x1 ? 1 : -1,
      sy = y0 < y1 ? 1 : -1,
      err = dx - dy,
      points = [];

    while ( true ) {
      points.push({ x: x0, y: y0 });

      if ( x0 === x1 && y0 === y1 ) {
        return points;
      }

      var err2 = 2 * err;

      if ( err2 > -dy ) {
        err -= dy;
        x0 += sx;
      }

      if ( err2 < dx ) {
        err += dx;
        y0 += sy;
      }
    }
  }

  function isTargetVisible( heightmap, tankX, tankY, targetX, targetY ) {
    var pix = heightmap.data;
    var tankHeight = pix[ 4 * ( tankY * heightmap.width + tankX ) ] + eyeHeight;
    var targetHeight = pix[ 4 * ( targetY * heightmap.width + targetX ) ] + eyeHeight;

    var points = bresenhamLine( tankX, tankY, targetX, targetY );
    var dH = ( targetHeight - tankHeight ) / ( points.length - 1 );

    for ( var i = 1; i < points.length - 1; ++i ) {
      var
        // height of the terrain at the line-of-sight point
        pointHeight = pix[ 4 * ( points[ i ].y * heightmap.width +  points[ i ].x ) ],
        // height of the line-of-sight point
        sightHeight = tankHeight + i * dH;

      if ( pointHeight > sightHeight ) {
        return false;
      }
    }

    return true;
  }

  function createVisibilityMap( heightmap, tankX, tankY ) {
    var visibilityMap = ctx.createImageData( heightmap.width, heightmap.height );
    var pix = visibilityMap.data;

    for ( var i = 0; i < heightmap.width; ++i ) {
      for ( var j = 0; j < heightmap.height; ++j ) {
        pix[ 4 * ( j * visibilityMap.width + i ) + 3 ] = isTargetVisible( heightmap, tankX, tankY, i, j ) ? 0 : 255;
      }
    }

    return visibilityMap;
  }

  function isSunVisible( heightmap, i, j, sunVec ) {
    var
      startZ = heightmap.data[ 4 * ( j * heightmap.width + i ) ] + 1,
      sx = sunVec.x > 0 ? 1 : -1,
      sy = sunVec.y > 0 ? 1 : -1,
      maxX = sx * 0.5 / sunVec.x,
      maxY = sy * 0.5 / sunVec.y,
      dx = Math.abs( 1 / sunVec.x ),
      dy = Math.abs( 1 / sunVec.y ),
      t = 0;

    while ( i >= 0 && i < heightmap.width && j >= 0 && j < heightmap.height ) {
      var
        pointHeight = heightmap.data[ 4 * ( j * heightmap.width + i ) ],
        lineHeight = startZ + sunVec.z * t;

      // alert(
      //   't: ' + t + "\n"
      //     + '(' + i + ', ' + j + ', ' + pointHeight + ")\n"
      //     + '(' + ( i + sunVec.x * t ) + ', ' + ( j + sunVec.y * t ) + ', ' + lineHeight + ')'
      // );

      if ( pointHeight > lineHeight ) {
        return false;
      }

      if ( lineHeight > 256 ) {
        return true;
      }

      if ( maxX < maxY ) {
        t = maxX;
        maxX += dx;
        i += sx;
      } else {
        t = maxY;
        maxY += dy;
        j += sy;
      }
    }

    return true;
  }

  function createShadowMap( heightmap, sunVec ) {
    var shadowMap = ctx.createImageData( heightmap.width, heightmap.height );
    var pix = shadowMap.data;

    for ( var i = 0; i < heightmap.width; ++i ) {
      for ( var j = 0; j < heightmap.height; ++j ) {
        pix[ 4 * ( j * shadowMap.width + i ) + 3 ] = isSunVisible( heightmap, i, j, sunVec ) ? 0 : 192;
      }
    }

    return shadowMap;
  }

  var canvas = el( 'input-canvas' );
  var ctx = canvas.getContext( '2d' );

  var outputCanvas = el( 'output-canvas' );
  var outputCtx = outputCanvas.getContext( '2d' );

  var shadowCanvas = el( 'shadow-canvas' );
  var shadowCtx = shadowCanvas.getContext( '2d' );

  var heightmap;
  var reticule = ctx.createImageData( 3, 3 );
  for ( var index = 0; index < reticule.width * reticule.height; ++index ) {
    reticule.data[ 4 * index ] = 255;
    reticule.data[ 4 * index + 3 ] = 255;
  };

  var img = new Image();
  img.onload = function() {
    ctx.drawImage( img, 0, 0 );

    heightmap = ctx.getImageData( 0, 0, 256, 256 );

    var shadowMap = createShadowMap( heightmap, { x: -0.3, y: -0.3, z: 0.5 } );
    shadowCtx.putImageData( shadowMap, 0, 0 );
    var shadowAnchor = el( 'base64-shadow' );
    shadowAnchor.href = shadowCanvas.toDataURL( 'image/png' );

    canvas.addEventListener( 'click', function( e ) {
      var x, y;
      if ( e.pageX || e.pageY ) {
        x = e.pageX;
        y = e.pageY;
      } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;

      ctx.drawImage( img, 0, 0 );
      ctx.putImageData( reticule, x - 1, y - 1 );

      var visibilityMap = createVisibilityMap( heightmap, x, y );
      outputCtx.putImageData( visibilityMap, 0, 0 );
      var outputAnchor = el( 'base64-output' );
      outputAnchor.href = outputCanvas.toDataURL( 'image/png' );
      outputCtx.putImageData( reticule, x - 1, y - 1 );
    }, false );
  };
  img.src = 'heightmap.png';
};
