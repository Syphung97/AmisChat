var APHashTag = {};
APHashTag.Version = "1.0.18";
(function($, exports) {
    var SPACE_ENCODED = "&nbsp;";
    var HASHTAG_CLASS = "hashtag";
    var START_HASHTAG = "{#hashtag#}";
    var END_HASHTAG = "{#endhashtag#}";
    var HASHTAG_TAGNAME = "span";

    function getCurrentCursorPosition(parentElement) {
        var selection = window.getSelection(),
            charCount = -1,
            node;
        if (selection.focusNode) {
            if (isChildOf(selection.focusNode, parentElement)) {
                node = selection.focusNode;
                charCount = selection.focusOffset;
                while (node) {
                    if (node === parentElement) {
                        break;
                    }
                    if (node.previousSibling) {
                        node = node.previousSibling;
                        charCount += node.textContent.length;
                    } else {
                        node = node.parentNode;
                        if (node === null) {
                            break;
                        }
                    }
                }
            }
        }
        return charCount;
    }

    function setCurrentCursorPosition(chars, element) {
        try {
            if (chars >= 0) {
                var selection = window.getSelection();
                var range = createRange(element, {
                    count: chars
                });
                if (range) {
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    function secure(value) {
        var t = value + "";
        var dv = document.createElement("div");
        dv.innerHTML = t;
        let nodes = dv.querySelectorAll("*");
        nodes.forEach(function(t) {
            t.removeAttribute("onmouseover");
            t.removeAttribute("onmouseenter");
            t.removeAttribute("onmouseleave");
            t.removeAttribute("onclick");
            t.removeAttribute("onerror");
            t.removeAttribute("onfocus");
            t.removeAttribute("autofocus");
            t.removeAttribute("onstart");
            t.removeAttribute("onload");
        })
        t = dv.innerHTML;
        t = t.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "").replace(/(?:<style.*?>)((\n|\r|.)*?)(?:<\/style>)/ig, "").replace(/(?:<link([^>]*)?\/>)/ig, "").replace(/(?:<meta.*?>)/ig, "");
        dv = null;
        return t;
    }

    function decodeHTML(value) {
        var t = value + "";
        var txt = document.createElement("textarea");
        txt.innerHTML = t;
        t = txt.value;
        return t;
    }

    function encodeHTML(value) {
        var t = value;
        var txt = document.createElement("textarea");
        txt.innerHTML = t;
        t = txt.innerHTML;
        txt = null;
        return t;
    }

    function createRange(node, chars, range) {
        try {
            if (!range) {
                if (node.nodeType === Node.TEXT_NODE) {
                    range = document.createRange()
                    range.selectNode(node);
                    range.setStart(node, 0);
                }
            }
            if (chars.count === 0) {
                range.setEnd(node, chars.count);
            } else if (node && chars.count > 0) {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (node.textContent.length < chars.count) {
                        chars.count -= node.textContent.length;
                    } else {
                        range.setEnd(node, chars.count);
                        chars.count = 0;
                    }
                } else {
                    for (var lp = 0; lp < node.childNodes.length; lp++) {
                        range = createRange(node.childNodes[lp], chars, range);
                        if (chars.count === 0) {
                            break;
                        }
                    }
                }
            }
        } catch (ex) {
            console.log(ex);
        }
        return range;
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

    function getFocusElement() {
        var focusNode = null;
        if (window.getSelection) {
            focusNode = window.getSelection().focusNode;
        } else if (document.selection) {
            focusNode = document.selection().focusNode;
        }
        if (focusNode) return $(focusNode.parentNode);
        return null;
    }

    function getText(element) {
        var value = element.text();
        value = nomalizeSpace(value);
        return value;
    }

    function setCaretPosition(el, caretPos) {
        setCurrentCursorPosition(caretPos, el);
        el.focus();
    }

    function focusToEnd(element) {
        $(element).focus();
        execCommand('selectAll', null);
        collapseSelectionEnd();
    }

    function saveSelection() {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.rangeCount > 0)
                return sel.getRangeAt(0);
        } else if (document.selection) {
            var sel = document.selection;
            return sel.createRange();
        }
        return null;
    }

    function getTag(value, selection) {
        var rsi = matchHasTag(value);
        var stop = false;
        var arr = [];
        var offset = selection.endOffset;
        while (!stop) {
            a = rsi.next();
            if (a && !a.done) {
                var t = {
                    value: a.value[0],
                    index: a.value.index,
                    hashtag: true
                };
                if (a.value[0][0] == " ") {
                    t.value = t.value.substr(1);
                    t.index = t.index + 1;
                }
                arr.push(t);
            } else {
                stop = true;
            }
        }
        if (arr.length == 0) {
            return [];
        }
        var fullarr = [];
        if (arr[0].index > 0) fullarr.push({
            index: 0
        });
        for (var i = 0; i < arr.length; i++) {
            fullarr.push(arr[i]);
            fullarr.push({
                index: arr[i].index + arr[i].value.length
            })
        }
        if (arr[arr.length - 1].index < value.length - 1) fullarr.push({
            index: value.length
        });
        var splitArr = [];
        for (var i = 0; i < fullarr.length - 1; i++) {
            var text = value.substr(fullarr[i].index, fullarr[i + 1].index - fullarr[i].index);
            var isFocus = offset >= fullarr[i].index && offset <= fullarr[i + 1].index
            if (text.length > 0) {
                var item = null;
                if (fullarr[i].hashtag) {
                    item = createHashTag(text, isFocus);
                } else {
                    item = createTag(text, isFocus);
                }
                splitArr.push(item);
            }
        }
        return splitArr;
    }

    function createHashTag(text, isFocus) {
        if (isFocus) {
            return "<" + HASHTAG_TAGNAME + " class='" + exports.HashTagClass + "' focus='true'>" + text + "</" + HASHTAG_TAGNAME + ">";
        } else {
            return "<" + HASHTAG_TAGNAME + " class='" + exports.HashTagClass + "'>" + text + "</" + HASHTAG_TAGNAME + ">";
        }
    }

    function createTag(text, isFocus) {
        if (text[0] == " ") {
            text = SPACE_ENCODED + text.substr(1);
        }
        if (text[text.length - 1] == " ") {
            text = text.substr(0, text.length - 1) + SPACE_ENCODED;
        }
        if (isFocus) {
            return "<" + HASHTAG_TAGNAME + " focus='true'>" + text + "</" + HASHTAG_TAGNAME + ">";
        } else {
            return "<" + HASHTAG_TAGNAME + ">" + text + "</" + HASHTAG_TAGNAME + ">";
        }
    }

    function checkJoinAfter(tag) {
        var updateCaret = false;
        var next = tag.next();
        if (next.length > 0 && !$(next[0]).is("div")) {
            var f = $(next[0]);
            var fval = f.html();
            var ftext = getText(f);
            if (fval.indexOf("#") != 0 && ftext != " " && fval.indexOf(" ") != 0 && fval.indexOf(SPACE_ENCODED) != 0) {
                var text = tag.text();
                var farr = ftext.split(" ");
                if (farr.length > 0) {
                    text += farr[0];
                    farr[0] = "";
                    next.html(SPACE_ENCODED + farr.join(SPACE_ENCODED));
                    tag.html(text);
                } else {
                    text += ftext;
                    next.remove();
                    tag.html(text);
                }
                updateCaret = true;
            }
        }
        return updateCaret;
    }

    function checkLastSpace(text) {
        if (!text) return false;
        var arr = text.split(" ");
        return arr.length > 0 && (arr[arr.length - 1] == " " || arr[arr.length - 1] == SPACE_ENCODED);
    }

    function doUpdateTag(e, focusNode, contentEditable, currentCaret) {
        var focusText = getText(focusNode);
        var arr = getTag(focusText, saveSelection());
        var checkAfter = false;
        if (arr.length > 0) {
            if (arr.length == 1 && $(arr[0]).text() == focusText) {
                if ($(arr[0]).is("." + HASHTAG_CLASS)) {
                    focusNode.addClass(HASHTAG_CLASS);
                } else {
                    focusNode.removeClass(HASHTAG_CLASS)
                }
                updateCaret = false;
                checkAfter = true;
            } else {
                var lst = arr.map(function(m) {
                    return $(m);
                });
                var lastappend = focusNode;
                for (var id = 0; id < lst.length; id++) {
                    var d = lst[id];
                    if (id == 0) {
                        if (focusNode.is("div")) {
                            focusNode.html(d);
                        } else {
                            if (d.is("." + HASHTAG_CLASS)) {
                                focusNode.addClass(HASHTAG_CLASS);
                            }
                            focusNode.html(d.html());
                        }
                    } else {
                        if (focusNode.is("div")) {
                            focusNode.append(d);
                        } else {
                            lastappend.after(d);
                        }
                        lastappend = d;
                    }
                }
            }
            $(contentEditable).find("[focus]").removeAttr("focus");
            if (checkAfter && focusNode.is("." + HASHTAG_CLASS)) {
                var ismerge = checkJoinAfter(focusNode);
                if (ismerge) updateCaret = true;
            }
            if (e.which != 13) {
                setCaretPosition(contentEditable, currentCaret);
            }
        } else {
            focusNode.removeClass(HASHTAG_CLASS).removeAttr("style");
            if (e.which == 8) {
                var next = focusNode.next();
                if (next.length > 0) {
                    var f = $(next[0]);
                    if (f.is("." + HASHTAG_CLASS)) {
                        if (f.text().indexOf("#") != 0) {
                            f.removeClass(HASHTAG_CLASS);
                        }
                    }
                    if (checkLastSpace(focusText)) {
                        var cText = focusText + f.text();
                        var arr = getTag(cText, saveSelection());
                        var lst = arr.map(function(m) {
                            return $(m);
                        });
                        var lastappend = focusNode;
                        if (arr.length > 0) {
                            for (var id = 0; id < lst.length; id++) {
                                var d = lst[id];
                                if (id == 0) {
                                    if (focusNode.is("div")) {
                                        focusNode.html(d);
                                    } else {
                                        if (d.hasClass(HASHTAG_CLASS)) {
                                            focusNode.addClass(HASHTAG_CLASS);
                                        }
                                        focusNode.html(d.html());
                                    }
                                } else {
                                    if (focusNode.is("div")) {
                                        focusNode.append(d);
                                    } else {
                                        lastappend.after(d);
                                    }
                                    lastappend = d;
                                }
                            }
                        } else {
                            focusNode.text(cText);
                            f.replaceWith("");
                        }
                        setCaretPosition(contentEditable, currentCaret);
                    }
                }
            }
        }
    }

    function isCharacterKeyPress(evt) {
        if (typeof evt.which == "undefined") {
            return true;
        }
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && (evt.which < 37 || evt.which > 40);
    }

    function processContent(e, contentEditable) {
        var text = $(contentEditable).html();
        var currentCaret = getCurrentCursorPosition(contentEditable);
        if ($(contentEditable).text().length == 0) {
            $(contentEditable).html("");
            document.execCommand("removeFormat", false, "#000");
            document.execCommand("foreColor", false, "#000");
        } else {
            if ((text && (!contentEditable.oldText || contentEditable.oldText != text)) || e.type == "paste") {
                if ($(contentEditable).children.length == 0) {
                    $(contentEditable).html(createTag(text));
                } else {
                    replaceWithSpan(contentEditable, currentCaret, e);
                    if ($(contentEditable).text().length > 1) {
                        var focusNode = getFocusElement();
                        if (focusNode && focusNode.parents("[contenteditable]").length == 1) {
                            if (focusNode.is("div")) {
                                if (focusNode.children().length == 0) {
                                    var t = getText(focusNode);
                                    focusNode.html(createTag(t));
                                    if (e.which != 13) {
                                        setCaretPosition(contentEditable, currentCaret);
                                    }
                                } else {
                                    focusNode.find("div").each(function(id, d) {
                                        var item = $(d);
                                        if (item.children().length == 0) {
                                            var t = getText(item);
                                            focusNode.html(createTag(t));
                                        }
                                    })
                                }
                            }
                            doUpdateTag(e, focusNode, contentEditable, currentCaret);
                        }
                    }
                }
            }
        }
    }

    function replaceWithSpan(contentEditable, currentCaret, e) {
        var body = $("<body>" + contentEditable.innerHTML + "</body>");
        if (body.filter(function(d) {
                return body[d].nodeName == "#text"
            }).length > 0) {
            body.each(function(id, d) {
                if (d.nodeName == "#text") {
                    body[id] = $("<span>" + d.textContent + "</span>")[0];
                }
            });
            var a = $("<div></div>");
            a.append(body);
            contentEditable.innerHTML = a.html();
            if (e.which != 13) {
                setCaretPosition(contentEditable, currentCaret);
            }
        }
    }

    function nomalizeSpace(value) {
        value = encodeURIComponent(value);
        value = value.split("%C2%A0").join("%20");
        value = decodeURIComponent(value);
        return value;
    }

    function matchHasTag(value) {
        value = nomalizeSpace(value);
        var rsi = value.matchAll(/(^#| #)([0-9_]{0,}?)([a-zẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]{1,})([a-zẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ0-9_]{0,})/gi);
        return rsi;
    }
    exports.getTag = function(text) {
        var a = $("<div></div>");
        a.html(text);
        var value = a.text();
        var rsi = matchHasTag(value);
        var stop = false;
        var arr = [];
        while (!stop) {
            a = rsi.next();
            if (a && !a.done) {
                arr.push(a.value[0].trim());
            } else {
                stop = true;
            }
        }
        a = null;
        delete a;
        return arr;
    }
    exports.isHashTag = function(value) {
        var regexp = /^#([0-9_]{0,}?)([a-zẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]{1,})([a-zẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ0-9_]{0,})$/gi;
        return regexp.test(value);
    }
    exports.findTags = function(value) {
        var rsi = matchHasTag(value);
        var stop = false;
        var arr = [];
        while (!stop) {
            a = rsi.next();
            if (a && !a.done) {
                var t = {
                    value: a.value[0],
                    index: a.value.index,
                    hashtag: true
                };
                if (a.value[0][0] == " ") {
                    t.value = t.value.substr(1);
                    t.index = t.index + 1;
                }
                arr.push(t);
            } else {
                stop = true;
            }
        }
        if (arr.length == 0) {
            return value;
        }
        var fullarr = [];
        if (arr[0].index > 0) fullarr.push({
            index: 0
        });
        for (var i = 0; i < arr.length; i++) {
            fullarr.push(arr[i]);
            fullarr.push({
                index: arr[i].index + arr[i].value.length
            })
        }
        if (arr[arr.length - 1].index < value.length - 1) fullarr.push({
            index: value.length
        });
        var splitArr = [];
        for (var i = 0; i < fullarr.length - 1; i++) {
            var text = value.substr(fullarr[i].index, fullarr[i + 1].index - fullarr[i].index);
            if (text.length > 0) {
                var item = null;
                if (fullarr[i].hashtag) {
                    item = createHashTag(text);
                } else {
                    item = createTag(text);
                }
                splitArr.push(item);
            }
        }
        return splitArr.join("");
    }
    exports.encodeTag = function(value, startkey, endkey, tagClass) {
        if (!value) return "";
        if (!startkey) startkey = START_HASHTAG;
        if (!endkey) endkey = END_HASHTAG;
        if (!tagClass) tagClass = HASHTAG_CLASS;
        var div = $("<div></div");
        div.html(value);
        var selector = "." + tagClass;
        div.find(selector).each(function(id, item) {
            var tag = $(item);
            var text = tag.text();
            tag.replaceWith(startkey + text + endkey);
        });
        var val = div.html();
        div = null;
        delete div;
        return val;
    }
    exports.decodeTag = function(value, startkey, endkey, tagClass) {
        if (!value) return "";
        if (!startkey) startkey = START_HASHTAG;
        if (!endkey) endkey = END_HASHTAG;
        if (!tagClass) tagClass = HASHTAG_CLASS;
        value = value.split(startkey).join("<" + HASHTAG_TAGNAME + " class='" + tagClass + "'>");
        value = value.split(endkey).join("</" + HASHTAG_TAGNAME + ">");
        value = decodeHTML(value);
        value = secure(value);
        return value;
    }
    exports.define = function(element, startkey, endkey, tagClass) {
        if (!startkey) startkey = START_HASHTAG;
        if (!endkey) endkey = END_HASHTAG;
        if (!tagClass) tagClass = HASHTAG_CLASS;
        exports.Startkey = startkey;
        exports.Endkey = endkey;
        exports.HashTagClass = tagClass;
        var $element = $(element);
        if (element.tagName.toLowerCase() == "div") {
            $element.unbind("keydown.htag").on("keydown.htag", function(e) {
                this.oldText = $(this).html();
            });
            $element.unbind("keyup.htag").on("keyup.htag", function(e) {
                try {
                    if (isCharacterKeyPress(e) || (e.which == 86 && e.ctrlKey)) {
                        processContent(e, this);
                    }
                } catch (ex) {
                    console.log(ex);
                }
            });
            element.addEventListener("paste", function(e) {
                try {
                    e.stopPropagation();
                    e.preventDefault();
                    var clip = (e.originalEvent || e).clipboardData || window.clipboardData;
                    var s = "";
                    if (clip.types.indexOf("text/html") > 0 && clip.types.indexOf("text/rtf") == -1) {
                        var pasteData = clip.getData("text/html");
                        pasteData = secure(pasteData);
                        var eles = $(pasteData);
                        var html = eles.filter(function(d) {
                            return eles[d].nodeName != "#comment";
                        });
                        html.each(function(id, d) {
                            if (d.nodeName == "#text") {
                                html[id] = $("<span>" + d.textContent + "</span>")[0];
                            }
                        });
                        var a = $("<div></div>");
                        a.append(html);
                        var check = {};
                        a.find("b").each(function(id, it) {
                            check.hasBold = true;
                            var item = $(it);
                            item.replaceWith("{#bold#}" + item.text() + "{#endbold#}");
                        });
                        a.find("br").each(function(id, it) {
                            check.hasBr = true;
                            var item = $(it);
                            item.replaceWith("{#br#}");
                        });
                        a.find("i").each(function(id, it) {
                            check.hasItalic = true;
                            var item = $(it);
                            item.replaceWith("{#italic#}" + item.text() + "{#enditalic#}");
                        });
                        a.find("img").replaceWith("");
                        a.find("span").each(function(id, it) {
                            var item = $(it);
                            if (exports.isHashTag(item.text())) {
                                check.hasHasTag = true;
                                item.replaceWith(exports.Startkey + item.text() + exports.Endkey);
                            } else {
                                check.hasSpan = true;
                                item.replaceWith("{#text#}" + item.text() + "{#endtext#}");
                            }
                        });
                        a.find("p").each(function(id, it) {
                            check.hasBr = true;
                            var item = $(it);
                            item.replaceWith("{#br#}" + item.text());
                        });
                        a.find("div").each(function(id, it) {
                            check.hasBr = true;
                            var item = $(it);
                            item.replaceWith("{#br#}" + item.html());
                        });
                        s = a.text();
                        if (check.hasItalic) {
                            s = s.split("{#italic#}").join("<i>");
                            s = s.split("{#enditalic#}").join("</i>");
                        }
                        if (check.hasHasTag) {
                            s = s.split(exports.Startkey).join("<" + HASHTAG_TAGNAME + " class='" + exports.HashTagClass + "'>");
                            s = s.split(exports.Endkey).join("</" + HASHTAG_TAGNAME + ">");
                        }
                        if (check.hasSpan) {
                            s = s.split("{#text#}").join("<span>");
                            s = s.split("{#endtext#}").join("</span>");
                        }
                        if (check.hasBr) {
                            s = s.split("{#br#}").join("</br>");
                        }
                        if (check.hasBold) {
                            s = s.split("{#bold#}").join("<b>");
                            s = s.split("{#endbold#}").join("</b>");
                        }
                        s = exports.findTags(s);
                    } else {
                        s = clip.getData("text/plain");
                        s = encodeHTML(s);
                        var row = s.split("\n");
                        var arr = row.map(function(txt) {
                            if (txt) {
                                txt = exports.findTags(txt);
                            } else {
                                txt = "";
                            }
                            return txt;
                        });
                        s = arr.filter(function(d) {
                            return d != ""
                        }).join("<br>");
                    }
                    delete a;
                    document.execCommand("insertHTML", false, s);
                } catch (ex) {
                    console.log(ex);
                }
            });
        } else {
            console.error("Chỉ hỗ trợ div contenteditable");
        }
    };
}(typeof jQuery != 'undefined' ? jQuery : null, APHashTag));