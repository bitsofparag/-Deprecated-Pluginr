#Pluginr#

This is a simple framework to quickly build your jQuery plugins without worrying about running it in the browser. That's right, just worry about the core plugin implementation and leave the rest to Pluginr.

##Usage##

Let's say you are creating a plugin that enables dropdown menus on list tags. Let's name the plugin JazzyDropDown

1) Load the index.html file in the [build][1] folder. Run through the steps as instructed. Enter name of plugin as *'JazzyDropDown'*

2) Create and save the resulting plugin-template file - **jazzydropdown.js**

3) **Write the implementation of your plugin!**

4) Load **pluginr.js** and **jazzydropdown.js** in your HTML file

    <script src="pluginr.js"></script>
    <script src="jazzydropdown.js"></script>

5) Add markup to enable pluginr detect the newly added plugin and how it should be enabled and run in the browser:

    <ul data-plugin="JazzyDropDown" 
        data-events="click mouseover" 
        data-props='show : openDropDown, 
                    foo : "This is just foo", 
                    onMouseOver : function(){ ... }'>
    </ul> 

where `data-props` are properties that will be extended to the default plugin settings. For example, `foo` is a property that will be used inside `JazzyDropDown` as part of it's settings. Similarly for other `data-props`

And that's it!

##Plugin Template##
A typical **Pluginr** template will look as follows:

 
    !function(name, module, context){
	context = context || window
	if (typeof window['define'] === 'function') define(['pluginr', 'text!templates/jazzydropdown.tmpl.html'], module)
  	else context[name] = module(Pluginr)
    }('JazzyDropDown', function(App, tmpl){
	'use strict';
	
	/**
	 * @desc 
	 *   This function checks for plugin CSS. If not present, loads automatically from 'stylesheets' folder in your web root.
	 *   If, however, your folder structure is different, you can specify the full css url, as in App.getCSS('http://path/to/jazzydropdown.css').
	 *   Or you can add the css for the plugin with a <link> tag in the head of the document. This function need not
	 *   be commented. If the stylesheet is already loaded, it will stop further execution of the function below.
	 */
        App.getCSS('Jazz');
	
	
	/**
	 * @desc default settings for the JazzyDropDown. Will be overridden by HTML data attributes or when specified by direct plugin call
	 */
	var defaults = {
		state : 'show' // default state of jazzydropdown
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
	function JazzyDropDown(el, options){
		this.el = el;
		this.settings = options;
	}
	
	JazzyDropDown.prototype = {
		constructor : JazzyDropDown,
		
		// Add more prototype methods, for example:
		show : function(){
			this.settings.show && this.settings.show()
		}
	}
	
	App.bindPlugin('JazzyDropDown', JazzyDropDown, defaults, tmpl)
	
	return JazzyDropDown;
    }, this) // Change 'this' to the namespace you want to add the plugin to


Just add the implementation of `JazzyDropDown` in the `prototype` methods. The rest (running the plugin in the browser, event binding etc) is taken care of automatically!

[1]: https://github.com/paragmajum/Pluginr/tree/master/build