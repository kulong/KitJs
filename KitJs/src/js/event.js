/**
 * 事件扩展
 */
$Kit.Event = function() {
	//
	this._ev = function() {
		$Kit.prototype.ev.apply($kit, arguments);
	}
	this.dragElement = undefined;
	/*$kit.ev = function() {
	 $kit.event.ev.apply($kit.event, arguments);
	 }*/
}
$Kit.Event.prototype = {
	/**
	 * 常量
	 */
	KEYCODE_UP : 38,
	KEYCODE_DOWN : 40,
	KEYCODE_LEFT : 37,
	KEYCODE_RIGHT : 39,
	//
	KEYCODE_ADD : 107,
	KEYCODE_SUB : 109,
	KEYCODE_MULTIPLY : 106,
	KEYCODE_DIVIDE : 111,
	//
	KEYCODE_ENTER : 13,
	KEYCODE_ESC : 27,
	KEYCODE_BACKSPACE : 8,
	KEYCODE_TAB : 9,
	//
	KEYCODE_SHIFT : 16,
	KEYCODE_CTRL : 17,
	KEYCODE_ALT : 18,
	//
	KEYCODE_INSERT : 45,
	KEYCODE_DELETE : 46,
	//
	KEYCODE_PAGEUP : 33,
	KEYCODE_PAGEDOWN : 34,
	//
	/**
	 * event增强start
	 */
	/**
	 * 递归
	 */
	recurEv : function(evCfg, fn) {
		var me = this;
		if($kit.isAry(evCfg.el)) {
			$kit.each(evCfg.el, function(el) {
				fn.call(me, $kit.join(evCfg, {
					el : el
				}));
			});
		} else if($kit.isCanSplit2Ary(evCfg.el)) {
			me.recurEv($kit.join(evCfg, {
				el : evCfg.el.split($kit.CONSTANTS.REGEXP_SPACE)
			}), fn);
		} else if($kit.isStr(evCfg.el)) {
			var _el = $kit.el(evCfg.el);
			if($kit.isEmpty(_el)) {
				_el = $kit.el("#" + evCfg.el);
			}
			if(!$kit.isEmpty(_el)) {
				fn.call(me, $kit.join(evCfg, {
					el : _el
				}));
			}
		} else if($kit.isAry(evCfg.ev)) {
			$kit.each(evCfg.ev, function(ev) {
				fn.call(me, $kit.join(evCfg, {
					ev : ev
				}));
			});
		} else if($kit.isCanSplit2Ary(evCfg.ev)) {
			me.recurEv($kit.join(evCfg, {
				ev : evCfg.ev.split($kit.CONSTANTS.REGEXP_SPACE)
			}), fn);
		} else {
			return true;
		}
	},
	/**
	 * 拖拽
	 */
	ev : function(config) {
		var me = this, defaultConfig = {
			el : null,
			ev : null,
			fn : null
		}
		config = $kit.join(defaultConfig, config);
		if($kit.isEmpty(config.el) || $kit.isEmpty(config.ev) || !$kit.isFn(config.fn)) {
			return;
		}
		if(me.recurEv(config, me.ev)) {
			var ev = config.ev.trim(), el = config.el;
			if('ondrag' in el) {
				//使用IE自带的drag事件，考虑到HTML5的普及，直接使用现成的
				if(me._isDragEv(ev) && el._flag_kitjs_drag_regist != true) {
					el._flag_kitjs_drag_regist = true;
					$kit.attr(el, 'draggable', 'true');
					if($kit.isIE()) {
						me._ev({
							el : el,
							ev : 'mousedown',
							fn : function(e) {
								var el = e.currentTarget;
								el.dragDrop && el.dragDrop();
								el._kitjs_dd_mousedown = true;
								//el._kitjs_dd_origin_positoin = $kit.css(el, 'position');
							}
						});
						me._ev({
							el : el,
							ev : 'dragstart',
							fn : function(e) {
								var el = e.currentTarget;
								//e.dataTransfer.effectAllowed = "all";
								me.dragElement = e.currentTarget;
								e.dataTransfer.setData("text", e.currentTarget.innerHTML);
								//e.dataTransfer.setDragImage(e.target, 0, 0);
								if(el._kitjs_dd_start != true) {
									//
									// var cloneNode = document.createElement('div');
									// $kit.css(cloneNode, {
									// position : 'absolute',
									// display : 'block',
									// width : $kit.offset(el).width,
									// height : $kit.offset(el).height,
									// border : '2px dashed #aaa',
									// backgroundColor : 'transparent',
									// opacity : 0.5
									// });
									// document.body.appendChild(cloneNode);
									// $kit.css(cloneNode, {
									// top : e.pageY - 2,
									// left : e.pageX - 2
									// });
									// $kit.css(el, {
									// position : 'absolute',
									// top : el.offsetTop,
									// left : el.offsetLeft
									// });

									el._kitjs_dd_start = true;
									el._kitjs_dd_drag = true;
									//el._kitjs_dd_cloneNode = cloneNode;
								}
							}
						});
						me._ev({
							el : el,
							ev : 'drag',
							fn : function(e) {
								var el = e.currentTarget;
								//e.dataTransfer.effectAllowed = "all";
								if(el._kitjs_dd_mousedown == true) {
									// $kit.css(el._kitjs_dd_cloneNode, {
									// position : 'absolute',
									// display : 'block',
									// top : e.pageY - 2,
									// left : e.pageX - 2
									// });
									el._kitjs_dd_drag = true;
								}
							}
						});
						me._ev({
							el : el,
							ev : 'dragend',
							fn : function(e) {
								me.dragElement = null;
								var el = e.currentTarget;
								el._kitjs_dd_mousedown = false;
								el._kitjs_dd_drag = false;
								el._kitjs_dd_start = false;

								// $kit.css(el._kitjs_dd_cloneNode, {
								// display : 'none',
								// 'z-index' : -1
								// });

							}
						});
						el._kitjs_dd_init = true;
						el._kitjs_dd_start = false;
						el._kitjs_dd_drag = false;
						el._kitjs_dd_mousedown = true;
					} else {
						me._ev({
							el : el,
							ev : 'dragstart',
							fn : function(e) {
								var el = e.currentTarget;
								//e.dataTransfer.effectAllowed = "all";
								me.dragElement = e.currentTarget;
								e.dataTransfer.setData("text", e.currentTarget.innerHTML);
							}
						});
						me._ev({
							el : el,
							ev : 'drag',
							fn : function(e) {
								//e.dataTransfer.effectAllowed = "all";
							}
						});
						me._ev({
							el : el,
							ev : 'dragend',
							fn : function(e) {
								me.dragElement = null;
							}
						});
					}
				} else if(me._isDropEv(ev) && el._flag_kitjs_drop_regist != true) {
					el._flag_kitjs_drop_regist = true;
					me._ev({
						el : el,
						ev : 'dragover',
						fn : function(e) {
							e.stopDefault();
						}
					});
				} else {
					//mousemove代替drag事件，暂时hold
					/*
					 if(!el._kitjs_dd_init) {
					 me._ev({
					 el : el,
					 ev : 'mousedown',
					 fn : function(e) {
					 var el = e.currentTarget;
					 if(el._kitjs_dd_init) {
					 el._kitjs_dd_start = false;
					 el._kitjs_dd_drag = false;
					 el._kitjs_dd_mousedown = true;
					 }
					 }
					 });
					 el._kitjs_dd_init = true;
					 me._ev({
					 el : el,
					 ev : 'mousemove',
					 fn : function(e) {
					 var el = e.currentTarget;
					 if(el._kitjs_dd_init == true && el._kitjs_dd_mousedown == true) {
					 if(el._kitjs_dd_start != true) {
					 $kit.newEv({
					 el : el,
					 ev : 'dragstart'
					 });
					 el._kitjs_dd_start = true;
					 }
					 el._kitjs_dd_drag = true;
					 $kit.newEv({
					 el : el,
					 ev : 'drag'
					 });
					 }
					 }
					 });
					 me._ev({
					 el : el,
					 ev : 'mouseup',
					 fn : function(e) {
					 var el = e.currentTarget;
					 if(el._kitjs_dd_drag == true && el._kitjs_dd_init == true) {
					 $kit.newEv({
					 el : el,
					 ev : 'dragend'
					 });
					 el._kitjs_dd_drag = false;
					 el._kitjs_dd_start = false;
					 el._kitjs_dd_mousedown = false;
					 }
					 }
					 });
					 }
					 */
				}
				//
			}
			me._ev(config);
		}
	},
	_isDragEv : function(ev) {
		var ev = ev.toLowerCase().trim();
		if(ev == 'dragstart'//
		|| ev == 'drag'//
		|| ev == 'dragend'//
		) {
			return true;
		}
		return false;
	},
	_isDropEv : function(ev) {
		var ev = ev.toLowerCase().trim();
		if(ev == 'dragenter'//
		|| ev == 'dragleave'//
		|| ev == 'dragover'//
		|| ev == 'drop'//
		) {
			return true;
		}
		return false;
	}
	/**
	 * event增强end
	 */
};
$kit.event = new $Kit.Event();
