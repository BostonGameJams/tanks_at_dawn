window.onload = function() {
  function el( id ) {
    return document.getElementById( id );
  }

  // from stackoverflow
  // http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
  // no, I didn't realize there was a jquery plugin for this
  function getParameterByName( name ) {
    name = name.replace( /[\[]/, "\\\[" ).replace( /[\]]/, "\\\]" );
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if ( results == null ) {
      return '';
    } else {
      return decodeURIComponent( results[1].replace( /\+/g, ' ' ) );
    }
  }

  // eyeHeight changes LOS and shadow calculations by a certain offset off
  // the ground. Larger values represent "taller" tanks.
  var eyeHeight = parseInt( getParameterByName( 'eyeHeight' ) || '1' );

  // generic bresenham implementation, used only for visibility test
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

  // for a given heightmap, returns true or false for visibility between two points
  function isTargetVisible( heightmap, tankX, tankY, targetX, targetY ) {
    var
      pix = heightmap.data,
      tankHeight = pix[ 4 * ( tankY * heightmap.width + tankX ) ] + eyeHeight,
      targetHeight = pix[ 4 * ( targetY * heightmap.width + targetX ) ] + eyeHeight,

      points = bresenhamLine( tankX, tankY, targetX, targetY ),
      dH = ( targetHeight - tankHeight ) / ( points.length - 1 ),
      i, pointHeight, sightHeight;

    for ( i = 1; i < points.length - 1; ++i ) {
      // height of the terrain at the line-of-sight point
      pointHeight = pix[ 4 * ( points[ i ].y * heightmap.width +  points[ i ].x ) ];
      // height of the line-of-sight point
      sightHeight = tankHeight + i * dH;

      if ( pointHeight > sightHeight ) {
        return false;
      }
    }

    return true;
  }

  function createVisibilityMap( heightmap, tankX, tankY ) {
    var
      startTime = Date.now(),
      shadowMap = arguments[3],
      visibilityMap = ctx.createImageData( heightmap.width, heightmap.height ),
      pix = visibilityMap.data,
      i, j, pixelIndex;

    for ( i = 0; i < heightmap.width; ++i ) {
      for ( j = 0; j < heightmap.height; ++j ) {
        pixelIndex = 4 * ( j * heightmap.width + i ) + 3;

        // default behavior is to calculate visibility on all pixels
        if ( shadowMap == null || shadowMap.data[ pixelIndex ] === 0 ) {
          pix[ pixelIndex ] = isTargetVisible( heightmap, tankX, tankY, i, j ) ? 0 : 255;
        }

        // if a shadow map is given, ignore places in shadow
        else {
          pix[ pixelIndex ] = 255;
        }
      }
    }

    el( 'output-timing' ).innerHTML = (Date.now() - startTime) + 'ms';

    return visibilityMap;
  }

  // using a voxel ray-traversal technique from
  // Amanatides, John. A Fast Voxel Traversal Algorithm for Ray Tracing
  function isSunVisible( heightmap, i, j, sunVec ) {
    var
      startZ = heightmap.data[ 4 * ( j * heightmap.width + i ) ] + eyeHeight,
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

      // pixel values will only ever be 0 to 255
      if ( lineHeight > 255 ) {
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
    var
      startTime = Date.now(),
      shadowMap = ctx.createImageData( heightmap.width, heightmap.height ),
      pix = shadowMap.data,
      i, j;

    for ( i = 0; i < heightmap.width; ++i ) {
      for ( j = 0; j < heightmap.height; ++j ) {
        pix[ 4 * ( j * shadowMap.width + i ) + 3 ] = isSunVisible( heightmap, i, j, sunVec ) ? 0 : 192;
      }
    }

    el( 'shadow-timing' ).innerHTML = (Date.now() - startTime) + 'ms';

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
    // draw the initial heightmap image
    ctx.drawImage( img, 0, 0 );

    heightmap = ctx.getImageData( 0, 0, 128, 128 );

    // compute and blit the shadow map
    var shadowMap = createShadowMap( heightmap, { x: -0.3, y: -0.3, z: 0.5 } );
    shadowCtx.putImageData( shadowMap, 0, 0 );

    // link the shadow map
    var shadowAnchor = el( 'base64-shadow' );
    shadowAnchor.href = shadowCanvas.toDataURL( 'image/png' );

    // specify a position on the heightmap to perform visibility calculations
    canvas.addEventListener( 'click', function( e ) {
      // some click code stolen from some mozilla tutorial
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

      // draw the red dot where we clicked
      ctx.drawImage( img, 0, 0 );
      ctx.putImageData( reticule, x - 1, y - 1 );

      // compute and blit the visibility map
      var visibilityMap = createVisibilityMap( heightmap, x, y, shadowMap );
      outputCtx.putImageData( visibilityMap, 0, 0 );

      // link the visibility map
      var outputAnchor = el( 'base64-output' );
      outputAnchor.href = outputCanvas.toDataURL( 'image/png' );
      outputCtx.putImageData( reticule, x - 1, y - 1 );
    }, false );
  };
  img.src = 'heightmap-128.png';
};
