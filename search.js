function search() {
    const keyword = getKeyword();
    const showCurrent = getCurrentFlag();
    if (isEmpty(keyword)) {
        const ls = getList();

        let elems, title;
        // Check if keyword is ID instead of name
        if (isInt(keyword)) {
            elems = getElemsByID(keyword);
        } else {
            elems = getElemsByText(keyword);
        }

        title = createTitle(keyword, showCurrent);
        addWell();

        if (elems.length < 1) {
            //removeWell();
            title = 'No match found for ' + title + '!';
        } else {
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
    const field = document.getElementById('keyword');
    return field.value;
}

function getCurrentFlag() {
    const field = document.getElementById('showCurrent');
    return field.checked;
}

function getList() {
    const ls = document.getElementById('result');
    while (ls.hasChildNodes()) {
        ls.removeChild(ls.childNodes[0]);
    }
    return ls;
}

function appendTitle(title) {
    const field = document.getElementById('result-title');
    field.innerHTML = title;
}

function resetInput() {
    const keywordField = document.getElementById('keyword');
    const currentField = document.getElementById('showCurrent');
    keywordField.value = "";
    currentField.checked = false;
}

function addWell() {
    const box = document.getElementById('result-box');
    if (!box.classList.contains('well')) {
        box.classList.add('well');
    }
}

function filterCurrent(elems) {
    let i, len, id, elem, filterElem, prop;
    const filterElemObj = {};
    const filteredElems = [];
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
        if (filterElemObj.hasOwnProperty(prop)) {
            filterElem = filterElemObj[prop];
            filteredElems.push(filterElem.elem);
        }
    }
    return filteredElems;
}

function createTitle(keyword, showCurrent) {
    let title;
    const currentStr = showCurrent ? 'current' : 'all';
    const keywordStr = isInt(keyword) ? 'ID' : 'keyword';
    title = currentStr + ' models with ' + keywordStr + ' "' + keyword + '"';
    return title;
}

function createElem(ls, elems) {
    let li, i, elem, id, idField, title, titleField;
    const len = elems.length;
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
    const elems = [];
    let i, elem, id;
    const len = tomicaDB.length;
    for (i = 0; i < len; i++) {
        elem = tomicaDB[i];
        id = elem.id;
        if (id === parseInt(keyword)) {
            elems.push(elem);
        }
    }
    return elems;
}

function getElemsByText(keyword) {
    keyword = keyword.toLowerCase();
    const elems = [];
    let i, elem, name;
    const len = tomicaDB.length;
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
    elem.name = elem.isLimited ? (elem.name + ' (Limited Edition)') : elem.name;
    return elem;
}
