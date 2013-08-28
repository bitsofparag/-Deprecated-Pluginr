/**
 * @desc Add plugin description here
 * @usage
 *   1) If using jQuery
 *      $('#dom').myalert(options)
 *
 *   2) If not using jQuery
 *      var domNode = document.getElementById('dom') 
 *      var myalert = new MyAlert(domNode, options)
 *      myalert.show() // or any other method of the plugin
 *
 *   3) If using HTML-based binding - simple case
 *       <a class="button" data-plugin="MyAlert" data-events="click">Click me</a>
 *
 *   4) If using HTML-based binding - with plugin attributes for example
 *       <a class="button" data-plugin="MyAlert" data-events="click" data-props='foo : "This is property Foo", bar : "bar, bar", baz : function(){}'>Click me</a>
 *       
 */
!function(name, module, context){
	context = context || window
	if (typeof window['define'] === 'function') define(['pluginr', 'text!templates/myalert.tmpl.html'], module)
  	else context[name] = module(Pluginr)
}('MyAlert', function(App, tmpl){
	'use strict';
	
	/**
	 * @desc 
	 *   This function checks for plugin CSS. If not present, loads automatically from 'stylesheets' folder in your web root.
	 *   If, however, your folder structure is different, you can specify the full css url, as in App.getCSS('http://path/to/myalert.css').
	 *   Or you can add the css for the plugin with a <link> tag in the head of the document. This function need not
	 *   be commented. If the stylesheet is already loaded, it will stop further execution of the function below.
	 */
	//CSS Loader Removed!
	
	debugger;
	/**
	 * @desc default settings for the MyAlert. Will be overridden by HTML data attributes or when specified by direct plugin call
	 */
	var defaults = {
		state : 'show' // default state of myalert
		// Add more default options here
	};
	
	/* ------------------------------------- Private methods below --------------------------------------- */
	
	/**
	 * @desc Desc of the private method
	 * @return Add return
	 * 
	 * function myprivate() {
     *   
     * }
    */

	/* ------------------------------------- Private methods section ends --------------------------------------- */
	
	
	
	/* ------------------------------------- COMPONENT DEFINITION -------------------------------------------- */
	function MyAlert(el, options){
		this.el = el;
		this.settings = options;
	}
	
	MyAlert.prototype = {
		constructor : MyAlert,
		
		// Add more prototype methods
		show : function(){
			this.settings.show && this.settings.show()
		}
	}
	
	App.bindPlugin('MyAlert', MyAlert, defaults, tmpl)
	
	return MyAlert;
}, this) // Change 'this' to the namespace you want to add the plugin to