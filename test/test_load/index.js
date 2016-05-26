$(function () {
  //列表初始化download
  $('.list_container').download({
    request: function (cb) {
      setTimeout(function () {
        for (var i=0; i<2; i++) {
          $('<li>li_' + i +'</li>').prependTo($('.list'));
        }
        cb && cb();
      }, 3000);
    },
    content: {
      drop: {
        innerHTML: '松手后加载数据'
      },
      load: {
        innerHTML: '正在加载...'
      }
    }
  });
});
