/**!
 * $upload.js 1.0.0 (c) 2016 Yi wei - MIT license
 * @desc 这是一个下拉、上拉加载库.依赖于zepto.js
 *       适用于移动端H5页面
 *
 */
;(function (w, $) {
    var Load = function () {
      // 版本号
      this.VERSION = '1.0.0';
      /**
       * @desc 初始化
       * @param  {[string]} type     [加载方式 download || upload]
       * @param  {[Zepto]} ListView  [加载列表：$('ul')]
       * @param  {[object]} conf     [初始化参数对象]
       */
      this.init = function (type, ListView, conf) {

      }
    };

    /**
     * @desc 上拉加载，扩展为Zepto方法
     * @param  {[object]} conf [参数配置]
     *         {
     *            request: function (cb) { // 加载请求函数 (cb为请求后的回调)
     *
     *            },
     *            content: { // 加载提示内容 ［可选］
     *            	innerHTML: '', // DOM结构 [可选]
     *            	text: ''// 加载提示文案 [可选]
     *            }
     *         }
     */
    $.fn.download = function (conf) {
      var me = $(this);
      return (function () {
          (new Load).init('download', me, conf);
      })();
    };
})(window, window.$ || Zepto);
