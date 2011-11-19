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
  var tankHeight = pix[ 4 * ( tankY * heightmap.width + tankX ) ];
  var targetHeight = pix[ 4 * ( targetY * heightmap.width + targetX ) ];

  var points = bresenhamLine( tankX, tankY, targetX, targetY );
  var dH = ( targetHeight - tankHeight ) / ( points.length - 1 );

  for ( var i = 1; i < points.length - 1; ++i ) {
    var
      // height of the terrain at the line-of-sight point
      pointHeight = pix[ 4 * ( points[i].y * heightmap.width +  points[i].x ) ],
      // height of the line-of-sight point
      sightHeight = tankHeight + i * dH;

    if ( pointHeight > sightHeight ) {
      return false;
    }
  }

  return true;
}

window.onload = function() {
  function createVisibilityMap( heightmap, tankX, tankY ) {
    var visibilityMap = ctx.createImageData( heightmap.width, heightmap.height );
    var pix = visibilityMap.data;
    for ( var i = 0; i < heightmap.width; ++i ) {
      for ( var j = 0; j < heightmap.height; ++j ) {
        pix[ 4 * ( j * visibilityMap.width + i ) + 3 ] = isTargetVisible( heightmap, tankX, tankY, i, j ) ? 255 : 0;
      }
    }

    return visibilityMap;
  }

  var canvas = document.getElementById( 'input-canvas' );
  var ctx = canvas.getContext( '2d' );

  var outputCanvas = document.getElementById( 'output-canvas' );
  var outputCtx = outputCanvas.getContext( '2d' );

  var img = new Image();
  img.onload = function() {
    ctx.drawImage( img, 0, 0 );

    var heightmap = ctx.getImageData( 0, 0, 256, 256 );

    var i = 0, j = 0;
    window.setInterval(function() {
      var visibilityMap = createVisibilityMap( heightmap, i, j );

      outputCtx.putImageData( visibilityMap, 0, 0 );

      ++i;
      if ( i == heightmap.width ) {
        i = 0;
        ++j;
        if ( j == heightmap.height ) {
          j = 0;
        }
      }
    }, 250);
  };
  img.src = 'heightmap.png';
};
