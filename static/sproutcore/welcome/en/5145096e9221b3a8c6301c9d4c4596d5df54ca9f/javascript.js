(function(){var a="sproutcore/standard_theme";if(!SC.BUNDLE_INFO){throw"SC.BUNDLE_INFO is not defined!"
}if(SC.BUNDLE_INFO[a]){return}SC.BUNDLE_INFO[a]={requires:["sproutcore/empty_theme"],styles:["/smartgraph-demos/static/sproutcore/standard_theme/en/52920dfdad7f0329367ed5692a2fc96881122edb/stylesheet-packed.css","/smartgraph-demos/static/sproutcore/standard_theme/en/52920dfdad7f0329367ed5692a2fc96881122edb/stylesheet.css"],scripts:["/smartgraph-demos/static/sproutcore/standard_theme/en/52920dfdad7f0329367ed5692a2fc96881122edb/javascript-packed.js"]}
})();SC.stringsFor("English",{});Welcome=SC.Object.create({NAMESPACE:"Welcome",VERSION:"1.0.0",store:SC.Store.create().from("CoreTools.DataSource"),displayTitle:function(){var a=(window.location.hostname||"localhost").toString();
return a.match(/sproutcore\.com/)?"SproutCore Demos".loc():"SproutCore Developer Tools"
}.property().cacheable()});Welcome.targetsController=SC.ArrayController.create({reload:function(){var a=Welcome.store.find(CoreTools.TARGETS_QUERY);
this.set("content",a)},appsOnly:function(){return this.filter(function(a){return(a.get("kind")==="app")&&(a.get("name")!=="/sproutcore/welcome")
})}.property("[]").cacheable(),loadApplication:function(){var b=this.get("selection").firstObject(),a=b?b.get("appUrl"):null;
if(a){this.set("canLoadApp",NO);this.invokeLater(function(){window.location.href=a
})}},canLoadApp:YES,allowsEmptySelection:NO,allowsMultipleSelection:NO});Welcome.mainPage=SC.Page.design({mainPane:SC.PanelPane.design({layout:{width:360,height:300,centerX:0,centerY:0},contentView:SC.View.design({childViews:"heading prompt icon scrollView button".w(),icon:SC.View.design({layout:{width:32,left:20,top:18,height:32},tagName:"img",render:function(a,b){a.attr("src","/smartgraph-demos/static/sproutcore/foundation/en/8a251fa716984f96f1bb0da61ecbb81c07d2fc28/images/sproutcore-logo.png")
}}),heading:SC.LabelView.design({layout:{left:56,top:20,right:20,height:32},tagName:"h1",classNames:"heading",valueBinding:"Welcome.displayTitle"}),prompt:SC.LabelView.design({layout:{left:20,top:60,right:20,height:20},escapeHTML:NO,value:"Choose an application:"}),button:SC.ButtonView.design({layout:{bottom:18,height:24,width:140,centerX:0},isEnabledBinding:"Welcome.targetsController.canLoadApp",title:"Load Application",theme:"capsule",isDefault:YES,target:"Welcome.targetsController",action:"loadApplication"}),scrollView:SC.ScrollView.design({layout:{left:20,top:80,right:20,bottom:60},hasHorizontalScroller:NO,contentView:SC.ListView.design({rowHeight:32,contentBinding:"Welcome.targetsController.appsOnly",selectionBinding:"Welcome.targetsController.selection",isEnabledBinding:"Welcome.targetsController.canLoadApp",contentValueKey:"displayName",contentIconKey:"targetIcon",hasContentIcon:YES,target:"Welcome.targetsController",action:"loadApplication"})})})})});
Welcome.main=function main(){Welcome.getPath("mainPage.mainPane").append();Welcome.targetsController.reload()
};function main(){Welcome.main()};