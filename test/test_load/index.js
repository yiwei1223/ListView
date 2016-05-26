$(function () {
  // 请求的回调
  function cb() {

  }

  //列表初始化download
  $('.list_container').download({
    request: function (cb) {

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
