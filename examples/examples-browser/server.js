const express = require('express')
const path = require('path')
const { get } = require('request')

const app = express()

///////////////////////////////////////////
var fs = require('fs');   
//使用nodejs自带的http、https模块 
var http = require('http'); 
var https = require('https'); 
var privateKey = fs.readFileSync(path.join(__dirname, './auth/private.pem'), 'utf8'); 
var certificate = fs.readFileSync(path.join(__dirname, './auth/file.crt'), 'utf8'); 
var credentials = {key: privateKey, cert: certificate}; 
  
var httpServer = http.createServer(app); 
var httpsServer = https.createServer(credentials, app); 
//可以分别设置http、https的访问端口号 
var PORT = 3200; 
var SSLPORT = 3201; 
//创建http服务器 
httpServer.listen(PORT, function() { 
  console.log('HTTP Server is running on: http://localhost:%s', PORT); 
}); 
  
//创建https服务器 
httpsServer.listen(SSLPORT, function() { 
  console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT); 
}); 
  
//////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, '../images')))
app.use(express.static(path.join(__dirname, '../media')))
app.use(express.static(path.join(__dirname, '../../weights')))
app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/', (req, res) => res.redirect('/face_detection'))
app.get('/face_detection', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetection.html')))
app.get('/face_landmark_detection', (req, res) => res.sendFile(path.join(viewsDir, 'faceLandmarkDetection.html')))
app.get('/face_expression_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'faceExpressionRecognition.html')))
app.get('/age_and_gender_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'ageAndGenderRecognition.html')))
app.get('/face_extraction', (req, res) => res.sendFile(path.join(viewsDir, 'faceExtraction.html')))
app.get('/face_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'faceRecognition.html')))
app.get('/video_face_tracking', (req, res) => res.sendFile(path.join(viewsDir, 'videoFaceTracking.html')))
app.get('/webcam_face_detection', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceDetection.html')))
app.get('/webcam_1', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceDetection1.html')))
app.get('/webcam_face_landmark_detection', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceLandmarkDetection.html')))
app.get('/webcam_face_expression_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceExpressionRecognition.html')))
app.get('/webcam_age_and_gender_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'webcamAgeAndGenderRecognition.html')))
app.get('/bbt_face_landmark_detection', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceLandmarkDetection.html')))
app.get('/bbt_face_similarity', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceSimilarity.html')))
app.get('/bbt_face_matching', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceMatching.html')))
app.get('/bbt_face_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceRecognition.html')))
app.get('/bbt_face_recognition_1', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceRecognition.1.html')))
app.get('/batch_face_landmarks', (req, res) => res.sendFile(path.join(viewsDir, 'batchFaceLandmarks.html')))
app.get('/batch_face_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'batchFaceRecognition.html')))

app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})



var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '61.157.96.102',
  user     : 'ts',
  password : 'newts$#@!',
  database : 'tsregister',
  prot     : 12306
});
app.post('/userAuthPhoto', (req, res) => {
  var userAddSql= "INSERT INTO user(name,uID,position) VALUES(?,?,?)";
  var userAddSql_Params=['p1','1','no'];

  var showuser="SELECT * FROM userauthphoto";

  var deleteuserSql="DELETE FROM userauthphoto WHERE name='hehe'"

  //调用查询方法
  connection.query(userAddSql,userAddSql_Params,function(err,result){
      if(err) throw err;
      console.log('show result:',result);
      console.log('show result:',result.affectedRows);
  });
  connection.query(showuser, function(err,result){
    if(err) throw err;
    console.log('show result:',result);
    console.log('show result:',result.affectedRows);
});

  res.sendFile(path.join(viewsDir, 'batchFaceRecognition.html')) })

app.get('/userAuthPhoto', (req, res) => 
  res.sendFile(path.join(viewsDir, 'batchFaceRecognition.html')))


//// use http/https

//可以根据请求判断是http还是https 
app.get('/', function (req, res) { 
  if(req.protocol === 'https') { 
    res.status(200).send('This is https visit!'); 
  } 
  else { 
    res.status(200).send('This is http visit!'); 
  } 
}); 

///app.listen(3000, () => console.log('Listening on port 3000!'))

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}