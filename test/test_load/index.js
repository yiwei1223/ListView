$(function () {
  //列表初始化pullRefresh
  /*$('.list_container').pullRefresh({
    cb: function (cb) {
      setTimeout(function () {
        for (var i=0; i < 2; i++) {
          $('<li>li_' + i +'</li>').prependTo($('.list'));
        }
        // 这是从库中传回的回调, 执行它的处理加载loading
        cb && cb();
      }, 5000);
    },
    config: {
      threshold: 100,
      warp: $('body'),
      drop: {
        innerHTML: '松手后加载数据'
      },
      load: {
        warpCSS: {
          'position': 'relative',
          'padding': '12% 0'
        },
        innerHTML: [
          '<div class="load-warp">',
          '<div class="loading"></div>',
          '<p class="loading-desc">正在加载中...</p>',
          '</div>'
        ].join('')
      }
    }
  });*/

  //列表初始化upload
  $('.list_container').upload({
    cb: function (cb) {
      setTimeout(function () {
        for (var i=0; i < 2; i++) {
          $('<li>li_' + i +'</li>').appendTo($('.list'));
        }
        // 这是从库中传回的回调, 执行它的处理加载loading
        cb && cb();
      }, 5000);
    },
    config: {
      threshold: 10,
      box: $(window),
      /*type: 'normal',*/
      warp: $('body'),
      drop: {
        innerHTML: '松手后加载数据'
      },
      load: {
        warpCSS: {
          'padding': '10% 0'
        },
        innerHTML: [
          '<div class="load-warp">',
          '<div class="loading"></div>',
          '<p class="loading-desc">正在加载中...</p>',
          '</div>'
        ].join('')
      }
    }
  });
});
