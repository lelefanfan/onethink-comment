//dom加载完成后执行的js
;$(function(){

	//全选的实现
	$(".check-all").click(function(){
		$(".ids").prop("checked", this.checked);
	});
	$(".ids").click(function(){
		var option = $(".ids");
		option.each(function(i){
			if(!this.checked){
				$(".check-all").prop("checked", false);
				return false;
			}else{
				$(".check-all").prop("checked", true);
			}
		});
	});

    //ajax get请求
    $('.ajax-get').click(function(){
        // 要get的目标url
        var target;
        // 触发事件对象
        var that = this;
        // 是否弹出确认提示信息
        if ( $(this).hasClass('confirm') ) {
            if(!confirm('确认要执行该操作吗?')){
                return false;
            }
        }
        // 执行get提交条件：1.触发事件对象存在href属性；2.触发事件对象存在url属性
        if ( (target = $(this).attr('href')) || (target = $(this).attr('url')) ) {

            $.get(target).success(function(data){
                // 状态为1
                if (data.status==1) {
                    // 弹出模板提示信息
                    if (data.url) {
                        updateAlert(data.info + ' 页面即将自动跳转~','alert-success');
                    }else{
                        updateAlert(data.info,'alert-success');
                    }
                    // 定时执行url跳转或关闭提示框或重新载入页面
                    setTimeout(function(){
                        if (data.url) {
                            location.href=data.url;
                        }else if( $(that).hasClass('no-refresh')){
                            $('#top-alert').find('button').click();
                        }else{
                            location.reload();
                        }
                    },1500);
                }else{// 状态不为1
                    updateAlert(data.info);
                    setTimeout(function(){
                        if (data.url) {
                            location.href=data.url;
                        }else{
                            $('#top-alert').find('button').click();
                        }
                    },1500);
                }
            });

        }
        return false;
    });

    //ajax post submit请求
    $('.ajax-post').click(function(){
        var target,query,form;
        // 指定目标表单
        var target_form = $(this).attr('target-form');
        // 触发点击事件按钮
        var that = this;
        // ？？？
        var nead_confirm=false;
        //触发post事件的三个条件：1.当前按钮类型为submit；2.当前按钮存在href属性；3.当前按钮存在url属性
        if( ($(this).attr('type')=='submit') || (target = $(this).attr('href')) || (target = $(this).attr('url')) ){
            // 获取目标对象
            form = $('.'+target_form);

            if ($(this).attr('hide-data') === 'true'){//无数据时也可以使用的功能
                // 如果设置 'hide-data=true' 属性，重新获取目标对象
            	form = $('.hide-data');
            	query = form.serialize();
            }else if (form.get(0)==undefined){// 如果不存在目标对象，就返回false
            	return false;
            }else if ( form.get(0).nodeName=='FORM' ){// 如果目标对象是form表单
                // 如果触发事件对象存在 'confirm' 类就弹出操作提示框
                if ( $(this).hasClass('confirm') ) {
                    if(!confirm('确认要执行该操作吗?')){
                        return false;
                    }
                }
                // 如果触发事件对象存在url属性，就将其设置为提交数据的链接
                if($(this).attr('url') !== undefined){
                	target = $(this).attr('url');
                }else{// 否则就从form的action属性中获取
                	target = form.get(0).action;
                }
                // 序列化表单数据
                query = form.serialize();
            }else if( form.get(0).nodeName=='INPUT' || form.get(0).nodeName=='SELECT' || form.get(0).nodeName=='TEXTAREA') {// 如果目标对象：1.INPUT标签；2.SELECT标签；3.TEXTAREA标签
                
                // 循环INPUT，设置checked
                form.each(function(k,v){
                    if(v.type=='checkbox' && v.checked==true){
                        nead_confirm = true;
                    }
                })
                // 如果INPUT至少有一个被选中且存在confirm样式，就弹出cocnfirm提示框
                if ( nead_confirm && $(this).hasClass('confirm') ) {
                    if(!confirm('确认要执行该操作吗?')){
                        return false;
                    }
                }
                // 序列化数据对象
                query = form.serialize();
            }else{
                if ( $(this).hasClass('confirm') ) {
                    if(!confirm('确认要执行该操作吗?')){
                        return false;
                    }
                }
                // 将input、select、textarea数据序列化
                query = form.find('input,select,textarea').serialize();
            }
            // 将存在禁止输入样式 'disabled' 关闭 'autocomplete' 自动完成，并统一设置 'disabled'属性为true
            $(that).addClass('disabled').attr('autocomplete','off').prop('disabled',true);

            // post提交
            $.post(target,query).success(function(data){
                /* 执行成功后的回调函数 */
                // 如果状态为1
                if (data.status==1) {
                    // 如果存在跳转地址
                    if (data.url) {
                        // 模板页面弹出提示信息
                        updateAlert(data.info + ' 页面即将自动跳转~','alert-success');
                    }else{
                        // 模板页面弹出提示信息
                        updateAlert(data.info ,'alert-success');
                    }

                    setTimeout(function(){
                        // 删除禁止样式
                    	$(that).removeClass('disabled').prop('disabled',false);
                        // 如果存在url就跳转到指定url
                        if (data.url) {
                            location.href=data.url;
                        }else if( $(that).hasClass('no-refresh')){// 如果按钮存在 'no-refresh' 样式，就处罚点击事件
                            $('#top-alert').find('button').click();
                        }else{ // 重新载入页面
                            location.reload();
                        }
                    },1500);
                }else{ //如果状态返回不为1
                    // 设置模板提示信息
                    updateAlert(data.info);

                    setTimeout(function(){
                        // 删除禁止样式
                    	$(that).removeClass('disabled').prop('disabled',false);
                        // 如果存在url就跳转到指定url
                        if (data.url) {
                            location.href=data.url;
                        }else{  // 如果不存在url，就触发提示框点击事件，实际上就是关闭提示框
                            $('#top-alert').find('button').click();
                        }
                    },1500);
                }
            });
        }
        return false;
    });

	/**顶部警告栏*/
	var content = $('#main');
	var top_alert = $('#top-alert');
	top_alert.find('.close').on('click', function () {
		top_alert.removeClass('block').slideUp(200);
		// content.animate({paddingTop:'-=55'},200);
	});

    /*
     * [updateAlert description]
     * @param  {[string]} text [提示信息]
     * @param  {[string]} c    [样式]
     * @return {[type]}      [description]
     */
    window.updateAlert = function (text,c) {
        // 如果 text 不存在就设置为 default
		text = text||'default';
        // 如果 c 不存在就设置为 false
		c = c||false;

		if ( text!='default' ) {// 存在提示信息
            // 设置提示信息到模板
            top_alert.find('.alert-content').text(text);
            // 设置模板提示信息样式
			if (top_alert.hasClass('block')) {
			} else {
				top_alert.addClass('block').slideDown(200);
				// content.animate({paddingTop:'+=55'},200);
			}
		} else { //提示信息为 default
			if (top_alert.hasClass('block')) {
				top_alert.removeClass('block').slideUp(200);
				// content.animate({paddingTop:'-=55'},200);
			}
		}
        // 设置提示信息样式
		if ( c!=false ) {
            top_alert.removeClass('alert-error alert-warn alert-info alert-success').addClass(c);
		}
	};

    //按钮组
    (function(){
        //按钮组(鼠标悬浮显示)
        $(".btn-group").mouseenter(function(){
            var userMenu = $(this).children(".dropdown ");
            var icon = $(this).find(".btn i");
            icon.addClass("btn-arrowup").removeClass("btn-arrowdown");
            userMenu.show();
            clearTimeout(userMenu.data("timeout"));
        }).mouseleave(function(){
            var userMenu = $(this).children(".dropdown");
            var icon = $(this).find(".btn i");
            icon.removeClass("btn-arrowup").addClass("btn-arrowdown");
            userMenu.data("timeout") && clearTimeout(userMenu.data("timeout"));
            userMenu.data("timeout", setTimeout(function(){userMenu.hide()}, 100));
        });

        //按钮组(鼠标点击显示)
        // $(".btn-group-click .btn").click(function(){
        //     var userMenu = $(this).next(".dropdown ");
        //     var icon = $(this).find("i");
        //     icon.toggleClass("btn-arrowup");
        //     userMenu.toggleClass("block");
        // });
        $(".btn-group-click .btn").click(function(e){
            if ($(this).next(".dropdown").is(":hidden")) {
                $(this).next(".dropdown").show();
                $(this).find("i").addClass("btn-arrowup");
                e.stopPropagation();
            }else{
                $(this).find("i").removeClass("btn-arrowup");
            }
        })
        $(".dropdown").click(function(e) {
            e.stopPropagation();
        });
        $(document).click(function() {
            $(".dropdown").hide();
            $(".btn-group-click .btn").find("i").removeClass("btn-arrowup");
        });
    })();

    // 独立域表单获取焦点样式
    $(".text").focus(function(){
        $(this).addClass("focus");
    }).blur(function(){
        $(this).removeClass('focus');
    });
    $("textarea").focus(function(){
        $(this).closest(".textarea").addClass("focus");
    }).blur(function(){
        $(this).closest(".textarea").removeClass("focus");
    });
});

/* 上传图片预览弹出层 */

//标签页切换(无下一步)
function showTab() {
    $(".tab-nav li").click(function(){
        var self = $(this), target = self.data("tab");
        self.addClass("current").siblings(".current").removeClass("current");
        window.location.hash = "#" + target.substr(3);
        $(".tab-pane.in").removeClass("in");
        $("." + target).addClass("in");
    }).filter("[data-tab=tab" + window.location.hash.substr(1) + "]").click();
}

//标签页切换(有下一步)
function nextTab() {
     $(".tab-nav li").click(function(){
        var self = $(this), target = self.data("tab");
        self.addClass("current").siblings(".current").removeClass("current");
        window.location.hash = "#" + target.substr(3);
        $(".tab-pane.in").removeClass("in");
        $("." + target).addClass("in");
        showBtn();
    }).filter("[data-tab=tab" + window.location.hash.substr(1) + "]").click();

    $("#submit-next").click(function(){
        $(".tab-nav li.current").next().click();
        showBtn();
    });
}

// 下一步按钮切换
function showBtn() {
    var lastTabItem = $(".tab-nav li:last");
    if( lastTabItem.hasClass("current") ) {
        $("#submit").removeClass("hidden");
        $("#submit-next").addClass("hidden");
    } else {
        $("#submit").addClass("hidden");
        $("#submit-next").removeClass("hidden");
    }
}

//导航高亮
function highlight_subnav(url){
    $('.side-sub-menu').find('a[href="'+url+'"]').closest('li').addClass('current');
}
