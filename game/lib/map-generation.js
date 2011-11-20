$(window).load(function() {
  function el( id ) {
    return document.getElementById( id );
  }

  // from stackoverflow
  // http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
  // no, I didn't realize there was a jquery plugin for this
  function getParameterByName( name ) {
    return game[name];
  }

  // eyeHeight changes LOS and shadow calculations by a certain offset off
  // the ground. Larger values represent "taller" tanks.
  var eyeHeight = parseInt( getParameterByName( 'eyeHeight' ) || '1' );

  game.sunZ = 0;
  game.sunX = -0.3;
  game.sunY = -0.3;

  var heightScale = parseFloat( getParameterByName( 'heightScale' ) || '1' );

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
      tankHeight = heightScale * pix[ 4 * ( tankY * heightmap.width + tankX ) ] + eyeHeight,
      targetHeight = heightScale * pix[ 4 * ( targetY * heightmap.width + targetX ) ] + eyeHeight,

      points = bresenhamLine( tankX, tankY, targetX, targetY ),
      dH = ( targetHeight - tankHeight ) / ( points.length - 1 ),
      i, pointHeight, sightHeight;

    for ( i = 1; i < points.length - 1; ++i ) {
      // height of the terrain at the line-of-sight point
      pointHeight = heightScale * pix[ 4 * ( points[ i ].y * heightmap.width +  points[ i ].x ) ];
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
      opaque = 128,
      minSightRange = Math.asin( normalize({ x: game.sunX, y: game.sunY, z: game.sunZ }).z ) * 20,
      i, j, pixelIndex;

    for ( i = 0; i < heightmap.width; ++i ) {
      for ( j = 0; j < heightmap.height; ++j ) {
        pixelIndex = 4 * ( j * heightmap.width + i );

        if ( shadowMap != null ) {
          if ( shadowMap.data[ pixelIndex + 3 ] !== 0 ) {
            // pix[ pixelIndex + 0 ] = 255;
            // pix[ pixelIndex + 3 ] = opaque;

            // if ( Math.abs( tankX - i ) <= minSightRange && Math.abs( tankY - j ) <= minSightRange ) {
            //   pix[ pixelIndex + 3 ] = 0;
            // }

            // if ( !( Math.abs( tankX - i ) <= minSightRange && Math.abs( tankY - j ) <= minSightRange ) ) {
            if ( Math.sqrt( Math.pow( tankX - i, 2 ) + Math.pow( tankY - j, 2 ) ) > minSightRange ) {
              pix[ pixelIndex + 0 ] = 255;
              pix[ pixelIndex + 3 ] = opaque;
            }
          }
        }

        if ( !isTargetVisible( heightmap, tankX, tankY, i, j ) ) {
          pix[ pixelIndex + 2 ] = 255;
          pix[ pixelIndex + 3 ] = opaque;
        }

        // if ( shadowMap != null ) {
        //   if ( isTargetVisible( heightmap, tankX, tankY, i, j ) ) {
        //     if ( shadowMap.data[ pixelIndex + 3 ] !== 0 ) {
        //       pix[ pixelIndex + 0 ] = 255;
        //       pix[ pixelIndex + 3 ] = opaque;
        //     }
        //   } else {
        //     pix[ pixelIndex + 2 ] = 255;
        //     pix[ pixelIndex + 3 ] = opaque;
        //   }
        // }

        // // default behavior is to calculate visibility on all pixels
        // if ( shadowMap == null || shadowMap.data[ pixelIndex ] === 0 ) {
        //   pix[ pixelIndex + 2 ] = 255;
        //   pix[ pixelIndex + 3 ] = isTargetVisible( heightmap, tankX, tankY, i, j ) ? 0 : opaque;
        // }

        // // if a shadow map is given, ignore places in shadow
        // else {
        //   pix[ pixelIndex + 0 ] = 255;
        //   pix[ pixelIndex + 3 ] = opaque;
        // }
      }
    }

    el( 'output-timing' ).innerHTML = (Date.now() - startTime) + 'ms';

    return visibilityMap;
  }

  // using a voxel ray-traversal technique from
  // Amanatides, John. A Fast Voxel Traversal Algorithm for Ray Tracing
  function isSunVisible( heightmap, i, j, sunVec ) {
    var
      startZ = heightScale * heightmap.data[ 4 * ( j * heightmap.width + i ) ] + eyeHeight,
      sx = sunVec.x > 0 ? 1 : -1,
      sy = sunVec.y > 0 ? 1 : -1,
      maxX = sx * 0.5 / sunVec.x,
      maxY = sy * 0.5 / sunVec.y,
      dx = Math.abs( 1 / sunVec.x ),
      dy = Math.abs( 1 / sunVec.y ),
      t = 0;

    while ( i >= 0 && i < heightmap.width && j >= 0 && j < heightmap.height ) {
      var
        pointHeight = heightScale * heightmap.data[ 4 * ( j * heightmap.width + i ) ],
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
      if ( lineHeight > 255 * heightScale ) {
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

  function cross( a, b ) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }

  function dot( a, b ) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function normalize( v ) {
    var length = Math.sqrt( v.x * v.x + v.y * v.y + v.z * v.z );
    var invLenth = 1 / length;
    return {
      x: v.x * invLenth,
      y: v.y * invLenth,
      z: v.z * invLenth
    };
  }

  function getNormalAt( heightmap, i, j ) {
    var pixelIndex = 4 * ( j * heightmap.width + i );
    var height = heightmap.data[ pixelIndex ];
    var leftHeight = ( i === 0 )
      ? heightmap.data[ pixelIndex ]
      : heightmap.data[ 4 * ( j * heightmap.width + i - 1 ) ];
    var upHeight = ( j === 0 )
      ? heightmap.data[ pixelIndex ]
      : heightmap.data[ 4 * (( j - 1 ) * heightmap.width + i ) ];

    var a = {
      x: -1,
      y: 0,
      z: (leftHeight - height) * heightScale
    };

    var b = {
      x: 0,
      y: -1,
      z: (upHeight - height) * heightScale
    };

    var axb = cross( a, b );
    return normalize( axb );
  }

  function createNormalMap( heightmap ) {
    var
      startTime = Date.now(),
      normalMap = ctx.createImageData( heightmap.width, heightmap.height ),
      pix = normalMap.data,
      sunVec = { x: game.sunX, y: game.sunY, z: game.sunZ },
      i, j;

    for ( i = 0; i < heightmap.width; ++i ) {
      for ( j = 0; j < heightmap.height; ++j ) {
        var pixelIndex = 4 * ( j * heightmap.width + i );
        var normal = getNormalAt( heightmap, i, j );

        var r = normal.x * 128 + 128;
        var g = normal.y * 128 + 128;
        var b = normal.z * 128 + 128;

        pix[ pixelIndex + 0 ] = r;
        pix[ pixelIndex + 1 ] = g;
        pix[ pixelIndex + 2 ] = b;
        pix[ pixelIndex + 3 ] = 255;
      }
    }

    el( 'normal-timing' ).innerHTML = (Date.now() - startTime) + 'ms';

    return normalMap;
  }

  game.renderMap
    = function renderMap( heightmap ) {
    var
      startTime = Date.now(),
      render = ctx.createImageData( heightmap.width, heightmap.height ),
      pix = render.data,
      sunVec = { x: game.sunX, y: game.sunY, z: game.sunZ },
      i, j;

    for ( i = 0; i < heightmap.width; ++i ) {
      for ( j = 0; j < heightmap.height; ++j ) {
        var pixelIndex = 4 * ( j * heightmap.width + i );
        var normal = getNormalAt( heightmap, i, j );
        var lighting = dot( normal, normalize( sunVec ) ) * 255;

        pix[ pixelIndex + 0 ] = lighting;
        pix[ pixelIndex + 1 ] = lighting;
        pix[ pixelIndex + 2 ] = lighting;
        pix[ pixelIndex + 3 ] = 255;
      }
    }

    el( 'render-timing' ).innerHTML = (Date.now() - startTime) + 'ms';

    return render;
  }

  var canvas = el( 'input-canvas' );
  var ctx = canvas.getContext( '2d' );

  var outputCanvas = el( 'output-canvas' );
  var outputCtx = outputCanvas.getContext( '2d' );

  var normalCanvas = el( 'normal-canvas' );
  var normalCtx = normalCanvas.getContext( '2d' );

  var renderCanvas = el( 'render-canvas' );
  var renderCtx = renderCanvas.getContext( '2d' );

  var shadowMap;
  var shadowCanvas = el( 'shadow-canvas' );
  var shadowCtx = shadowCanvas.getContext( '2d' );

  var resizeCanvas = el( 'resized-canvas' );
  var resizeCtx = resizeCanvas.getContext( '2d' );

  var heightmap;
  var reticule = ctx.createImageData( 1, 1 );
  for ( var index = 0; index < reticule.width * reticule.height; ++index ) {
    reticule.data[ 4 * index ] = 255;
    reticule.data[ 4 * index + 3 ] = 255;
  };

  var tankPositionX, tankPositionY;

  function redraw() {
    // draw the red dot where we clicked
    ctx.drawImage( img, 0, 0 );
    ctx.putImageData(
      reticule,
      tankPositionX - ( reticule.width - 1 ) / 2,
      tankPositionY - ( reticule.height - 1 ) / 2
    );

    // compute and blit the visibility map
    var visibilityMap = createVisibilityMap( heightmap, tankPositionX, tankPositionY, shadowMap );
    outputCtx.putImageData( visibilityMap, 0, 0 );

    // link the visibility map
    var outputAnchor = el( 'base64-output' );
    outputAnchor.href = outputCanvas.toDataURL( 'image/png' );
    outputCtx.putImageData(
      reticule,
      tankPositionX - ( reticule.width - 1 ) / 2,
      tankPositionY - ( reticule.height - 1 ) / 2
    );

    resizeCtx.clearRect( 0, 0, resizeCanvas.width, resizeCanvas.height );
    resizeCtx.drawImage( renderCanvas, 0, 0, resizeCanvas.width, resizeCanvas.height );
    resizeCtx.drawImage( shadowCanvas, 0, 0, resizeCanvas.width, resizeCanvas.height );
    resizeCtx.drawImage( outputCanvas, 0, 0, resizeCanvas.width, resizeCanvas.height );
  }

  var img = new Image();
  img.onload = function() {
    // draw the initial heightmap image
    ctx.drawImage( img, 0, 0 );

    heightmap = ctx.getImageData( 0, 0, canvas.width, canvas.height );

    var normalMap = createNormalMap( heightmap );
    normalCtx.putImageData( normalMap, 0, 0 );

    var normalAnchor = el( 'base64-normal' );
    normalAnchor.href = normalCanvas.toDataURL( 'image/png' );

    var render = renderMap( heightmap );
    renderCtx.putImageData( render, 0, 0 );

    // compute and blit the shadow map
    shadowMap = createShadowMap( heightmap, { x: game.sunX, y: game.sunY, z: game.sunZ } );
    shadowCtx.putImageData( shadowMap, 0, 0 );

    // link the shadow map
    var shadowAnchor = el( 'base64-shadow' );
    shadowAnchor.href = shadowCanvas.toDataURL( 'image/png' );

    // specify a position on the heightmap to perform visibility calculations
    canvas.addEventListener( 'click', function( e ) {
      // some click code stolen from some mozilla tutorial
      if ( e.pageX || e.pageY ) {
        tankPositionX = e.pageX;
        tankPositionY = e.pageY;
      } else {
        tankPositionX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        tankPositionY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      tankPositionX -= canvas.offsetLeft;
      tankPositionY -= canvas.offsetTop;

      redraw();
    }, false );
  };
  img.src = 'heightmap-64.png';

  var inputCanvas = $( document.body );
  inputCanvas.keyup(function( evt ) {
    var shouldRedraw = false;

    // left
    if ( evt.keyCode == 37 ) {
      --tankPositionX;
      shouldRedraw = true;
    }

    // up
    else if ( evt.keyCode == 38 ) {
      --tankPositionY;
      shouldRedraw = true;
    }

    // right
    else if ( evt.keyCode == 39 ) {
      ++tankPositionX;
      shouldRedraw = true;
    }

    // down
    else if ( evt.keyCode == 40 ) {
      ++tankPositionY;
      shouldRedraw = true;
    }

    if ( shouldRedraw ) {
      redraw();
    }
  });
});
