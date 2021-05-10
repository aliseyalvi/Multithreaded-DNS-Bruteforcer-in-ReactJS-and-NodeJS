var express = require('express');
const { execFile } = require('child_process');
var fs = require('fs');
var router = express.Router();
var app=express();
var output="";
var host="";
var port="";
/* GET users listing. */

    router.post('/', function(req, res, next) {
    console.log(req.body.data);
    host=req.body.data.host;
    res.send(req.body.data);
    
    /*
    
    const child = execFile('./portscanner', ['111.68.101.31', '100' ,'--only_open'], (error, stdout, stderr) => {
    //const child = execFile('./portscanner', [req.body.data.host, req.body.data.portrange ], (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout);
        output=stdout;
        //res.send(stdout);
      });
    */
   ///res.send(req.body.data);


});




/* GET users listing. */
router.get('/', function(req, res, next) {
  
    res.send(output);
});
    
module.exports = router;
