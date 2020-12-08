(function($){
	$.fn.dailog = function(options,callBack){
	    var _this = this;
	    var defaultDailog = {
	      width:              280,                    	  //宽度
	      height:             'auto',                     //高度
	      padding:            '10px 16px',                //padding
	      title:              '提示!',                    //提醒信息
	      discription:        '这是弹窗的描述!',          //描述
	      borderRadius:       '4px',                      //圆角
	      bottons:            ['确定','取消'],            //按钮信息
	      maskBg:             'rgba(0,0,0,0.6)',          //遮罩层背景色
	      dailogBg:           '#fff',                     //弹出框的背景色
	      type:               'defalut',                  //类型 defalut primary   success  danger  warning
	      zIndex:             '10000011',                 //层级
	      hideScroll: 	  	  false, 					  //是否关闭滚动条
	      isBtnHasBgColor: 	  true, 					  //确定  取消按钮是否有背景色
	      showBoxShadow: 	  false, 					  //弹窗是否显示boxshadow
	      animateStyle: 	  'fadeInNoTransform',	   	  //进入的效果
	      isInput: 			  false, 					  //是否显示输入框
	      inputPlaceholder:   '填写相关内容', 			  //文本输入提示框
	    };

	    var opt = $.extend(defaultDailog,options||{});

	    // 设置btn是否有颜色
	    var btn_className = opt.isBtnHasBgColor?'':'no_bg';

	    // 点击的索引
	    var btnIndex = '';

	    if($('.cpt_mask_dailog').length){
	      return;
	    };

	    var _isScroll = function(){
	    	if(opt.hideScroll){
	    		$('body,html').css({
		    		overflow:'hidden',
		    	});
	    	}
	    }

	    var _colseScroll = function(){
	    	$('body,html').css({
	    		overflow:'auto',
	    	});
	    }

	    var _overflowBtn = function(){
	    	// bottons超过两个提示
		    if(opt.bottons.length>2){
		       $dw.showMessage('按钮的最多显示上限不超过2个',3000,false);
		    }
	    }

	    var _isBoxShadow = function(){
	    	// 是否显示boxshadow
		    if(!opt.showBoxShadow){
		    	_this.dailog_div.addClass('no_boxShadow');
		    };
	    }

	    var _btnIndex = function(name){
	    	//获取点击的索引
	      	var btnName = name || '';
	      		for(var i = 0;i<opt.bottons.length;i++){
	        		if(btnName === opt.bottons[i]){
	          		btnIndex = i;
	        	}
	      	}
	    }

	    var _init = function(){
	    	_this.dailog_mask = $("<div class='"+opt.animateStyle+" animated cpt_mask_dailog "+opt.type+"'></div>").css({
		      'background':opt.maskBg,
		      'z-index':opt.zIndex,
		    }).appendTo($('body'));

	    	_isScroll();
		    // 判断按钮是否超出两个
		    _overflowBtn();

		     _this.dailog_div = $("<div class='div_dailog'></div>").css({
				'width':opt.width,
				'height':opt.height,
				'background':opt.dailogBg,
				'-moz-border-radius':opt.borderRadius,
				'-webkit-border-radius':opt.borderRadius,
				'border-radius':opt.borderRadius,
				'padding':opt.padding,
		    }).appendTo(_this.dailog_mask);

		    _this.title_dailog = $("<div class='title_dailog'></div>").html(opt.title).appendTo(_this.dailog_div);

		    if(!opt.isInput){
		    	_this.discription_dailog = $("<div class='discription_dailog'></div>").html(opt.discription).appendTo(_this.dailog_div);
		    }else{
		    	_this.discription_dailog = $("<div class='discription_dailog'></div>").css({
		    		'text-indent':0,
		    	}).html(opt.discription).appendTo(_this.dailog_div);
		    	_this.input_dailog = $("<input type='text' class='dailog_input' placeholder="+opt.inputPlaceholder+">").appendTo(_this.discription_dailog);
		    }
		    
		    _this.dailog_divOperation = $("<div class='dailog_divOperation'></div>").appendTo(_this.dailog_div);

		    if(!(opt.bottons.length === 2)){
		     	_this.firstBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[0]).attr({'data-name':opt.bottons[0]}).appendTo(_this.dailog_divOperation);
		    }else{
		     	_this.firstBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[0]).attr({'data-name':opt.bottons[0]}).appendTo(_this.dailog_divOperation);
		     	_this.secondBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[1]).attr({'data-name':opt.bottons[1]}).appendTo(_this.dailog_divOperation);
		    }

		    //是否显示boxshadow
		    _isBoxShadow();
	    }

	    _init();

	    //关闭点击和触摸的默认事件
	    _this.dailog_mask.on('click',function(e){
	      e.stopPropagation();
	      e.preventDefault();
	    });

	    _this.dailog_mask.on('touchmove',function(e){
	      e.stopPropagation();
	      e.preventDefault();
	    });


	    // 点击的回调
	    _this.dailog_divOperation.children().on('click',function(e){
	      var name = $(this).attr('data-name');
	       //获取点击的索引
	      // _this.bottonIndex(name);
	      _btnIndex(name);

	      var inputstatus = _this.input_dailog? 1:0;
	      var inputvalue = inputstatus? _this.input_dailog.val():'';

	      // 设置返回值
	      var ret = {
	      	index:btnIndex,
	      	input:{
	      		status:inputstatus,
	      		value:inputvalue,
	      	}
	      };

	      _colseScroll();

	      //未写回调函数则不会有效果
	      if(typeof(callBack) === 'function'){
	          //执行回调函数
	          callBack(ret);
	      }
	      _this.dailog_mask.remove();
	    });

	    return _this;
	};

})(jQuery);