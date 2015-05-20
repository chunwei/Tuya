var __slice = Array.prototype.slice;
var pencount = 0;//记录笔画数
(function ($) {
    var Sketch;
    $.fn.sketch = function () {
        var args, key, sketch;
        key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (this.length > 1) {
            $.error('Sketch.js can only be called on one element at a time.');
        }
        sketch = this.data('sketch');
        if (typeof key === 'string' && sketch) {
            if (sketch[key]) {
                if (typeof sketch[key] === 'function') {
                    return sketch[key].apply(sketch, args);
                } else if (args.length === 0) {
                    return sketch[key];
                } else if (args.length === 1) {
                    return sketch[key] = args[0];
                }
            } else {
                return $.error('Sketch.js did not recognize the given command.');
            }
        } else if (sketch) {
            return sketch;
        } else {
            this.data('sketch', new Sketch(this.get(0), key));
            return this;
        }
    };
    Sketch = (function () {
        function Sketch(el, opts) {
            this.el = el;
            this.canvas = $(el);
            this.context = el.getContext('2d');
            this.options = $.extend({
                toolLinks: true,
                defaultTool: 'marker',
                defaultColor: '#000000',
                defaultSize: 3
            }, opts);
            this.painting = false;
            this.playing = false;
            this.color = this.options.defaultColor;
            this.size = this.options.defaultSize;
            this.tool = this.options.defaultTool;
            this.actions = [];
            this.action = [];
            this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
            if (this.options.toolLinks) {
                $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function (e) {
                    var $canvas, $this, key, sketch, _i, _len, _ref;
                    $this = $(this);
                    $canvas = $($this.attr('href'));
                    sketch = $canvas.data('sketch');
                    _ref = ['color', 'size', 'tool'];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        key = _ref[_i];
                        if ($this.attr("data-" + key)) {
                            sketch.set(key, $(this).attr("data-" + key));
                        }
                    }
                    if ($(this).attr('data-preview')) {
                        sketch.preview($(this).attr('data-preview'));
                    }
                    else if ($(this).attr('data-download')) {
                        sketch.download($(this).attr('data-download'));
                    }
                    else if ($(this).attr('data-cancel')) {
                        sketch.cancel();
                    }
                    else if ($(this).attr('data-clear')) {
                        sketch.clear();
                    }
                    return false;
                });
            }
        }
        /**
         * 在本地进行文件保存
         * @param  {String} data     要保存到本地的图片数据
         * @param  {String} filename 文件名
         */
        Sketch.prototype.saveFile = function(data, filename){
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;

            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
        };
        Sketch.prototype.download = function (format) {
            var mime;
            format || (format = "png");
            if (format === "jpg") {
                format = "jpeg";
            }
            mime = "image/" + format;
            return this.saveFile(this.el.toDataURL(mime),"tuya."+format);
            //return window.location.href=(this.el.toDataURL(mime).replace(mime, "image/octet-stream;Content-Disposition:attachment;filename=tuya.png"));
        };
        Sketch.prototype.preview = function (format) {
            var mime;
            format || (format = "png");
            if (format === "jpg") {
                format = "jpeg";
            }
            mime = "image/" + format;
            var w=window.open('about:blank','涂鸦预览');
            w.document.write("<img src='"+this.el.toDataURL(mime)+"' alt='涂鸦预览'/>");
            //return window.open(this.el.toDataURL(mime));
        };
        Sketch.prototype.set = function (key, value) {
            this[key] = value;
            return this.canvas.trigger("sketch.change" + key, value);
        };
        Sketch.prototype.startPainting = function () {
            this.painting = true;
            return this.action = {
                tool: this.tool,
                color: this.color,
                size: parseFloat(this.size),
                events: []
            };
        };
        Sketch.prototype.stopPainting = function () {
            if (this.action && this.action.tool) {
                this.actions.push(this.action);
            }
            this.painting = false;
            this.action = null;
            return this.redraw();
        };
        Sketch.prototype.onEvent = function (e) {
            if (this.playing)return false;
            if (e.originalEvent && e.originalEvent.targetTouches) {
                if (e.type == 'touchend')
                    e.pageX = e.originalEvent.pageX;
                else {
                    e.pageX = e.originalEvent.targetTouches[0].pageX;
                    e.pageY = e.originalEvent.targetTouches[0].pageY;
                }
            }
            $.sketch.tools[$(this).data('sketch').tool].onEvent.call($(this).data('sketch'), e);
            e.preventDefault();
            return false;
        };
        Sketch.prototype.cancel = function () {
            this.actions.pop();
            return this.redraw();
        };
        Sketch.prototype.clear = function () {
            this.actions = [];
            return this.redraw();
        };
        Sketch.prototype.redraw = function () {
            var sketch;
            pencount = this.actions.length;  //每次更新将笔画数记录下来
            this.el.width = this.canvas.width();
            this.context = this.el.getContext('2d');
            sketch = this;
            $.each(this.actions, function () {
                if (this.tool) {
                    return $.sketch.tools[this.tool].draw.call(sketch, this);
                }
            });
            if (this.painting && this.action) {
                return $.sketch.tools[this.action.tool].draw.call(sketch, this.action);
            }
        };
        Sketch.prototype.replay = function () {
            this.canvas.unbind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', this.onEvent);
            this.playing = true;
            this.el.style.backgroundColor = 'rgba(255,255,255,1)';
            var sketch;
            sketch = this;
            pencount = this.actions.length;  //每次更新将笔画数记录下来
            this.el.width = this.canvas.width();
            this.context = this.el.getContext('2d');
            var i = 0;
            var action = sketch.actions[i];
            /*      var timer=setInterval(function(){
             var action=sketch.actions[i];
             if (action.tool) {
             $.sketch.tools[action.tool].play.call(sketch, action);
             //$.sketch.tools[action.tool].draw.call(sketch, action);
             }
             i++;
             console.log("action:"+i);
             if(i==pencount)clearInterval(timer);
             },1000);*/


            var event, previous, _i, _len, _ref;
            this.context.lineJoin = "round";
            this.context.lineCap = "round";
            this.context.strokeStyle = action.color;
            this.context.lineWidth = action.size;
            this.context.beginPath();
            this.context.moveTo(action.events[0].x, action.events[0].y);
            this.context.lineTo(action.events[0].x + 0.1, action.events[0].y + 0.11);
            _ref = action.events;
            _i = 0, _len = _ref.length;
            var timer = setInterval(function (sketch) {
                event = _ref[_i];
                sketch.context.lineTo(event.x, event.y);
                sketch.context.stroke();
                //console.log("action:"+i+",event:"+_i);
                _i++;
                if (_i == _len) {
                    i++;
                    if (i == pencount) {
                        clearInterval(timer);
                        sketch.el.style.backgroundColor = 'rgba(255,255,255,0.7)';
                        sketch.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel', sketch.onEvent);
                        sketch.playing = false;
                        return;
                    }
                    action = sketch.actions[i];
                    sketch.context.strokeStyle = action.color;
                    sketch.context.lineWidth = action.size;
                    sketch.context.beginPath();
                    sketch.context.moveTo(action.events[0].x, action.events[0].y);
                    sketch.context.lineTo(action.events[0].x + 0.1, action.events[0].y + 0.11);
                    _ref = action.events;
                    _i = 0, _len = _ref.length;
                }

            }, 2, this);


            /*      $.each(this.actions, function() {
             if (this.tool) {
             return $.sketch.tools[this.tool].draw.call(sketch, this);
             }
             });
             if (this.painting && this.action) {
             return $.sketch.tools[this.action.tool].draw.call(sketch, this.action);
             }*/
        };
        return Sketch;
    })();
    $.sketch = {
        tools: {}
    };
    $.sketch.tools.marker = {
        onEvent: function (e) {
            switch (e.type) {
                case 'mousedown':
                case 'touchstart':
                    this.startPainting();
                    break;
                case 'mouseup':
                case 'mouseout':
                case 'mouseleave':
                case 'touchend':
                case 'touchcancel':
                    this.stopPainting();
            }
            if (this.painting) {
                this.action.events.push({
                    x: e.pageX - this.canvas.offset().left,
                    y: e.pageY - this.canvas.offset().top,
                    event: e.type
                });
                return this.redraw();
            }
        },
        draw: function (action) {
            var event, previous, _i, _len, _ref;
            this.context.lineJoin = "round";
            this.context.lineCap = "round";
            this.context.beginPath();
            this.context.moveTo(action.events[0].x, action.events[0].y);
            this.context.lineTo(action.events[0].x + 0.1, action.events[0].y + 0.11);
            _ref = action.events;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                event = _ref[_i];
                this.context.lineTo(event.x, event.y);
                previous = event;
            }
            this.context.strokeStyle = action.color;
            this.context.lineWidth = action.size;
            return this.context.stroke();
        },
        play: function (action) {
            var event, previous, _i, _len, _ref;
            this.context.lineJoin = "round";
            this.context.lineCap = "round";
            this.context.strokeStyle = action.color;
            this.context.lineWidth = action.size;
            this.context.beginPath();
            this.context.moveTo(action.events[0].x, action.events[0].y);
            this.context.lineTo(action.events[0].x + 0.1, action.events[0].y + 0.11);
            _ref = action.events;

            _i = 0, _len = _ref.length;
            var timer = setInterval(function (sketch) {
                event = _ref[_i];
                sketch.context.lineTo(event.x, event.y);
                sketch.context.stroke();

                if (_i++ == _len)clearInterval(timer);
            }, 10, this);

            /*      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
             event = _ref[_i];
             this.context.lineTo(event.x, event.y);
             previous = event;
             }*/
            //this.context.strokeStyle = action.color;
            //this.context.lineWidth = action.size;
            //return this.context.stroke();
        }
    };
    return $.sketch.tools.eraser = {
        onEvent: function (e) {
            return $.sketch.tools.marker.onEvent.call(this, e);
        },
        draw: function (action) {
            var oldcomposite;
            oldcomposite = this.context.globalCompositeOperation;
            this.context.globalCompositeOperation = "copy";
            action.color = "rgba(0,0,0,0)";
            $.sketch.tools.marker.draw.call(this, action);
            return this.context.globalCompositeOperation = oldcomposite;
        }
    };
})(jQuery);