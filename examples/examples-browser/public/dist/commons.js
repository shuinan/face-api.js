'use strict';

async function requestExternalImage(imageUrl) {
  var res = await fetch('fetch_external_image', {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ imageUrl: imageUrl })
  });
  if (!(res.status < 400)) {
    console.error(res.status + ' : ' + (await res.text()));
    throw new Error('failed to fetch image from url: ' + imageUrl);
  }

  var blob = void 0;
  try {
    blob = await res.blob();
    return await faceapi.bufferToImage(blob);
  } catch (e) {
    console.error('received blob:', blob);
    console.error('error:', e);
    throw new Error('failed to load image from url: ' + imageUrl);
  }
}

function renderNavBar(navbarId, exampleUri) {
  var examples = [{
    uri: 'face_detection',
    name: 'Face Detection'
  }, {
    uri: 'face_landmark_detection',
    name: 'Face Landmark Detection'
  }, {
    uri: 'face_expression_recognition',
    name: 'Face Expression Recognition'
  }, {
    uri: 'age_and_gender_recognition',
    name: 'Age and Gender Recognition'
  }, {
    uri: 'face_recognition',
    name: 'Face Recognition'
  }, {
    uri: 'face_extraction',
    name: 'Face Extraction'
  }, {
    uri: 'video_face_tracking',
    name: 'Video Face Tracking'
  }, {
    uri: 'webcam_face_detection',
    name: 'Webcam Face Detection'
  }, {
    uri: 'webcam_1',
    name: 'Webcam  1'
  }, {
    uri: 'webcam_face_landmark_detection',
    name: 'Webcam Face Landmark Detection'
  }, {
    uri: 'webcam_face_expression_recognition',
    name: 'Webcam Face Expression Recognition'
  }, {
    uri: 'webcam_age_and_gender_recognition',
    name: 'Webcam Age and Gender Recognition'
  }, {
    uri: 'bbt_face_landmark_detection',
    name: 'BBT Face Landmark Detection'
  }, {
    uri: 'bbt_face_similarity',
    name: 'BBT Face Similarity'
  }, {
    uri: 'bbt_face_matching',
    name: 'BBT Face Matching'
  }, {
    uri: 'bbt_face_recognition',
    name: 'BBT Face Recognition'
  }, {
    uri: 'bbt_face_recognition_1',
    name: 'BBT Face Recognition more'
  }, {
    uri: 'batch_face_landmarks',
    name: 'Batch Face Landmark Detection'
  }, {
    uri: 'batch_face_recognition',
    name: 'Batch Face Recognition'
  }];

  var navbar = $(navbarId).get(0);
  var pageContainer = $('.page-container').get(0);

  var header = document.createElement('h3');
  header.innerHTML = examples.find(function (ex) {
    return ex.uri === exampleUri;
  }).name;
  pageContainer.insertBefore(header, pageContainer.children[0]);

  var menuContent = document.createElement('ul');
  menuContent.id = 'slide-out';
  menuContent.classList.add('side-nav', 'fixed');
  navbar.appendChild(menuContent);

  var menuButton = document.createElement('a');
  menuButton.href = '#';
  menuButton.classList.add('button-collapse', 'show-on-large');
  menuButton.setAttribute('data-activates', 'slide-out');
  var menuButtonIcon = document.createElement('img');
  menuButtonIcon.src = 'menu_icon.png';
  menuButton.appendChild(menuButtonIcon);
  navbar.appendChild(menuButton);

  var li = document.createElement('li');
  var githubLink = document.createElement('a');
  githubLink.classList.add('waves-effect', 'waves-light', 'side-by-side');
  githubLink.id = 'github-link';
  githubLink.href = 'https://github.com/justadudewhohacks/face-api.js';
  var h5 = document.createElement('h5');
  h5.innerHTML = 'face-api.js';
  githubLink.appendChild(h5);
  var githubLinkIcon = document.createElement('img');
  githubLinkIcon.src = 'github_link_icon.png';
  githubLink.appendChild(githubLinkIcon);
  li.appendChild(githubLink);
  menuContent.appendChild(li);

  examples.forEach(function (ex) {
    var li = document.createElement('li');
    if (ex.uri === exampleUri) {
      li.style.background = '#b0b0b0';
    }
    var a = document.createElement('a');
    a.classList.add('waves-effect', 'waves-light', 'pad-sides-sm');
    a.href = ex.uri;
    var span = document.createElement('span');
    span.innerHTML = ex.name;
    span.style.whiteSpace = 'nowrap';
    a.appendChild(span);
    li.appendChild(a);
    menuContent.appendChild(li);
  });

  $('.button-collapse').sideNav({
    menuWidth: 260
  });
}

function renderSelectList(selectListId, onChange, initialValue, renderChildren) {
  var select = document.createElement('select');
  $(selectListId).get(0).appendChild(select);
  renderChildren(select);
  $(select).val(initialValue);
  $(select).on('change', function (e) {
    return onChange(e.target.value);
  });
  $(select).material_select();
}

function renderOption(parent, text, value) {
  var option = document.createElement('option');
  option.innerHTML = text;
  option.value = value;
  parent.appendChild(option);
}