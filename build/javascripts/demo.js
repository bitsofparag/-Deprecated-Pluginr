define(["jQuery", "text!templates/plugin_maker.tmpl.txt"], function (a, b) {
	require(['zclip.min'], function(){
		function c(b) {
	        var c = a(".active"),
	            d = a(b);
	        d.one("webkitAnimationEnd", function () {
	            d.removeClass("slide in");
	            if ("page2" === d[0].id) {
	                var c = a("#clip_button");
	                a("#page2 textarea").select();
	                c.zclip({
						path:'ZeroClipboard.swf',
						copy: a("#page2 textarea").val(),
						beforeCopy:function(){
							c.css("color", "rgb(200,50,50)");
						},
						afterCopy:function(){
							c.text("Copied!")
						}
					});
	            }
	        }).addClass("active slide in");
	        c.one("webkitAnimationEnd", function () {
	            c.removeClass("slide out active")
	        }).addClass("slide out")
	    }
	    a = a || window.$;
	    a("#loader").hide();
	    a("section").first().addClass("active");
	    a("a").click(function (a) {
	        a.preventDefault()
	    });
	    a("#make_plugin_submit").click(function () {
	        if (2 > a("#make_plugin").val().length) return !1;
	        c("#page2");
	        var d = localStorage,
	            e;
	        e = a("#make_plugin").val().split(" ");
	        for (var f = [], i, j = 0, k = e.length; j < k; j++) i = e[j], 0 !== i.length && f.push(i.replace(/(.)?/, function (a, b) {
	            return b ? b.toUpperCase() : ""
	        }));
	        e = f.join("");
	        d = d.tmp_plugin = e;
	        e = d.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "_").toLowerCase();
	        if ($("#include_css").prop("checked") === false) b = b.replace("App.getCSS('{{Plugin}}');", "//CSS Loader Removed!");
	        if ($("#include_tmpl").prop("checked") === false) b = b.replace("'text!templates/{{plugin}}.tmpl.html',", "").replace("function(tmpl,", "function(").replace("if(tmpl) App.appendTemplate(tmpl, document.body)", "//if(tmpl) App.appendTemplate(tmpl, document.body)");
	        a("#make_plugin_output").val(b.replace(/{{plugin}}/g, d.toLowerCase()).replace(/{{Plugin}}/g, d).replace(/{{pluginDashed}}/g, e))
	    });
	    a("#page2 .next").click(function () {
	        var b = a("#page3").find("ul");
	        c("#page3");
	        b.html(unescape(b[0].innerHTML).replace(/{{plugin}}/g, localStorage.tmp_plugin.toLowerCase()).replace("{{Plugin}}", localStorage.tmp_plugin));
	        a("#page3 .last").html(a("#page3 .last").html().replace("{{plugin}}", localStorage.tmp_plugin.toLowerCase()))
	    })
	})
})