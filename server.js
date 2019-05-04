var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('含查询字符串的路径\n' + pathWithQuery)


  if (path == '/style.css') {
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.write('body{background-color: white;}')
    response.end()
  } else if (path == '/main.js') {
    response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
    var string = fs.readFileSync('./main.js', 'utf8')
    response.write(string)
    response.end()
  }else if (path == '/sign_up' && method==="POST") {
    //服务器端获取请求
    readBody(request).then((body)=>{
      let arrs = body.split('&')
      let hash = {}
      arrs.forEach((string)=>{
        let parts = string.split('=')
        let key = parts[0]
        let value = parts[1]
        //需要解码获得@
        hash[key] = decodeURIComponent(value)
      })
      //ES6新语法
      //email = hash[email]
      let {email,password,password_confirm} = hash
      console.log(email)
      if(email.indexOf('@') === -1){
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/JSON;charset=utf-8')
        response.write(`{
          "errors":{
            "email":"invalid"
          }
        }`)
      }else if(password !== password_confirm){
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json;charset=utf-8')
        response.write('password not match')
      }else{
        var users = fs.readFileSync('./db','utf8')
        //确认邮箱是否被占用
         //获取数组，写入数据
         users = JSON.parse(users)0
        let inUse = false
        for(let i=0;i<users.length;i++){
          let user = users[i]//对象
          if(user.email === email){
            inUse = true
            break
          }
        }
        if(inUse){
          response.statusCode = 400
          response.setHeader('Content-Type', 'application/JSON;charset=utf-8')
          response.write(`{
            "errors":{
              "email":"inUse"
            }
          }`)
        }else{
       
                 
        //将数组转为字符串写入
        userString = JSON.stringify(users)
        fs.writeFileSync('./db',userString)
       
        response.statusCode = 200
      }
      }
      response.end()
    })    
  }else if (path == '/sign_up' && method==="GET") {
    var string = fs.readFileSync('./sign_up.html', 'utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if (path == '/sign_in' && method==="GET") {
    var string = fs.readFileSync('./sign_in.html', 'utf8')
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if (path == '/sign_in' && method==="POST") {
    console.log(1)
    readBody(request).then((body)=>{
      let strings = body.split('&')
      console.log('string')
      console.log(strings)
      let hash = {}
      strings.forEach((string)=>{
        let parts = string.split('=')
        let key = parts[0]
        let value = parts[1]
        //需要解码获得@
        hash[key] = decodeURIComponent(value)
      })
      let {email,password} = hash
      // console.log('email')
      // console.log(email)
      // console.log('password')
      // console.log(password)
      var users = fs.readFileSync('./db','utf8')
      users = JSON.parse(users)
     let findOne//?
     for(let i=0;i<users.length;i++){
      let user = users[i]//对象
      // console.log(user)
      if(user.email === email && user.password===password){
        findOne = true
        break
      }
    }
      if(findOne){
        response.statusCode=200
        response.setHeader('Set-Cookie',`sign_in_email = ${email}`)
        
      }else{
        response.statusCode=401
      }
    response.end()
    })
      
  }else if (path === '/') {
    //进入首页，首先获取cookie中的关键字，和数据库中的数据进行比对，如果比对正确，就会显示首页
    var string = fs.readFileSync('./index.html', 'utf8')
    var cookieV = request.headers.cookie.split(',')
    
    let hash = {}
    for(let i=0;i<cookieV.length;i++){
      let parts = cookieV[i].split('=')
      let key = parts[0]
      let value = parts[1]
      hash[key] = value
    }
    console.log('hash')
    console.log(hash)
    //获取cookie中的email
    let email = hash.sign_in_email
    console.log('test email')
    console.log(email)
    let users = fs.readFileSync('./db','utf8')
    users = JSON.parse(users)
    console.log('test users')
    console.log(users)
   let found//?
   for(let i=0;i<users.length;i++){
    // let user = users[i]//对象
    if(users[i].email === email){
      //已经定义就不要重复定义了
      found = users[i]
      break
    }
  }
  console.log('found')
  console.log(found)
    if(found){
     
     string = string.replace('--willBeReplace--',email)
      
    }else{
      string = string.replace('--willBeReplace--','who are you?')
    }
    response.statusCode=200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  } else if (path === '/pay') {
    var amount = fs.readFileSync('./db', 'utf8')
    var newAmount = amount - 1
    fs.writeFileSync('./db', newAmount)
    response.setHeader('Content-Type', 'application/javascript')
    response.statusCode = 200
    let callbackName = query.callback
    response.write(`
  ${callbackName}.call(undefined, 'success')
  `)
    response.end()
  } else if (path === '/isxml') {
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin','http://frank.com:8001')
    response.write(`
    {
      "note":{
        "to": "lsq",
        "from": "seth",
        "heading": "say hi",
        "body": "hello"
      }
    }
  `)
  response.end()
  } else {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('error')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)


function readBody(request){
  return new Promise((resolve,reject)=>{
    let body = []
    request.on('data',(chunk)=>{
      body.push(chunk);
    }).on('end',()=>{
      body = Buffer.concat(body).toString();
      resolve(body)
    })
  })
}