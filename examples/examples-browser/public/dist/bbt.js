'use strict';

var classes = ['amy', 'bernadette', 'howard', 'leonard', 'penny', 'raj', 'sheldon', 'stuart'];

function getFaceImageUri(className, idx) {
  return className + '/' + className + idx + '.png';
}

function renderFaceImageSelectList(selectListId, onChange, initialValue) {
  var indices = [1, 2, 3, 4, 5];
  function renderChildren(select) {
    classes.forEach(function (className) {
      var optgroup = document.createElement('optgroup');
      optgroup.label = className;
      select.appendChild(optgroup);
      indices.forEach(function (imageIdx) {
        return renderOption(optgroup, className + ' ' + imageIdx, getFaceImageUri(className, imageIdx));
      });
    });
  }

  renderSelectList(selectListId, onChange, getFaceImageUri(initialValue.className, initialValue.imageIdx), renderChildren);
}

// fetch first image of each class and compute their descriptors
async function createBbtFaceMatcher() {
  var numImagesForTraining = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

  var maxAvailableImagesPerClass = 5;
  numImagesForTraining = Math.min(numImagesForTraining, maxAvailableImagesPerClass);

  var labeledFaceDescriptors = await Promise.all(classes.map(async function (className) {
    var descriptors = [];
    for (var i = 1; i < numImagesForTraining + 1; i++) {
      var img = await faceapi.fetchImage(getFaceImageUri(className, i));
      descriptors.push((await faceapi.computeFaceDescriptor(img)));
    }

    return new faceapi.LabeledFaceDescriptors(className, descriptors);
  }));

  return new faceapi.FaceMatcher(labeledFaceDescriptors);
}