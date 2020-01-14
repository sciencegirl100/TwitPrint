var Twit = require('twit')
var fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var conf = JSON.parse(fs.readFileSync('config.json'))
var T = new Twit({
  consumer_key: conf["twitter"]["key"],
  consumer_secret: conf["twitter"]["secret"],
  access_token: conf["twitter"]["access_token"],
  access_token_secret: conf["twitter"]["access_token_secret"]
})

var stream = T.stream('statuses/filter', {
  //follow: conf["by_user_id"]
  track: conf["keyword"]
})

stream.on('tweet', function(tweet){
  if (tweet["lang"] == "en" && typeof tweet["extended_tweet"] !== 'undefined'){
    console.log("-----------")
    var dt = new Date()
    var dtString = dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds()
    console.log(dtString)
    console.log("@" + tweet["user"]["screen_name"])
    console.log(tweet["extended_tweet"]["full_text"])
    if(conf["enable_printing"]){
      var printMe = dtString + "\n@" + tweet["user"]["screen_name"] + "\n\n" + tweet["extended_tweet"]["full_text"]
      print(printMe)
    }
  }
})

async function print(s){
  var filename = "Tweet-" + Math.round(Math.random()) + ".msg"
  fs.writeFile(filename, s, (err) => {
    if (err) throw err;
      printFile(filename)
  })
}

async function printFile(fname){
  const { stdout_lp, stderr_lp } = await exec('lp -o PageSize=Custom.73.2x350.0mm -d Twitter ' + fname)
  const { stdout_rm, stderr_rm } = await exec('rm ' + fname)
}
