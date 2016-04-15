#!/usr/bin/env node

var filters = ["vintage", "lomo", "clarity", "sinCity", "sunrise", "crossProcess", "orangePeel", "love", "grungy", "jarques", "pinhole", "oldBoot", "glowingSun", "hazyDays", "herMajesty", "nostalgia", "hemingway", "concentrate"]

var argv = require('yargs')
              .demand(1)
              .alias('s', 'size')
              .alias('d', 'delay')
              .alias('o', 'out')
              .alias('z', 'zoom')
              .alias('c', 'clip')
              .alias('p', 'preview')
              .option('filter', {
                alias: 'f',
                describe: 'choose a filter',
                choices: filters
              })
              .alias('f', 'filter')
              .describe('s', 'Size of image')
              .default({s: '512x512', d: 200, out: 'out.png', zoom: 1.0, preview:false})
              .argv

var caman = require('caman').Caman
var ora = require('ora')
var open = require('open')
var colors = require('colors')

var phantomjs = require('phantomjs-prebuilt')
var binPath = phantomjs.path

var path = require('path')
var childProcess = require('child_process')

var outfile = argv.out
var clip = argv.clip || `0x0x${argv.size}`

var childArgs = [
  path.join(__dirname, 'driver.js'),
  argv._[0],
  outfile,
  argv.size,
  argv.delay,
  argv.zoom,
  clip
]

var symbols = {
  ok: '✓'.green,
  err: '✖'.red,
}
var spinner = ora('Generating image...')
spinner.start()
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  spinner.stop()
  if(err){
    console.log(`${symbols.err} Error: ${err}`)
    console.log(stdout)
    process.exit(1)
  }
  console.log(`${symbols.ok} Done: ${outfile}`)
  var openfn = function(){
    if(argv.preview){
       open(outfile)
    }
  }
  if(argv.filter){
    var applyingFilter = ora('Applying filter...')
    applyingFilter.start()
    caman(outfile, function(){
      filter = this[argv.filter].bind(this)
      if(filter){
         filter()
      }
      this.render(function(){
        this.save(outfile)
        applyingFilter.stop()
        console.log(`${symbols.ok} Filter: ${argv.filter}`)
        openfn()
      })
    })
  }else{
    openfn()
  }
})




