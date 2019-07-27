'use strict';

/*@desc 人脸识别功能的初始化  使用人脸识别功能，先调这个函数初始化
*/
async function face_init() {
  // load face detection, face landmark model and face recognition models
  if (!isFaceDetectionModelLoaded()) {
    // dufault use:　SSD_MOBILENETV1, can be modified by selectedFaceDetector
    await getCurrentFaceDetectionNet().load('/');
  }

  await faceapi.loadFaceLandmarkModel('/');
  await faceapi.loadFaceRecognitionModel('/');
}

/*@desc 从图片提取特征
/@imgElement 是图片元素或者视频元素，可以是如下方式取得的
        <video  id="inputVideo" autoplay muted></video>
        <img id="inputImg" src="" style="max-width: 800px;" />
        const imgElement = $('#inputVideo').get(0) 或者 const imgElement = $('#inputImg').get(0)  
/*@return 返回值：如果不为undefined，就是 {images:[], descriptors:[]}
    images和descriptors一一对应
    images是图片中识别出来的多个人脸
    descriptors是每个人脸对应的特征描述，其中的每个元素，是Float32Array(128)类型（512字节）
*/
async function face_computeFaceDescriptor(imgElement) {
  if (!isFaceDetectionModelLoaded()) {
    return;
  }

  var options = getFaceDetectorOptions();

  var detections = await faceapi.detectAllFaces(imgElement, options);
  if (detections.length == 0) return;
  var faceImages = await faceapi.extractFaces(imgElement, detections);

  var ret = {};
  ret.images = faceImages;
  ret.descriptors = await Promise.all(faceImages.map(async function (img) {
    return await faceapi.computeFaceDescriptor(img);
  }));

  return ret;
}

/*@desc 内部函数  创建匹配器 */
async function face_inner_createFaceMatcher(allDescriptors, userIds) {
  if (allDescriptors.length != userIds.length) {
    return;
  }

  var i = 0;
  var labeledFaceDescriptors = await Promise.all(allDescriptors.map(async function (descriptors) {
    return new faceapi.LabeledFaceDescriptors(userIds[i++], descriptors);
  }));

  return new faceapi.FaceMatcher(labeledFaceDescriptors);
}

/*@desc 从图片中匹配出其中所有的人
/*@allDescriptors [ [Float32Array(128)] ] 二维数组 所有的人脸特征，每个人可以有多个人脸特征
/*@userIds  全班学生的id
/*@imgElement 是图片元素或者视频元素，可以是如下方式取得的
          <video  id="inputVideo" autoplay muted></video>
          <img id="inputImg" src="" style="max-width: 800px;" />
          const imgElement = $('#inputVideo').get(0) 或者 const imgElement = $('#inputImg').get(0) 
/*@return: [id]  匹配的所有学生数组
*/
async function face_matchFace(allDescriptors, userIds, videoElement) {
  faceMatcher = await face_inner_createFaceMatcher(allDescriptors, userIds);

  if (!faceMatcher) {
    return;
  }
  if (!isFaceDetectionModelLoaded()) {
    return;
  }

  /// 从当前照片获取头像和头像特征信息
  var options = getFaceDetectorOptions();
  var results = await faceapi.detectAllFaces(videoElement, options).withFaceLandmarks().withFaceDescriptors();

  videoElement.width = videoElement.videoWidth;
  videoElement.height = videoElement.videoHeight;

  // resize detection and landmarks in case displayed image is smaller than
  // original size
  var resizedResults = faceapi.resizeResults(results, videoElement);

  var attendees = new Array();
  resizedResults.forEach(function (_ref) {
    var detection = _ref.detection,
        descriptor = _ref.descriptor;

    var bestMatch = faceMatcher.findBestMatch(descriptor);

    if (bestMatch.label != "unknown") {
      attendees.push(bestMatch.label);
    }
  });

  return attendees;
}