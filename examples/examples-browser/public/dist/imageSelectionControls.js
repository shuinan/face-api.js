'use strict';

async function onSelectedImageChanged(uri) {
  var img = await faceapi.fetchImage(uri);
  $('#inputImg').get(0).src = img.src;
  updateResults();
}

async function loadImageFromUrl(url) {
  var img = await requestExternalImage($('#imgUrlInput').val());
  $('#inputImg').get(0).src = img.src;
  updateResults();
}

function renderImageSelectList(selectListId, onChange, initialValue, withFaceExpressionImages) {
  var images = [1, 2, 3, 4, 5].map(function (idx) {
    return 'bbt' + idx + '.jpg';
  });

  if (withFaceExpressionImages) {
    images = ['happy.jpg', 'sad.jpg', 'angry.jpg', 'disgusted.jpg', 'surprised.jpg', 'fearful.jpg', 'neutral.jpg'].concat(images);
  }

  function renderChildren(select) {
    images.forEach(function (imageName) {
      return renderOption(select, imageName, imageName);
    });
  }

  renderSelectList(selectListId, onChange, initialValue, renderChildren);
}

function initImageSelectionControls() {
  var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'bbt1.jpg';
  var withFaceExpressionImages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  renderImageSelectList('#selectList', async function (uri) {
    await onSelectedImageChanged(uri);
  }, initialValue, withFaceExpressionImages);
  onSelectedImageChanged($('#selectList select').val());
}