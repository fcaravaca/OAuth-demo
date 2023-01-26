var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const CLIENT_ID = ""
const CLIENT_SECRET = ""

function fetchApi(url, auth){
  return new Promise((resolve) => {
    fetch(url, {headers: {authorization: auth}}).then(r => r.json()).then(r => {
      resolve(r)
    })
  })
}

router.get("/fetchUser", function(req, res, next) { 
  fetchApi("https://api.github.com/user", req.headers.authorization).then(user => {
    if(user.login){
      fetchApi("https://api.github.com/users/" + user.login + "/starred", req.headers.authorization).then(gists => {
        res.send({user, gists})
      });   
    }else{
      res.send({user: {}})
    }
  })
})

router.get("/oauth", function(req, res, next) {
  fetch("https://github.com/login/oauth/access_token?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code , {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(r => r.json()).then(r => { // Redirect to the front-end with the access token
    res.redirect("http://localhost:3000?access_token=" + r.access_token)
  })
})

module.exports = router;
