function setCaret() {
    var el = document.getElementById("editable")
    var range = document.createRange()
    var sel = window.getSelection()

    // range.setStart(el.childNodes[1].childNodes[0], el.childNodes[1].childNodes[0].textContent.length)
    range.selectNodeContents(el)
    range.collapse(false);

    sel.removeAllRanges()
    sel.addRange(range)
}
function getpos() {
    var el = document.getElementById("editable")
    getCurrentPosition(el);
}

function insert() {
    var el = document.getElementById("editable")

    var curPos = getCurrentPosition(el)
    if (curPos > 0) {

        var sel = window.getSelection();

        var range = createRange(el, { count: curPos });
        if (range) {
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            range = sel.getRangeAt(0);

            range.insertNode(document.createTextNode("ptsy"));

            setCurrentPosition(el, getCurrentPosition(el))
            el.focus();
        }


    }


}

function isChildOf(node, parentElement) {
    while (node !== null) {
        if (node === parentElement) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function getCurrentPosition(parentElement) {
    parentElement.childNodes[0].textContent = parentElement.childNodes[0].textContent.trim();
    const selection = document.getSelection();
    let chartCount = -1;
    let node;

    if (selection.focusNode) {
        if (this.isChildOf(selection?.focusNode, parentElement)) {
            node = selection.focusNode;
            chartCount = selection.focusOffset;
            while (node) {
                if (node === parentElement) {
                    break;
                }

                if (node.previousSibling) {
                    node = node.previousSibling;
                    chartCount += node.textContent?.length ?? 0;
                }
                else {
                    if (node.parentNode) {
                        node = node.parentNode;
                    }
                }
            }
        }
    }
    console.log(chartCount);
    return chartCount;
}


function createRange(node, chars, range) {
    try {
        if (!range) {
            if (node.nodeType == Node.TEXT_NODE) {
                range = document.createRange();
                range.selectNode(node);
                range.setStart(node, 0);
            }
        }
        if (chars.count == 0) {
            range.setEnd(node, 0);
        }
        else if (node && chars.count > 0) {
            if (node.nodeType == Node.TEXT_NODE) {
                const nodeLength = node.textContent?.length ?? 0;
                if (nodeLength < chars.count) {
                    chars.count -= nodeLength;
                }
                else {
                    range.setEnd(node, chars.count);
                    chars.count = 0;
                }
            }
            else {
                // tslint:disable-next-line:prefer-for-of
                for (let index = 0; index < node.childNodes.length; index++) {
                    range = this.createRange(node.childNodes[index], chars, range);
                    if (chars.count == 0) {
                        break;
                    }
                }
            }
        }

    } catch (error) {

    }
    return range;
}

function setCurrentPosition(parentElement, chars) {
    var sel = window.getSelection();

    var range = createRange(parentElement, { count: chars });
    if (range) {
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

}

