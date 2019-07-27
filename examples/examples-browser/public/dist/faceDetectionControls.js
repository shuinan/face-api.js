'use strict';

var SSD_MOBILENETV1 = 'ssd_mobilenetv1';
var TINY_FACE_DETECTOR = 'tiny_face_detector';
var MTCNN = 'mtcnn';

var selectedFaceDetector = SSD_MOBILENETV1;

// ssd_mobilenetv1 options
var minConfidence = 0.5;

// tiny_face_detector options
var inputSize = 512;
var scoreThreshold = 0.5;

//mtcnn options
var minFaceSize = 20;

function getFaceDetectorOptions() {
  return selectedFaceDetector === SSD_MOBILENETV1 ? new faceapi.SsdMobilenetv1Options({ minConfidence: minConfidence }) : selectedFaceDetector === TINY_FACE_DETECTOR ? new faceapi.TinyFaceDetectorOptions({ inputSize: inputSize, scoreThreshold: scoreThreshold }) : new faceapi.MtcnnOptions({ minFaceSize: minFaceSize });
}

function onIncreaseMinConfidence() {
  minConfidence = Math.min(faceapi.round(minConfidence + 0.1), 1.0);
  $('#minConfidence').val(minConfidence);
  updateResults();
}

function onDecreaseMinConfidence() {
  minConfidence = Math.max(faceapi.round(minConfidence - 0.1), 0.1);
  $('#minConfidence').val(minConfidence);
  updateResults();
}

function onInputSizeChanged(e) {
  changeInputSize(e.target.value);
  updateResults();
}

function changeInputSize(size) {
  inputSize = parseInt(size);

  var inputSizeSelect = $('#inputSize');
  inputSizeSelect.val(inputSize);
  inputSizeSelect.material_select();
}

function onIncreaseScoreThreshold() {
  scoreThreshold = Math.min(faceapi.round(scoreThreshold + 0.1), 1.0);
  $('#scoreThreshold').val(scoreThreshold);
  updateResults();
}

function onDecreaseScoreThreshold() {
  scoreThreshold = Math.max(faceapi.round(scoreThreshold - 0.1), 0.1);
  $('#scoreThreshold').val(scoreThreshold);
  updateResults();
}

function onIncreaseMinFaceSize() {
  minFaceSize = Math.min(faceapi.round(minFaceSize + 20), 300);
  $('#minFaceSize').val(minFaceSize);
}

function onDecreaseMinFaceSize() {
  minFaceSize = Math.max(faceapi.round(minFaceSize - 20), 50);
  $('#minFaceSize').val(minFaceSize);
}

function getCurrentFaceDetectionNet() {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return faceapi.nets.ssdMobilenetv1;
  }
  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector;
  }
  if (selectedFaceDetector === MTCNN) {
    return faceapi.nets.mtcnn;
  }
}

function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params;
}

async function changeFaceDetector(detector) {
  ['#ssd_mobilenetv1_controls', '#tiny_face_detector_controls', '#mtcnn_controls'].forEach(function (id) {
    return $(id).hide();
  });

  selectedFaceDetector = detector;
  var faceDetectorSelect = $('#selectFaceDetector');
  faceDetectorSelect.val(detector);
  faceDetectorSelect.material_select();

  $('#loader').show();
  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load('/');
  }

  $('#' + detector + '_controls').show();
  $('#loader').hide();
}

async function onSelectedFaceDetectorChanged(e) {
  selectedFaceDetector = e.target.value;

  await changeFaceDetector(e.target.value);
  updateResults();
}

function initFaceDetectionControls() {
  var faceDetectorSelect = $('#selectFaceDetector');
  faceDetectorSelect.val(selectedFaceDetector);
  faceDetectorSelect.on('change', onSelectedFaceDetectorChanged);
  faceDetectorSelect.material_select();

  var inputSizeSelect = $('#inputSize');
  inputSizeSelect.val(inputSize);
  inputSizeSelect.on('change', onInputSizeChanged);
  inputSizeSelect.material_select();
}