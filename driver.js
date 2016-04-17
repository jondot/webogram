"use strict";
var page = require('webpage').create(),
    system = require('system')

console.log(system.args)
if (system.args.length != 8) {
    console.log('Expecting: script url filename size delay zoom clip retinaFactor');
    phantom.exit(1);
} else {
    var retinaFactor = parseInt(system.args[7])

    var address = system.args[1];
    var output = system.args[2];

    var size = system.args[3].split('x');
    var pageWidth = parseInt(size[0], 10);
    var pageHeight = parseInt(size[1], 10);
    page.zoomFactor = parseFloat(system.args[5])
    page.viewportSize = { width: pageWidth*retinaFactor, height: pageHeight*retinaFactor };
    var clips = system.args[6].split('x').map(function(x){return parseInt(x)});

    page.clipRect = { top: clips[0], left: clips[1], width: clips[2]*retinaFactor, height: clips[3]*retinaFactor };


    page.open(address, function (status) {
        if(retinaFactor > 1){
          page.evaluate(function () {
              document.body.style.webkitTransform = "scale(2)";
              document.body.style.webkitTransformOrigin = "0% 0%";
              document.body.style.width = "50%";
          })
        }
        if (status !== 'success') {
            console.error('Unable to load the address!');
            phantom.exit(1);
        } else {
            window.setTimeout(function () {
                page.render(output, {format: 'png'});
                phantom.exit();
            }, parseInt(system.args[4]));
        }
    });
}
