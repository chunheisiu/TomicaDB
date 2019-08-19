function search() {
  var keyword = getKeyword();
  var showCurrent = getCurrentFlag();
  if (isEmpty(keyword)) {
    var ls = getList();

    var elems, title;
    // Check if keyword is ID instead of name
    if (isInt(keyword)) {
      elems = getElemsByID(keyword);
    }
    else {
      elems = getElemsByText(keyword);
    }

    title = createTitle(keyword, showCurrent);
    addWell();

    if (elems.length < 1) {
      //removeWell();
      title = 'No match found for '+ title + '!';
    }
    else {
      if (showCurrent) {
        elems = filterCurrent(elems);
      }
      title = 'Showing ' + title + ':';
      createElem(ls, elems);
    }
    appendTitle(title);
    resetInput();
  }
}

function getKeyword() {
  var field = document.getElementById('keyword');
  var keyword = field.value;
  return keyword;
}

function getCurrentFlag() {
  var field = document.getElementById('showCurrent');
  var flag = field.checked;
  return flag;
}

function getList() {
  var ls = document.getElementById('result');
  while (ls.hasChildNodes()){
    ls.removeChild(ls.childNodes[0]);
  }
  return ls;
}

function appendTitle(title) {
  var field = document.getElementById('result-title');
  field.innerHTML = title;
}

function resetInput() {
  var keywordField = document.getElementById('keyword');
  var currentField = document.getElementById('showCurrent');
  keywordField.value = "";
  currentField.checked = false;
}

function addWell() {
  var box = document.getElementById('result-box');
  if (!box.classList.contains('well')) {
    box.classList.add('well');
  }
}

function removeWell() {
  var box = document.getElementById('result-box');
  box.classList.remove('well');
}

function filterCurrent(elems) {
  var i, len, id, elem, filterElem, prop;
  var filterElemObj = {};
  var filteredElems = [];
  len = elems.length;
  for (i = 0; i < len; i++) {
    elem = elems[i];
    id = elem.id;
    // If id does not exist in obj
    if (!filterElemObj.hasOwnProperty(id)) {
      filterElemObj[id] = {};
      filterElemObj[id].rev = elem.rev;
      filterElemObj[id].elem = elem;
    }
    // If id already exists in obj
    else {
      if (elem.rev >= filterElemObj[id].rev) {
        filterElemObj[id].rev = elem.rev;
        filterElemObj[id].elem = elem;
      }
    }
  } // End for loop
  for (prop in filterElemObj) {
    if (filterElemObj.hasOwnProperty(prop)){
      filterElem = filterElemObj[prop];
      filteredElems.push(filterElem.elem);
    }
  }
  return filteredElems;
}

function createTitle(keyword, showCurrent) {
  var title;
  var field = document.getElementById('result-title');
  var currentStr = showCurrent?'current':'all';
  var keywordStr = isInt(keyword)?'ID':'keyword';
  title = currentStr + ' models with ' + keywordStr + ' "' + keyword + '"';
  return title;
}

function createElem(ls, elems) {
  var li, i, elem, id, idField, title, titleField;
  var len = elems.length;
  for (i = 0; i < len; i++) {
    li = document.createElement('LI');

    idField = document.createElement('SPAN');
    idField.id = 'idField';
    titleField = document.createElement('SPAN');
    titleField.id = 'titleField';

    //elem = elems[i];   Replaced by cloning
    elem = Object.create(elems[i]);
    elem = addLimitedToName(elem);
    id = document.createTextNode(elem.id);
    title = document.createTextNode(elem.name);

    idField.appendChild(id);
    titleField.appendChild(title);
    li.appendChild(idField);
    li.appendChild(titleField);
    ls.appendChild(li);
  }
}

function getElemsByID(keyword) {
  var elems = [];
  var i, elem, id;
  var len = tomicaDB.length;
  for (i = 0; i < len; i++) {
    elem = tomicaDB[i];
    id = elem.id;
    if (id == keyword) {
      elems.push(elem);
    }
  }
  return elems;
}

function getElemsByText(keyword) {
  keyword = keyword.toLowerCase();
  var elems = [];
  var i, elem, name;
  var len = tomicaDB.length;
  for (i = 0; i < len; i++) {
    elem = tomicaDB[i];
    name = elem.name.toLowerCase();
    if (name.indexOf(keyword) > -1) {
      elems.push(elem);
    }
  }
  return elems;
}

function addLimitedToName(elem) {
  elem.name = elem.isLimited?(elem.name + ' (Limited Edition)'):elem.name;
  return elem;
}
