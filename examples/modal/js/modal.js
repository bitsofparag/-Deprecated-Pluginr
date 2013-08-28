/**
 * @desc Add plugin description here
 * @usage
 *   1) If using jQuery
 *      $('#dom').modal(options)
 *
 *   2) If not using jQuery
 *      var domNode = document.getElementById('dom') 
 *      var modal = new Modal(domNode, options)
 *      modal.show() // or any method of the plugin
 *
 *   3) If using HTML-based binding - simple case
 *       <a class="btn" data-plugin="Modal" data-events="click" data-url="http://localhost/bento/iframe.html">Click me</a>
 *       
 */
!function(name, module, context){
	context = context || window
	if (typeof window['define'] === 'function') define(['pluginr', 'text!templates/modal.tmpl.html'], module)
  	else context[name] = module(Pluginr)
}('Modal', function(App, tmpl){
	'use strict';
	
	/**
	 * @desc 
	 *   This function checks for plugin CSS. If not present, loads automatically from 'stylesheets' folder in your web root.
	 *   If, however, your folder structure is different, you can specify the full css url, as in CT.getCSS('http://path/to/cltp_modal.css').
	 *   Or you can add the css for the plugin with a <link> tag in the head of the document. This function need not
	 *   be commented. If the stylesheet is already loaded, it will stop further execution of the function below.
	 */
	App.getCSS('Modal');
	
	/**
	 * @desc default settings for the Modal component. Will be overridden by HTML data attributes or when specified by direct plugin call
	 */
	var defaults = {
		state : 'show' // default state of modal
		// Add more default options here
	};
	
	/* ------------------------------------- Private methods below --------------------------------------- */
	/**
	 * @desc 
	 * @return 
	 */
	function resizeHandler() {
        try {
			if ($.browser.msie) {
				$("#TranslucentLayer").css({
					height : windowHeight + "px"
				});
			} else {
				$("#TranslucentLayer").css({
					height : (document.body.offsetHeight > windowHeight) ? document.body.offsetHeight + "px" : windowHeight + "px"
				});
			}
		} catch(e) {
		}
		modalFrame.css({
			left : ((document.body.offsetWidth - modalFrame.offsetWidth) / 2) + "px"
		});
		modalFrame.css({
			top : (windowHeight - frameHeight) * 100 / (2 * windowHeight) + "%"
		});
    }
	/* ------------------------------------- Private methods section ends --------------------------------------- */
	
	
	
	/* ------------------------------------- COMPONENT DEFINITION -------------------------------------------- */
	function Modal(el, options){
		this.el = el;
		this.settings = options;
	}
	
	Modal.prototype = {
		constructor : Modal,
		
		
		hide : function(){
			//alert('hiding')
			var s = this.settings, $doc = $(document.body)
			var modalFrameId = s.modalid || 'ModalFrame';
			$(document, window.frames[modalFrameId]).unbind('.modal');
			$(document).unbind('DOMMouseScroll mousewheel keydown');
			//$(window).unbind("resize", resizeHandler);
			$("#TranslucentLayer, #" + modalFrameId).remove();
			if("onclose" in s && typeof s.onclose === 'function') s.onclose("Modal was closed") && setTimeout(function(){
				s.onclose("Modal inactive")
			}, 1000)
		},
		
		
		/**
		 * @desc Creates a new modal window
		 */
		show : function(e, settings){
			e.preventDefault()
			
			// hide previous modals first
			//this.hide();
			
			//variables
			var s = this.settings, $doc = $(document.body)
			var onEscClose = s.onescclose || 'true';
			var onDocClose = s.ondocumentclose || 'true'
			var onHide = s.onhide || $.noop;
			var modalWidth = s.width || '700px';
			var modalHeight = s.height || '80%';
			var modalFrameId = s.modalid || 'ModalFrame' ;
			var modalUrl = s.url || this.el.href 
			var that = this
			var modalContentTmpl = $('#'+s.templateId).html()
			
			//Create translucent layer
			var translucentLayer = $("<div></div>", {
				id : "TranslucentLayer"
			});
			
			// Create modal frame
			var modalFrame = $("<div />", {
				id : modalFrameId
			});
			
			// Create top border ??
			var topBorder = $("<div />");
			if(typeof s.showStickyPin !== 'undefined' && s.showStickyPin === true)
				topBorder.append($("<span/>", {"class": "stickyPin"}));
			
			// Create close button
			var close = $("<a style='font-size:140%;padding:5px;background:white;color: red;'>&times;</a>", {
				id : "close",
				title : "Close window"
			});
			
			// Append the translucent layer
			$doc.append(translucentLayer);
			if (onDocClose)	
				translucentLayer.click(function(){
					that.hide()
					if(typeof onDocClose === 'function') onDocClose()
				});
	
			// add close button
			topBorder.append(close);
	
			// add top border to modal frame
			modalFrame.append(topBorder);
	
			$("<iframe/>", {
				src : modalUrl,
				frameborder : 0,
				framespacing : 0,
				width : "100%",
				height : "100%",
				scrolling : "hideScrollbars" in s ? "no" : "auto",
				id : 'ModalWindow',
				name : 'ModalWindow',
				'class' : s.className || 'spinnerMedium'
			}).appendTo(modalFrame).load(function(){
				$(this).removeClass('spinnerMedium spinner')
				$(window.frames['ModalWindow'].document.body).html(modalContentTmpl.replace('{{modal}}', 'Pluginr modal').replace('{{author}}', s.author || 'Pluginr'))
			});
			
			modalFrame.css({
				width : modalWidth,
				height : modalHeight
			})
				.appendTo($doc)
				.css({
					left : (($doc.width() - modalFrame.width()) / 2) + "px"
				});
	
			var windowHeight = $(window).height()
			modalFrame.css({
				top : (windowHeight - modalFrame.height()) * 100 / (2 * windowHeight) + "%"
			});
	
			translucentLayer.css({
				height : "attachEvent" in document? windowHeight + "px" : (document.body.offsetHeight > windowHeight) ? document.body.offsetHeight + "px" : windowHeight + "px"
			});
			
			close.click($.proxy(this.hide, this))
			$doc.bind('keyup.modal', function(e){
				if (e.keyCode == 27 && onEscClose) {
					that.hide()
				}
			});
			//$(window).bind("resize", resizeHandler);
		}
	}
	
	/* -------------------------------------------------------------------------------------------------------------- */
	
	App.bindPlugin('Modal', Modal, defaults, tmpl)
	
	return Modal;
}, this)