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
      pullRefresh: {
        threshold: 0,
        defaultCSS: {
          'text-align': 'center',
          'padding': '7% 0',
          'background': '#948F8F',
          'color': '#fff'
        },
        dropStyle: {},
        loadStyle: {},
        DROP: '',
        LOAD: '',
        HEIGHT: 0,
        translateY: 0,
        startY: 0
      },
      upload: {
        type: 'normal',
        threshold: 0,
        normal: {
          defaultCSS: {
            'background': 'rgba(0, 0, 0, .5)',
            'text-align': 'center',
            'color': '#fff'
          },
          loadStyle: {},
          LOAD: '',
          translateY: 0,
          startY: 0
        },
        drop: {

        }
      }
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
     * @desc 处理下拉刷新事件监听
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
        if ((touch.clientY - that.DLDATA.pullRefresh.startY < that.DLDATA.pullRefresh.threshold) || warp.scrollTop > 0) {
          // 向下滑动不做处理
          return -1;
        }
        that.DLDATA.pullRefresh.translateY = (-that.DLDATA.pullRefresh.HEIGHT + touch.clientY - that.DLDATA.pullRefresh.startY)/2;
        that.transformDLDOM($dom);

        //解决安卓上touchmove只触发1次或者2次的bug
        return false;
      });

      that.listen($dom, 'touchend', function (ev) {
        var touch = ev.touches[0] || ev.changedTouches[0],
            load_warp = $('#load_pullrefresh_warp');
        if ((touch.clientY - that.DLDATA.pullRefresh.startY <= that.DLDATA.pullRefresh.threshold) || warp.scrollTop > 0) {
          return -1;
        }
        // 放手后修改提示内容
        load_warp.html(that.DLDATA.pullRefresh.LOAD).css(that.DLDATA.pullRefresh.loadStyle);
        that.DLDATA.pullRefresh.translateY = 0;
        that.transformDLDOM($dom, '.3s');
        conf.cb && conf.cb(function () {
          load_warp.html(that.DLDATA.pullRefresh.DROP).css(that.DLDATA.pullRefresh.dropStyle);
          that.DLDATA.pullRefresh.translateY = - that.DLDATA.pullRefresh.HEIGHT;
          load_warp.html(that.DLDATA.pullRefresh.DROP);
          that.transformDLDOM($dom, '.3s');
        });
      });
    },

    /**
     * @desc 初始化下拉刷新DOM结构，主要是添加加载文案结构
     * @param  {[Zepto]} $dom [list列表]
     * @param  {[Object]} conf [配置参数对象]
     */
    initDLDOM: function ($dom, conf) {
      // 初始化下拉刷新相关css
      $.extend(this.DLDATA.pullRefresh.dropStyle, this.DLDATA.pullRefresh.defaultCSS, conf.config.drop.warpCSS);
      $.extend(this.DLDATA.pullRefresh.loadStyle, this.DLDATA.pullRefresh.defaultCSS, conf.config.load.warpCSS);

      // 初始化滑动阀值
      this.DLDATA.pullRefresh.threshold = conf.config.threshold || 0;

      // 初始化下拉刷新提示DOM结构
      this.DLDATA.pullRefresh.DROP = conf.config.drop && conf.config.drop.innerHTML && conf.config.drop.innerHTML != '' ? conf.config.drop.innerHTML : '松手后加载数据!';
      this.DLDATA.pullRefresh.LOAD = conf.config.load && conf.config.load.innerHTML && conf.config.load.innerHTML != '' ? conf.config.load.innerHTML : '正在加载数据!';
      this.DLDATA.pullRefresh.DROP = "<div id='load_pullrefresh_warp'>" + this.DLDATA.pullRefresh.DROP + "</div>";

      // 初始化DOM
      $(this.DLDATA.pullRefresh.DROP).css(this.DLDATA.pullRefresh.dropStyle).prependTo($($dom));
      // 计算拉加载提示DOM高度
      this.DLDATA.pullRefresh.HEIGHT = $('#load_pullrefresh_warp').height();
      this.DLDATA.pullRefresh.translateY = -this.DLDATA.pullRefresh.HEIGHT;
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
        'transform': 'translate3d(0, ' +  this.DLDATA.pullRefresh.translateY + 'px, 0) scale(1)',
        '-webkit-transform': 'translate3d(0, ' +  this.DLDATA.pullRefresh.translateY + 'px, 0) scale(1)'
      });
    },

    /**
     * @desc 初始化上拉加载DOM结构，主要是添加加载文案结构
     * @param  {[Zepto]} $dom [list列表]
     * @param  {[Object]} conf [配置参数对象]
     */
    initULDOM: function ($dom, conf) {
      // 初始化type
      this.DLDATA.upload.type = conf.config.type || 'normal';
      // 初始化滑动阀值
      this.DLDATA.upload.threshold = conf.config.threshold || 10;
      if (this.DLDATA.upload.type == 'drop') {

      } else {
        // 初始化上拉加载相关css
        $.extend(this.DLDATA.upload.normal.loadStyle, this.DLDATA.upload.normal.defaultCSS, conf.config.load.warpCSS, {
          'position': 'fixed',
          'width': '100%',
          'bottom': 0,
          'display': 'none'
        });
        // 初始化上拉加载提示DOM结构
        this.DLDATA.upload.normal.LOAD = conf.config.load && conf.config.load.innerHTML && conf.config.load.innerHTML != '' ? conf.config.load.innerHTML : '正在加载数据!';
        this.DLDATA.upload.normal.LOAD = "<div id='load_upload_warp'>" + this.DLDATA.upload.normal.LOAD + "</div>";
        // 初始化DOM
        $($dom).css('position', 'relative');
        $($dom).append($(this.DLDATA.upload.normal.LOAD).css(this.DLDATA.upload.normal.loadStyle));
      }
    },

    /**
     * @desc 处理上拉加载事件监听
     * @param  {[Zepto]} $dom [监听对象]
     * @param  {[Object]} conf [参数对象]
     */
    listenUL: function ($dom, conf) {
      var that = this,
          warp = $(conf.config.warp),
          box = $(conf.config.box);

      that.listen($dom, 'touchstart', function (ev) {
        var touch = ev.touches[0] || ev.changedTouches[0];
        that.DLDATA.upload.normal.startY = touch.clientY;
      });

      that.listen($dom, 'touchend', function (ev) {
        var touch = ev.touches[0] || ev.changedTouches[0],
            loading = $('#load_upload_warp');
        if ((warp.height() - box.height() - warp.get(0).scrollTop > that.DLDATA.upload.threshold) || touch.clientY - that.DLDATA.upload.normal.startY >= 0) {
          // 向下滑动不做处理
          return -1;
        }
        loading.show();
        conf.cb && conf.cb(function () {
          loading.hide();
        });
      });
    }
  };


  /**
   * @desc Load Object
   * @param  {[string]} type     [加载方式 pullRefresh || upload]
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
      // 初始化DOM结构
      _Util.initULDOM && _Util.initULDOM(this.LV, this.conf);
      // 为列表添加下拉事件监听
      _Util.listenUL && _Util.listenUL(this.LV, this.conf);
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
   * @param  {[object]} conf [参数配置]
   *         {
   *         		cb: function () { // 下拉松手后执行，主要是请求数据，添加数据到dom
   *
   *         		},
   *         		config: {
   *         	        type: normal(默认值) || drop, //normal：当值为normal时，提示信息直接盖在列表底部上方，此时可以不传drop参数，即使传递了也会直接忽略
   *                                                   drop: 当值为drop时，提示信息直接在列表底部下方
   *                    box: $('') // 即列表在哪个固定高的容器内滑动
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
  $.fn.upload = function (conf) {
    var me = $(this);
    return (function () {
      (new Load('upload', me, conf)).init();
    })();
  };
})(window, window.$ || Zepto);
