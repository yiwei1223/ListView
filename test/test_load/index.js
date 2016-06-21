$(function () {
  //列表初始化download
  $('.list_container').download({
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
      threshold: 0,
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
  });
});
