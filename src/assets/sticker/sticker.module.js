var StickerConfig = [
  {
    Name: "tet",
    Prefix: "tet_",
    Number: 12
  },
  {
    Name: "buffalo",
    Prefix: "buffalo_",
    Number: 11
  },
  {
    Name: "meep",
    Icon: "Meep-icon",
    Prefix: "meep_",
    Number: 16
  },
  {
    Name: "minion",
    Prefix: "minion_",
    Number: 20
  },
  {
    Name: "meme",
    Prefix: "meme_",
    Number: 16
  }, {
    Name: "foxlove",
    Prefix: "foxlove_",
    Number: 16
  },
  {
    Name: "twodog",
    Prefix: "twodog_",
    Number: 16
  },
  {
    Name: "congrat",
    Prefix: "congrat_",
    Number: 29
  },
  {
    Name: "ghost",
    Prefix: "ghost_",
    Number: 14
  },
  {
    Name: "gao",
    Prefix: "gao_",
    Number: 20
  },
  {
    Name: "maruko",
    Prefix: "maruko_",
    Number: 20
  },
  {
    Name: "smalldog",
    Prefix: "smalldog_",
    Number: 16
  },
  {
    Name: "longhairgirl",
    Prefix: "longhairgirl_",
    Number: 8
  },
  {
    Name: "girl",
    Prefix: "girl_",
    Number: 14
  },
  {
    Name: "seal",
    Prefix: "seal_",
    Number: 8
  },
  {
    Name: "hipig",
    Prefix: "hipig_",
    Number: 13
  },
  {
    Name: "trashrobot",
    Prefix: "trashrobot_",
    Number: 8
  }
];

var StickerBox = APBASE.Class.extend(function () {
  var me = this;


  //Cấu hình cho misaluncher
  this.default = {
    renderTo: $("body"),


  };



  this.constructor = function (options) {
    me.opts = $.extend(me.default, options);
    me.createDom();
    me.initAction();
  }

  this.createDom = function () {
    $(".nf-sticker-box").remove();
    me.jObject = $(['<div class="nf-sticker-box" >',
      '<i class="icon-align"></i>',
      '<div class="nf-sticker-tab">',
      '<div class="icon icon-prev-page pointer"></div>',
      '<div class="wrapper-category flex-1">',

      '</div>',
      '<div class="icon icon-next-page pointer"></div>',
      '</div>',
      '<div class="nf-sticker-cards"> </div>',
      '</div>'].join(""));
    me.opts.renderTo.append(me.jObject);

    me.jListCategories = me.jObject.find(".wrapper-category").first();
    me.jCards = me.jObject.find(".nf-sticker-cards").first();
    me.Tabs = [];
    me.tickerConfigs = {};
    me.Cards = {};
    StickerConfig.forEach(function (c) {
      me.tickerConfigs[c.Name] = c;
    });




    for (var i = 0; i < 4; i++) {
      var tab = $("<div class='nf-sticker-tab-item'></div>");
      tab.attr("cate", i);
      me.Tabs.push(tab);
      me.jListCategories.append(tab);
    }
    me.isShowed = false;
    me.bindingSticker(0);
    me.activeTab(0);
  }


  this.bindingSticker = function (start) {
    me.startIndex = start;
    for (var i = start; i < start + 4; i++) {
      var tab = me.Tabs[i - start];
      var cate = StickerConfig[i];
      if (cate) {
        tab.attr("sticker-name", cate.Name);
      } else {
        tab.attr("sticker-name", "");
      }
    }

  }

  this.renderCard = function (tickerName) {
    var card = $("<div class='nf-sticker-card'></div>");
    card.attr("card-name", tickerName);
    me.Cards[tickerName] = card;
    var tickerConfig = me.tickerConfigs[tickerName];
    me.loadSticker(card, tickerConfig);
    me.jCards.append(card);
    return card;
  }


  this.loadSticker = function (card, config) {
    card.html("");
    for (var i = 1; i <= config.Number; i++) {
      var item = $("<div class='nf-sticker-item sticker'></div>");
      item.attr("st", config.Prefix + i);
      item.attr("cate", config.Name);
      card.append(item);
    }
  }

  this.onTabItemClick = function (e) {
    var target = $(e.target);
    me.jListCategories.find(".nf-sticker-tab-item.active").removeClass("active");
    target.addClass("active");
    me.showCategory(target.attr("sticker-name"));
  }
  this.activeTab = function (index) {
    var tab = me.Tabs[index];
    me.jListCategories.find(".nf-sticker-tab-item.active").removeClass("active");

    tab.addClass("active");


    me.showCategory(tab.attr("sticker-name"));
  }

  this.nextTab = function () {
    var activeTab = me.jListCategories.find(".nf-sticker-tab-item.active");
    var id = parseInt(activeTab.attr("cate"));
    if (id < 3) {
      me.activeTab(id + 1);
    } else {
      if (me.startIndex + 3 < StickerConfig.length - 1) {
        me.bindingSticker(me.startIndex + 1);
        me.activeTab(3);
      }
    }
  }

  this.prevTab = function () {
    var activeTab = me.jListCategories.find(".nf-sticker-tab-item.active");
    var id = parseInt(activeTab.attr("cate"));
    if (id > 0) {
      me.activeTab(id - 1);
    } else {
      if (me.startIndex > 0) {
        me.bindingSticker(me.startIndex - 1);
        me.activeTab(0);
      }
    }

  }

  this.showCategory = function (tickerName) {
    var card = me.Cards[tickerName];
    me.jObject.find(".nf-sticker-card").hide();
    if (!card) {
      card = me.renderCard(tickerName);
    }

    card.fadeIn(200);
  }

  this.toggle = function (trigger, onItemClick) {
    if (!me.isShowed) {
      me.showBox(trigger, onItemClick);
    } else {
      me.hideBox()
    }
  }

  this.hideBox = function () {
    if (me.jTrigger) {
      me.jTrigger.removeClass("open");
      delete me.jTrigger;

    }
    me.isShowed = false;
    delete me.onItemClick;

    me.jObject.fadeOut(100);

  }

  this.showBox = function (trigger, onItemClick) {
    me.jTrigger = $(trigger);
    me.isShowed = true;
    me.setPosition("right");
    me.onItemClick = onItemClick;

    me.jObject.fadeIn(100);
    me.jTrigger.addClass("open");


  }

  this.setPosition = function (position) {
    var elm = me.jTrigger[0],
      offset = elm.getBoundingClientRect(),
      elmHeight = offset.height,
      elmWidth = offset.width,
      popupHeight = me.jObject.outerHeight(),
      popupWidth = parseInt(me.jObject.width()),
      areaOffset = me.opts.renderTo[0].getBoundingClientRect(),
      bodyTop = areaOffset.top,
      bodyLeft = areaOffset.left,
      bodyHeight = areaOffset.height,
      bodyWidth = areaOffset.width;

    if (position === "left") {
      if (bodyWidth > popupWidth + offset.left) {
        me.jObject.css('left', offset.left);
      } else {
        me.jObject.css('left', bodyWidth - popupWidth);
      }

    } else {
      me.jObject.css('left', offset.left + elmWidth - popupWidth);
    }

    if (offset.top - popupHeight < 0) {
      me.jObject.css('top', offset.top + elmHeight + 4);
      me.jObject.removeClass("align-bottom");
    } else {
      me.jObject.css('top', offset.top - popupHeight - 2);
      me.jObject.addClass("align-bottom");

    }

    //if (bodyHeight + bodyTop > offset.top + elmHeight + popupHeight) {
    //    me.jObject.css('top', offset.top + elmHeight + 4);
    //    me.jObject.removeClass("align-bottom");
    //} else {
    //    me.jObject.css('top', offset.top - popupHeight - 2);
    //    me.jObject.addClass("align-bottom");
    //}
  }

  this.onSelectSticker = function (e) {
    var target = $(e.target);
    var stickerName = target.attr("st");
    var category = target.attr("cate");
    var stickerTeplate = '<i class="img-sticker sticker" st="' + stickerName + '">';
    typeof me.onItemClick == "function" && me.onItemClick(stickerTeplate, stickerName, category);
    me.hideBox();
  }

  this.initAction = function () {
    $("body").on("click", function (e) {
      var target = $(e.target);

      if (!me.jTrigger || me.jTrigger.length == 0) {
        me.hideBox();
      } else {
        if (!target.hasClass("nf-sticker-box") && target.parents(".nf-sticker-box").length == 0
          && target[0] != me.jTrigger[0] && me.jTrigger.find(target[0]).length == 0) {
          me.hideBox();
        }
      }

    });

    me.jObject.on("click", ".nf-sticker-tab-item", me.onTabItemClick.bind(me));

    me.jObject.on("click", ".nf-sticker-item", me.onSelectSticker.bind(me));

    me.jObject.on("click", ".icon-next-page", me.nextTab.bind(me));
    me.jObject.on("click", ".icon-prev-page", me.prevTab.bind(me));

  }

});

var stickerBoxAQ = new StickerBox();

var NewsfeedCommonFn = {};

(function (domhelper, window) {
  if (!domhelper) {
    window._domhelper = {};
    domhelper = window._domhelper;
  }
  domhelper.coords = function (element) {
    var box = element.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
      height: box.height,
      width: box.width
    };
  };
  domhelper.isVisible = function (element) {
    var style = window.getComputedStyle(element);
    return !(style.display === 'none');
  };
  domhelper.onScreen = function (element) {
    if (domhelper.isVisible(element)) {
      var coords = domhelper.coords(element);
      var checkVertical = (coords.top < window.screen.height && coords.top > 0) || (coords.top + coords.height < window.screen.height && coords.top + coords.height > 0);
      var checkHorizontal = (coords.left < window.screen.width && coords.left > 0) || (coords.left + coords.width < window.screen.width && coords.left + coords.width > 0);
      return {
        onScreen: checkVertical && checkHorizontal,
        top: coords.top,
        left: coords.left
      };
    } else {
      return false;
    }
  };

})(NewsfeedCommonFn, window);
