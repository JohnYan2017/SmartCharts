/**
 * 滚动组件的实现
 * @param {Object} $
 */
(function($){
	/**
	 * 实现滚动方法
	 * @param {Object} options
	 */
	$.fn.initTable = function(options){
		//默认配置
		let defaults = {
			speed:null,  //滚动速度,值越大速度越慢
			rowHeight:24, //每行的高度
			dataObj: null,
			ClassForEven: 'tb-evenRowStyle',
			ClassForHover: 'tb-rowhover',
			ClassForOdd: null
		};
		//对象赋值
		let opts = $.extend({}, defaults, options),intId = [];
		
		function marquee(obj, step){	
			obj.find("ul").animate({marginTop: '-=1'},0,function(){
				let s = Math.abs(parseInt($(this).css("margin-top")));
				if(s >= step){
					let firstli = $(this).find("li").slice(0, 1)
					firstli.appendTo($(this));
					$(this).css("margin-top", 0);
				}
			});
		}
		function initScroll(obj, dataObj){
			let mybody = $('.tb-scroll-body', obj);
			let myhead = $('.tb-scroll-head', obj)
			let key = null;
			let span_dom = null;
			mybody.empty();
				$.each(dataObj,function(index,item){
					mybody.append('<li><a></a></li>')
					for(key in item){
						span_dom = myhead.find("div[name='"+key+"']").clone();
						span_dom.text(item[key]);
						mybody.find('li:last-child>a').append(span_dom);
					}
				});
		}

		function addClassForHover(obj, styleName){
			let mysty = $('ul>li', obj)
			mysty.hover(function(){
				mysty.each(function(){
					$(this).removeClass(styleName);
				});
				$(this).addClass(styleName);
			});
			mysty.mouseleave(function(){
				$(this).removeClass(styleName);
			});
		}
		//初始化数据
		if(opts.dataObj){initScroll($(this), opts.dataObj)}
		if(opts.ClassForEven){$('>ul>li:even', this).addClass(opts.ClassForEven);}
		if(opts.ClassForOdd){$('>ul>li:odd', this).addClass(opts.ClassForOdd);}
		if(opts.ClassForHover){addClassForHover(this, opts.ClassForHover)}

		if(opts.speed){
		this.each(function(i){
			let sh = opts["rowHeight"],speed = opts["speed"],_this = $(this);
			intId[i] = setInterval(function(){
				if(_this.find("ul").height()<=_this.height()){
					clearInterval(intId[i]);
				}else{
					marquee(_this, sh);
				}
			}, speed);

			_this.hover(function(){
				clearInterval(intId[i]);
			},function(){
				intId[i] = setInterval(function(){
					if(_this.find("ul").height()<=_this.height()){
						clearInterval(intId[i]);
					}else{
						marquee(_this, sh);
					}
				}, speed);
			});
		
		});}

	}
	

	/**
	 * 行点击事件
	 * @param {Object} callback
	 */
	$.fn.rowOnclick = function(callback){
		$('>ul>li', this).bind('click',function(){
			let scroll_obj = {};
			$(this).find('div').each(function(index,item){
				scroll_obj[$(this).attr('name')]=$(this).text();
			});
			callback(scroll_obj);
		});
	}
})(jQuery);