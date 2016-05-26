/**!
 * $upload.js 1.0.0 (c) 2016 Yi wei - MIT license
 * @desc 这是一个下拉、上拉加载库.依赖于zepto.js
 *       适用于移动端H5页面
 *
 */
;(function (w, $) {
  /**
   * @desc 私有对象，用于构建私有工具函数
   * @type {Object}
   */
  var _Util = {
    // 匹配html标签
    reg: /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

    DLDATA: {
      // 下拉加载默认样式
      DLCSS: {
        'text-align': 'center',
        'padding': '7% 0',
        'background': '#948F8F',
        'color': '#fff'
      },
      DOM: '',
      HEIGHT: 0,
      translateY: 0,
      startY: 0
    },
    /**
     * @desc 添加事件监听
     * @param  {[Zepto]} $dom      [监听对象]
     * @param  {[String]} eventType [事件名称]
     * @param  {[Function]} listener  [监听函数]
     */
    listen: function ($dom, eventType, listener) {
      $($dom).on(eventType, listener);
    },

    listenDL: function ($dom) {
      var that = this;
      that.listen($dom, 'touchstart', function (ev) {
        var touch = ev.touches[0] || ev.changedTouches[0];
        that.DLDATA.startY = touch.clientY;
      });

      that.listen($dom, 'touchmove', function (ev) {
        var touch = ev.touches[0] || ev.changedTouches[0];
        that.DLDATA.translateY = (-74 + touch.clientY - that.DLDATA.startY)/5;
        that.transformDLDOM($dom);
      });

      that.listen($dom, 'touchend', function (ev) {

      });
    },

    /**
     * @desc 初始化下拉加载DOM结构，主要是添加加载文案结构
     * @param  {[Zepto]} $dom [list列表]
     * @param  {[Object]} conf [配置参数对象]
     */
    initDLDOM: function ($dom, conf) {
      var hasDropTag = conf.content.drop && this.reg.test(conf.content.drop.innerHTML),
          hasDropNTag = conf.content.drop && !this.reg.test(conf.content.drop.innerHTML)
      this.DLDATA.DOM = hasDropTag
                  ? conf.content.drop.innerHTML
                  : (hasDropNTag ? ('<div>' + conf.content.drop.innerHTML + '</div>') : ('<div>' + '松手后加载数据!' + '</div>'));
      if (!this.reg.test(conf.content.drop.innerHTML)) {
        $(this.DLDATA.DOM).css(this.DLDATA.DLCSS).attr('id', 'load_download').prependTo($($dom));
      } else {
        $(this.DLDATA.DOM).attr('id', 'load_download').prependTo($($dom));
      }
      // 计算拉加载提示DOM高度
      this.DLDATA.HEIGHT = $('#load_download').height();
      this.DLDATA.translateY = -this.DLDATA.HEIGHT;
      // 初始化隐藏加载提示DOM
      this.transformDLDOM($dom);
    },

    /**
     * @desc 列表在Y轴上translate
     * @param  {[type]} $dom [列表对象]
     */
    transformDLDOM: function ($dom) {
      $($dom).css({
        'transition-property': 'transform',
        'transform-origin': '0px 0px 0px',
        'transform': 'translate3d(0, ' +  this.DLDATA.translateY + 'px, 0) scale(1)',
        '-webkit-transform': 'translate3d(0, ' +  this.DLDATA.translateY + 'px, 0) scale(1)'
      });
    }
  };


  /**
   * @desc Load Object
   * @param  {[string]} type     [加载方式 download || upload]
   * @param  {[Zepto]} LV  [加载列表：$('ul')]
   * @param  {[object]} conf     [初始化参数对象]
   */
  var Load = function (type, LV, conf) {
    this.type = type;
    this.conf = conf;
    this.LV = LV;
  };

  /**
   * @desc overwrite Load.prototype
   * @type {Object}
   */
  Load.prototype = {
    // 重写prototype改变了constructor的指向，强制指向Load
    constructor: Load,
    /**
     * @desc 初始化
     */
    init: function () {
      if (!this.LV.find('ul').length) {
        console.error('dom结构错误，结构必须为：<tag><ul></ul></tag>');
        return -1;
      }
      switch (this.type) {
        case 'download':
          this.download && this.download();
          break;
        case 'upload':
          this.upload && this.upload();
          break;
      }
    },

    /**
     * @desc 下拉加载
     */
    download: function () {
      // 初始化DOM结构
      _Util.initDLDOM && _Util.initDLDOM(this.LV, this.conf);
      // 为列表添加下拉事件监听
      _Util.listenDL && _Util.listenDL(this.LV);
    }
  };


  /**
   * @desc 上拉加载，扩展为Zepto方法
   *       注意： 调用此方法的dom结构必须为列表的父节点（即：<ul/>外围必须包一层）
   * @param  {[object]} conf [参数配置]
   *         {
   *         		request: function (cb) { // 下拉松手后执行，主要是请求数据，添加数据到dom
   *         			//cb 为request执行完毕后的回调，主要用于提示用户加载成功或失败
   *         		},
   *         		content: {
   *         			drop: { // 手指下拉列表不松手时展示的提示［可选参数］
   *         				innerHTML: '' //可以为dom结构或纯文字
   *         			},
   *         			load: { // 手指下拉列表松手时展示的提示［可选参数］
   *         				innerHTML: '' //可以为dom结构或纯文字
   *         			}
   *         		}
   *         }
   */
  $.fn.download = function (conf) {
    var me = $(this);
    return (function () {
      (new Load('download', me, conf)).init();
    })();
  };
})(window, window.$ || Zepto);
