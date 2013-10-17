!function(name, module, context){
  	if (typeof window['define'] === 'function') define([!window.$? 'jquery' : ''], module)
  	else
  		context[name] = module(jQuery)
}('Pluginr', function($, App){
	$ = $ || window.$ // check jquery
	App = App || {}
	
	var config = {
		rootPath : window.location.pathname
		,stylesPath : '/stylesheets'
	}
	
	function _parse(str){
		var attrObj = {}
		$.each(str.split(','), function(keyVal){
			var pair = keyVal.split(':')
			attrObj[pair[0].trim()] = pair[1].trim()
		})
		return attrObj
	}
	
	function _getAttrs(nodeAttrs){
		var bindAttrs = {}
		try { 
			bindAttrs = new Function('return { ' + nodeAttrs + '}')() 
		} catch(e){
			bindAttrs = _parse(nodeAttrs)
		}
		return bindAttrs
	}
	
	function exec(e, data){
		var pluginName = data && data._name || $(this).attr('data-plugin')
		data = data || $.data(this, 'pr_'+pluginName);
		new data._invoker(this, data)[data.state](e, data);
	}
	
	/**
 	 * @desc Build modal component settings from HTML attributes
 	 * @return Object - hash of all data-* peoperties 
 	 */
	function getHTMLSettings(elem){
		var settings = {}, i = 0, attrs = elem.attributes, len = attrs.length, key, val
		for(; i < len && (key = attrs[i].nodeName, val = attrs[i].nodeValue); i++)
			if(key.indexOf('data-') > -1) {
				if(key.indexOf('data-plugin') > -1 || key.indexOf('data-events') > -1) continue;
				var k = key.split('-'); k.splice(0,1);
				if(key.indexOf('data-props') > -1)
					try{
						$.extend(settings, _getAttrs(val))
					} catch(e){ throw new Error('Invalid properties added in "data-props". Error is: "' + e.message + '"') }
				else settings[k.join('-')] = val;
			}
		return settings
	}
	
	
	function getCSSPath(href, config){
		if(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(href)) return href;
		else return (window.location.origin || ('//' + window.location.hostname)) + (config.rootPath + config.stylesPath + '/' + href.toLowerCase() + '.css').replace(/\/{2,}/, '/');
	}
	
	/**
	 * @desc Check if a stylesheet exists
	 * @param {String} Name of css file or the full url of the css file
	 * @return {Boolean}
	 */
	function hasCSS(name){
		var res = false;
		name = name.trim();
		for (var i = 0, l = document.styleSheets.length; i < l; i++){
			if(document.styleSheets[i].href.indexOf(name) > -1) res = true
		}
		return res;
	}
	
	// ================================================================================================
	
	$.extend(App, {
		
		config : config,
		
		/**
		 * @desc Load stylesheet 
		 */
		getCSS : function(href, data){
			href = getCSSPath(href, this.config);
			data = data || {};
			if(!hasCSS(href)){
				var link = document.createElement('LINK');
				link.type = 'text/css';
				link.rel = 'stylesheet';
				link.href = href;
				link.media = data.media || 'screen';
				document.getElementsByTagName('HEAD')[0].appendChild(link);	
			}
		},
		
		
		appendTemplate : function(tmpl, name, defaults){
			var id = defaults.templateId = name + "_PrTemplate"
			$(document.body).append("<script type='text/x-jquery-tmpl' id='" + id + "'>" + tmpl + "</script>")
		},
		
		/**
		 * @desc checks if a data-* attribute is true or not
		 * @return Boolean
		 */
		isTrue : function(option){
			if(option && (option !== 'false' && option !== null)) return true
			else return false
		},
		
		/**
		 * @desc
		 */
		bindPlugin : function(name, fn, defaults, tmpl){
			$.fn[name in $.fn? 'Pr'+name : name] = function(options){
				return this.each(function(){
					var htmlSettings = $.data(this, 'pr_' + name)
						,settings = { _invoker : fn,  _name : name };
						
					if(!htmlSettings) $.data(this, 'pr_' + name, (htmlSettings = getHTMLSettings(this))); // check and store plugin settings from HTML attrs
					$.extend(settings, defaults, htmlSettings, typeof options === 'object' && options);
					if(typeof options === 'string') settings.state = options; // If user sends a string (instead of hash) defining state of the plugin
					exec.call(this, undefined, settings);
				});
			};
			
			/**
			 * If user has provided a separate template file, load it in the document
			 */
			if(tmpl) this.appendTemplate(tmpl, name, defaults)
			
			// Auto binding on document ready
			$(function(){
				$('[data-plugin="' + name + '"]').each(function(){
					var $elem = $(this)
						,evt = $elem.attr('data-events') || 'click';
					var settings = { _invoker : fn, _name : name }
					$.data(this, 'pr_' + name, $.extend(settings, defaults, getHTMLSettings(this)))
					$elem.bind(evt, exec);
				});
			})
		}

	});
	
	
	return App
}, this)
