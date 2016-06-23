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
    DLDATA: {
      // 下拉加载默认样式
      DLCSS: {
        defaultCSS: {
          'text-align': 'center',
          'padding': '7% 0',
          'background': '#948F8F',
          'color': '#fff'
        },
        drop: {},
        load: {}
      },
      threshold: {
        download: 0,
        upload: 0
      },
      DROP: '',
      LOAD: '',
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

    /**
     * @desc 处理下拉加载事件监听
     * @param  {[Zepto]} $dom [监听对象]
     * @param  {[Object]} conf [参数对象]
     */
    listenDL: function ($dom, conf) {
      var that = this,
          warp = $(conf.config.warp).get(0);
      that.listen($dom, 'touchstart', function (ev) {
        var touch = ev.touches[0] || ev.changedTouches[0];
        that.DLDATA.startY = touch.clientY;
      });
      that.listen($dom, 'touchmove', function (ev) {
        var touch = ev.touches[0] || ev.changedTouches[0];
        if ((touch.clientY - that.DLDATA.startY < that.DLDATA.threshold.download) || warp.scrollTop > 0) {
          // 向下滑动不做处理
          return -1;
        }
        that.DLDATA.translateY = (-that.DLDATA.HEIGHT + touch.clientY - that.DLDATA.startY)/2;
        that.transformDLDOM($dom);

        //解决安卓上touchmove只触发1次或者2次的bug
        return false;
      });

      that.listen($dom, 'touchend', function (ev) {
        var touch = ev.touches[0] || ev.changedTouches[0],
            load_warp = $('#load_download_warp');
        if ((touch.clientY - that.DLDATA.startY <= that.DLDATA.threshold.download) || warp.scrollTop > 0) {
          return -1;
        }
        // 放手后修改提示内容
        load_warp.html(that.DLDATA.LOAD).css(that.DLDATA.DLCSS.load);
        that.DLDATA.translateY = 0;
        that.transformDLDOM($dom, '.3s');
        conf.cb && conf.cb(function () {
          load_warp.html(that.DLDATA.DROP).css(that.DLDATA.DLCSS.drop);
          that.DLDATA.translateY = - that.DLDATA.HEIGHT;
          load_warp.html(that.DLDATA.DROP);
          that.transformDLDOM($dom, '.3s');
        });
      });
    },

    /**
     * @desc 初始化下拉加载DOM结构，主要是添加加载文案结构
     * @param  {[Zepto]} $dom [list列表]
     * @param  {[Object]} conf [配置参数对象]
     */
    initDLDOM: function ($dom, conf) {
      // 初始化下拉加载相关css
      $.extend(this.DLDATA.DLCSS.drop, this.DLDATA.DLCSS.defaultCSS, conf.config.drop.warpCSS);
      $.extend(this.DLDATA.DLCSS.load, this.DLDATA.DLCSS.defaultCSS, conf.config.load.warpCSS);

      // 初始化滑动阀值
      conf.config.threshold && $.extend(this.DLDATA.threshold, {
        download: conf.config.threshold
      });

      // 初始化下拉加载提示DOM 结构
      this.DLDATA.DROP = conf.config.drop && conf.config.drop.innerHTML != '' ? conf.config.drop.innerHTML : '松手后加载数据!';
      this.DLDATA.LOAD = conf.config.load && conf.config.load.innerHTML != '' ? conf.config.load.innerHTML : '正在加载数据!';
      this.DLDATA.DROP = "<div id='load_download_warp'>" + this.DLDATA.DROP + "</div>";

      // 初始化DOM
      $(this.DLDATA.DROP).css(this.DLDATA.DLCSS.drop).prependTo($($dom));
      // 计算拉加载提示DOM高度
      this.DLDATA.HEIGHT = $('#load_download_warp').height();
      this.DLDATA.translateY = -this.DLDATA.HEIGHT;
      // 初始化隐藏加载提示DOM
      this.transformDLDOM($dom);
    },

    /**
     * @desc 列表在Y轴上translate
     * @param  {[Zepto]} $dom [列表对象]
     * @param {{String}} delay [transform执行时间]
     */
    transformDLDOM: function ($dom, delay) {
      $($dom).css({
        'transition': 'transform ' + delay ? delay : 0,
        '-webkit-transition': 'transform ' + delay ? delay : 0,
        'transform-origin': '0px 0px 0px',
        '-webkit-transform-origin': '0px 0px 0px',
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
        console.error('dom结构错误，结构必须为：<element><ul></ul></element>');
        return -1;
      }

      switch (this.type) {
        case 'pullrefresh':
          this.pullRefresh && this.pullRefresh();
          break;
        case 'upload':
          this.upload && this.upload();
          break;
      }
    },

    /**
     * @desc 上拉刷新
     */
    pullRefresh: function () {
      // 初始化DOM结构
      _Util.initDLDOM && _Util.initDLDOM(this.LV, this.conf);
      // 为列表添加下拉事件监听
      _Util.listenDL && _Util.listenDL(this.LV, this.conf);
    },

    /**
     * @desc 下拉加载
     */
    upload: function () {
      
    }
  };


  /**
   * @desc 下拉刷新，扩展为Zepto方法
   *       注意： 调用此方法的dom结构必须为列表的父节点（即：<ul/>外围必须包一层）
   * @param  {[object]} conf [参数配置]
   *         {
   *         		cb: function () { // 下拉松手后执行，主要是请求数据，添加数据到dom
   *
   *         		},
   *         		config: {
   *         	        threshold: 0, //滑动阀值，即滑动多大距离触发加载 [可选参数，默认为0]
   *         	        warp: $(''), // 滑动容器，用于计算scrollTop值
   *         			drop: { // 手指下拉列表不松手时展示的提示［可选参数］
   *         				innerHTML: '' //可以为dom结构或纯文字,
   *         			    warpCSS: {}//包裹文字的div的css样式对象 [可选]
   *         			},
   *         			load: { // 手指下拉列表松手时展示的提示［可选参数］
   *         				innerHTML: '' //可以为dom结构或纯文字,
   *         			    warpCSS: {}//包裹文字的div的css样式对象 [可选]
   *         			}
   *         		}
   *         }
   */
  $.fn.pullRefresh = function (conf) {
    var me = $(this);
    return (function () {
      (new Load('pullrefresh', me, conf)).init();
    })();
  };

  /**
   * @desc 上拉加载，扩展为Zepto方法
   * @param conf 同下拉刷新方法一致
   */
  $.fn.upload = function (conf) {
    var me = $(this);
    return (function () {
      (new Load('upload', me, conf)).init();
    })();
  };
})(window, window.$ || Zepto);
