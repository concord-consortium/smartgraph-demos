(function(){var a="sproutcore/standard_theme";if(!SC.BUNDLE_INFO){throw"SC.BUNDLE_INFO is not defined!"
}if(SC.BUNDLE_INFO[a]){return}SC.BUNDLE_INFO[a]={requires:["sproutcore/empty_theme"],styles:["/static/sproutcore/standard_theme/en/ae78e682efa8d92ab1f23de86e1e7855014416c6/stylesheet-packed.css","/static/sproutcore/standard_theme/en/ae78e682efa8d92ab1f23de86e1e7855014416c6/stylesheet.css"],scripts:["/static/sproutcore/standard_theme/en/ae78e682efa8d92ab1f23de86e1e7855014416c6/javascript-packed.js"]}
})();Smartgraphs=SC.Application.create({NAMESPACE:"Smartgraphs",VERSION:"0.1.0",store:SC.Store.create().from(SC.Record.fixtures)});
sc_require("models/question");Smartgraphs.authoringController=SC.ObjectController.create({toggleAuthoring:function(){Smartgraphs.mainPage.mainPane.authorView.addProbe("isVisible");
if(Smartgraphs.mainPage.mainPane.authorView.get("isVisible")==YES){Smartgraphs.mainPage.mainPane.authorView.set("isVisible",NO)
}else{Smartgraphs.mainPage.mainPane.authorView.set("isVisible",YES)}}});Smartgraphs.axesController=SC.ObjectController.create({padding:{top:20,right:20,bottom:20,left:40}});
Smartgraphs.dataSeriesController=SC.ArrayController.create({totalChanges:0,allowsMultipleSelection:NO,_valuesDidChange:function(){this.incrementProperty("totalChanges")
},_arrayDidChange:function(){this.forEach(function(a){a.addObserver("y",this,this._valuesDidChange)
},this)}.observes("[]")});Smartgraphs.dialogTurnController=SC.ObjectController.create({contentBinding:"Smartgraphs.guidePageController.selectedDialogTurn",contentDidChange:function(){this.invokeOnce(this._updateDialogIsComplete)
}.observes("content"),_updateDialogIsComplete:function(){if(this.get("isLastTurn")){Smartgraphs.guidePageSequenceController.set("nextPageIsSelectable",YES)
}},didReceiveCorrectResponse:function(){var a=this.get("nextTurnForNominalResponse");
Smartgraphs.guidePageController.set("selectedDialogTurn",a)},didReceiveIncorrectResponse:function(){var a=this.get("nextTurnForIncorrectResponse");
Smartgraphs.guidePageController.set("selectedDialogTurn",a)},didReceiveIncompleteResponse:function(){console.log("didReceiveIncompleteResponse")
},didReceiveMalformedResponse:function(){console.log("didReceiveMalformedResponse")
},checkResponseShouldBeVisible:null,checkResponseShouldBeVisibleBinding:SC.Binding.oneWay("Smartgraphs.responseVerifierController.responseCanBeChecked"),checkResponseShouldBeEnabled:null,checkResponseShouldBeEnabledBinding:SC.Binding.oneWay("Smartgraphs.responseVerifierController.responseIsReady")});
Smartgraphs.GuidePage=SC.Record.extend({sequence:SC.Record.toOne("Smartgraphs.GuidePageSequence",{inverse:"pages"}),index:SC.Record.attr(Number),title:SC.Record.attr(String),introText:SC.Record.attr(String),firstDialogTurn:SC.Record.toOne("Smartgraphs.DialogTurn"),selectedDialogTurn:null,isSelectable:NO});
sc_require("models/guide_page");Smartgraphs.guidePageController=SC.ObjectController.create({contentBinding:"Smartgraphs.guidePageSequenceController.selectedPage",contentDidChange:function(){console.log("Smartgraphs.guidePageController observed content");
this.invokeOnce(this._setDialogTurn)}.observes("content"),_setDialogTurn:function(){console.log("_setDialogTurn");
if(SC.none(this.get("selectedDialogTurn"))){this.set("selectedDialogTurn",this.get("firstDialogTurn"))
}}});Smartgraphs.guidePageSequenceController=SC.ArrayController.create({allowsEmptySelection:NO,allowsMultipleSelection:NO,selectObject:function(a){SC.RunLoop.begin();
arguments.callee.base.apply(this,arguments);SC.RunLoop.end()},sequenceDidChange:function(){console.log("Smartgraphs.guidePageSequenceController observed sequence");
var c=this.get("sequence");var a=c.get("pages");this.set("content",a);var b=a.objectAt(0);
if(b){b.set("isSelectable",true);this.set("selectedPage",b)}}.observes("sequence"),selectedPage:function(a,b){if(b!==undefined&&b.get("isSelectable")){this.selectObject(b)
}return this.get("selection").toArray().objectAt(0)}.property("selection"),indexOfSelectedPage:function(){var b=this.get("selection");
var c=b.indexSetForSource(this);var a=c?c.toArray().objectAt(0):undefined;return a
}.property("selectedPage","content","[]").cacheable(),previousPage:function(){var a=this.get("indexOfSelectedPage");
return(a>0)?this.objectAt(a-1):null}.property("selectedPage","content","[]").cacheable(),nextPage:function(){var a=this.get("indexOfSelectedPage");
return(a+1<this.get("length"))?this.objectAt(a+1):null}.property("selectedPage","content","[]").cacheable(),isFirstPage:null,isFirstPageBinding:SC.Binding.bool(".previousPage").not(),isLastPage:null,isLastPageBinding:SC.Binding.bool(".nextPage").not(),canSelectPreviousPage:null,canSelectPreviousPageBinding:SC.Binding.not(".isFirstPage"),nextPageIsSelectable:null,nextPageIsSelectableBinding:"*nextPage.isSelectable",canSelectNextPage:function(){return(!this.get("isLastPage")&&this.get("nextPageIsSelectable"))
}.property("isLastPage","nextPageIsSelectable").cacheable(),selectPreviousPage:function(){if(this.get("canSelectPreviousPage")){this.selectObject(this.get("previousPage"))
}},selectNextPage:function(){if(this.get("canSelectNextPage")){this.selectObject(this.get("nextPage"))
}}});Smartgraphs.responseTemplateController=SC.ObjectController.create({contentBinding:"Smartgraphs.dialogTurnController.responseTemplate",fieldTypes:null,fieldValues:null,responseArray:null,contentDidChange:function(){console.log("responseTemplateController observed content");
this.invokeOnce(this._parseTemplateString)}.observes("content"),_parseTemplateString:function(){console.log("_parseTemplateString");
var a=this.get("templateString");if(a){this.set("fieldTypes",["(a textarea)"]);this.set("fieldValues",[""]);
this.set("responseArray",[undefined])}else{this.set("fieldTypes",null);this.set("fieldValues",null);
this.set("responseArray",null)}},updateResponse:function(a,b){var c=this.get("responseArray");
c.replace(a,1,[b])}});Smartgraphs.responseVerifierController=SC.ObjectController.create({contentBinding:SC.Binding.oneWay("Smartgraphs.dialogTurnController.responseVerifier"),contentDidChange:function(){var a=this.get("content");
console.log("Smartgraphs.responseVerifierController observed content");if(!a){return
}this.invokeOnce(this._setVerifierDelegate)}.observes("content"),_setVerifierDelegate:function(){console.log("_setVerifierDelegate");
var a="Smartgraphs."+this.get("verifierDelegateName")+"VerifierDelegate";var b=SC.objectForPropertyPath(a);
b.set("configString",this.get("configString"));this.set("verifierDelegate",b)},responseCanBeChecked:null,responseCanBeCheckedBinding:SC.Binding.bool(".verifierDelegate").oneWay(),responseIsReady:null,responseIsReadyBinding:SC.Binding.oneWay("*verifierDelegate.responseIsReady"),checkResponse:function(){var a=this.get("verifierDelegate");
a.checkResponse();var d=a.get("responseIsIncomplete");var c=a.get("responseIsMalformed");
var b=a.get("responseIsCorrect");if(d){Smartgraphs.dialogTurnController.didReceiveIncompleteResponse();
return}if(c){Smartgraphs.dialogTurnController.didReceiveMalformedResponse();return
}this.set("responseAsString",a.get("responseAsString"));if(b){Smartgraphs.dialogTurnController.didReceiveCorrectResponse()
}else{Smartgraphs.dialogTurnController.didReceiveIncorrectResponse()}}});Smartgraphs.Axes=SC.Record.extend({xMax:SC.Record.attr(Number),xMin:SC.Record.attr(Number),yMax:SC.Record.attr(Number),yMin:SC.Record.attr(Number),ySteps:SC.Record.attr(Number),xSteps:SC.Record.attr(Number)});
sc_require("models/axes");Smartgraphs.Axes.FIXTURES=[{guid:1,xMin:0,xMax:10,yMin:0,yMax:2000,xSteps:10,ySteps:10}];
Smartgraphs.DataPoint=SC.Record.extend({series:SC.Record.toOne("Smartgraphs.DataSeries",{inverse:"points"}),x:SC.Record.attr(Number),y:SC.Record.attr(Number)});
sc_require("models/data_point");Smartgraphs.DataPoint.FIXTURES=[{x:1,y:200,guid:1,series:"series-1"},{x:2,y:400,guid:2,series:"series-1"},{x:3,y:600,guid:3,series:"series-1"},{x:4,y:800,guid:4,series:"series-1"},{x:5,y:800,guid:5,series:"series-1"},{x:6,y:800,guid:6,series:"series-1"},{x:7,y:1050,guid:7,series:"series-1"},{x:8,y:1300,guid:8,series:"series-1"},{x:9,y:1550,guid:9,series:"series-1"},{x:10,y:1800,guid:10,series:"series-1"}];
Smartgraphs.DataSeries=SC.Record.extend({points:SC.Record.toMany("Smartgraphs.DataPoint",{inverse:"series"})});
sc_require("models/data_series");Smartgraphs.Pair=SC.Object.extend({x:null,y:null});
Smartgraphs.DataSeries.FIXTURES=[{guid:"series-1",points:(function(){var b=[];for(var a=1;
a<=10;a++){b.push(a+"")}return b}())}];Smartgraphs.DialogTurn=SC.Record.extend({beforeText:SC.Record.attr(String),responseTemplate:SC.Record.toOne("Smartgraphs.ResponseTemplate"),responseVerifier:SC.Record.toOne("Smartgraphs.ResponseVerifier"),staticAnnotationList:SC.Record.toOne("Smartgraphs.StaticAnnotationList"),afterText:SC.Record.attr(String),nextTurnForNominalResponse:SC.Record.toOne("Smartgraphs.DialogTurn"),nextTurnForIncorrectResponse:SC.Record.toOne("Smartgraphs.DialogTurn"),isLastTurn:SC.Record.attr(Boolean)});
sc_require("models/dialog_turn");Smartgraphs.DialogTurn.FIXTURES=[{guid:"turn-1",beforeText:"<p>Click the point in the scatter plot that shows when and where Maria might have stopped to talk to her coach.</p>",responseTemplate:null,responseVerifier:"verifier-1",afterText:"",nextTurnForNominalResponse:"turn-1-done",nextTurnForIncorrectResponse:"turn-1a",isLastTurn:NO},{guid:"turn-1a",beforeText:"<p>Click the point in the scatter plot that shows when and where Maria might have stopped to talk to her coach.</p>",responseTemplate:null,responseVerifier:"verifier-1",afterText:"<p>Incorrect.</p><p>Hint 1: Look at the graph and table and find where Maria’s distance stayed the same.</p>",nextTurnForNominalResponse:"turn-1-done",nextTurnForIncorrectResponse:"turn-1b",isLastTurn:NO},{guid:"turn-1b",beforeText:"<p>Click the point in the scatter plot that shows when and where Maria might have stopped to talk to her coach.</p>",responseTemplate:null,responseVerifier:"verifier-1",afterText:"<p>Incorrect.</p><p>Hint 2: In these two intervals, Maria’s distance changed as time passed.</p><p><i>The intervals on the left and right will be highlighted</i></p>",nextTurnForNominalResponse:"turn-1-done",nextTurnForIncorrectResponse:"turn-1c",isLastTurn:NO},{guid:"turn-1c",beforeText:"<p>Click the point in the scatter plot that shows when and where Maria might have stopped to talk to her coach.</p>",responseTemplate:null,responseVerifier:"verifier-1",afterText:"<p>Incorrect.</p><p>Hint 3: In this interval, Maria’s distance stayed the same as time passed.</p><p><i>The stationary interval will be highlighted</i></p>",nextTurnForNominalResponse:"turn-1-done",nextTurnForIncorrectResponse:"turn-1d",isLastTurn:NO},{guid:"turn-1d",beforeText:"<p>If you look carefully, you'll see that between four and six minutes, Maria did not move.</p><p>Therefore we say she stopped at four minutes</p>.",responseTemplate:null,responseVerifier:null,afterText:"",nextTurnForNominalResponse:null,nextTurnForIncorrectResponse:null,isLastTurn:YES},{guid:"turn-1-done",beforeText:"<p>Correct! Four minutes into her run, Maria’s distance stayed the same compared to the next few minutes, meaning she stopped running.",responseTemplate:null,responseVerifer:null,afterText:"",nextTurnForNominalResponse:null,nextTurnForIncorrectResponse:null,isLastTurn:YES},{guid:"turn-2",beforeText:"<p>How many meters did Maria run before she stopped to talk to her coach?</p>",responseTemplate:"template-1",responseVerifier:"verifier-2",afterText:"",nextTurnForNominalResponse:"turn-2-done",nextTurnForIncorrectResponse:"turn-2a",isLastTurn:NO},{guid:"turn-2a",beforeText:"<p>How many meters did Maria run before she stopped to talk to her coach?</p>",responseTemplate:"template-1",responseVerifier:"verifier-2",afterText:"<p>Incorrect.</p><p>Hint 1: Look at the data and find how many minutes passed before Maria stopped.</p>",nextTurnForNominalResponse:"turn-2-done",nextTurnForIncorrectResponse:"turn-2b",isLastTurn:NO},{guid:"turn-2b",beforeText:"<p>How many meters did Maria run before she stopped to talk to her coach?</p>",responseTemplate:"template-1",responseVerifier:"verifier-2",afterText:"<p>Incorrect.</p><p>Hint 2: Here is where Maria stopped. Find her distance at this point.</p><p><i>The point at 4 minutes, 800 meters will be highlighted.</i></p>",nextTurnForNominalResponse:"turn-2-done",nextTurnForIncorrectResponse:"turn-2c",isLastTurn:NO},{guid:"turn-2c",beforeText:"<p>How many meters did Maria run before she stopped to talk to her coach?</p>",responseTemplate:"template-1",responseVerifier:"verifier-2",afterText:"<p>Incorrect.</p><p>Hint 3: Find Maria’s distance at this point.</p><p><i>A horizontal line will be drawn from the 800 meter point on the y axis to the point at 4 minutes, 800 meters.</i></p>",nextTurnForNominalResponse:"turn-2-done",nextTurnForIncorrectResponse:"turn-2d",isLastTurn:NO},{guid:"turn-2d",beforeText:"<p>Remember from the last question that Maria stopped at four minutes. Use the graph to convince yourself that she had run 800 meters by that point.</p>",responseTemplate:null,responseVerifier:null,afterText:"",nextTurnForNominalResponse:null,nextTurnForIncorrectResponse:null,isLastTurn:YES},{guid:"turn-2-done",beforeText:"<p>Correct. Maria had run 800 meters when she stopped at four minutes</p>",responseTemplate:null,responseVerifier:null,afterText:"",nextTurnForNominalResponse:null,nextTurnForIncorrectResponse:null,isLastTurn:YES}];
sc_require("models/guide_page");Smartgraphs.GuidePage.FIXTURES=[{guid:1,sequence:"sequence-1",index:1,title:"Maria Runs",introText:"<p>Maria ran practice laps around the school track. Her coach recorded the distance she ran after each minute.</p><p>These data are shown in the scatter plot and the table at right.</p>",firstDialogTurn:"turn-1"},{guid:2,sequence:"sequence-1",index:2,title:"She Stops to Talk",introText:"<p>Maria ran practice laps around the school track. Her coach recorded the distance she ran after each minute.</p><p>These data are shown in the scatter plot and the table at right.</p>",firstDialogTurn:"turn-2"}];
Smartgraphs.GuidePageSequence=SC.Record.extend({pages:SC.Record.toMany("Smartgraphs.GuidePage",{inverse:"sequence",orderBy:["index"]})});
sc_require("models/guide_page_sequence");Smartgraphs.GuidePageSequence.FIXTURES=[{guid:"sequence-1",pages:["1","2"]}];
(function(){var a=[{guid:1,sequence:"sequence-1",index:1,shortName:"Maria Runs",responseType:Smartgraphs.GRAPH_ANNOTATION_RESPONSE,prompt:"<p>Maria ran practice laps around the track. Her coach wrote the distance she ran after each minute. These data are shown in the scatterplot and the table at right.</p><p>Click on the point in the scatterplot that shows where and when Maria first stopped to talk to her coach.</p>",correctResponse:"4",correctResponseFeedback:"<p>That's correct. Maria stopped at 4 minutes, after having run 800 meters.</p>",incorrectResponseFeedback:"<p>That's not quite right. Remember that when Maria stops, her distance stays the same at successive time points.</p><p>See if you can use that hint to find the point where Maria first stopped to talk to her coach. </p><p><i>(Imagine this and similar feedback being displayed in animated, graphical form.)</i></p>"},{guid:2,sequence:"sequence-1",index:2,shortName:"She Gets A Pep Talk",responseType:Smartgraphs.TEXT_RESPONSE,prompt:"<p>For how many minutes did Maria talk with her coach?</p>",correctResponse:"2",correctResponseFeedback:"<p>That's correct. Maria stopped at 4 minutes, and didn't move again until 6 minutes.</p>",incorrectResponseFeedback:"<p>That's not correct. Look for the group of time points where the y value, which represents Maria's distance, remains the same. Then subtract the latest time from the earliest time.</p><p><i>(Imagine this feedback broken into component steps, each graphical in nature, that build up a visual/animated set of annotations that can be reviewed later.)</i></p>"},{guid:3,sequence:"sequence-1",index:3,shortName:"She Runs Again",responseType:Smartgraphs.TEXT_RESPONSE,prompt:"<p><i>(This is a slightly trickier question that illustrates a next step towards more interesting questions that could be posed and that could have interactive, graphical scaffolds.)</i></p><p>Did you notice that Maria's coach must have written down her position three times while they were talking?</p><p>After the third time he wrote down her position, about how many <em>seconds</em> did Maria take to start running again?</p>",correctResponse:"0",correctResponseFeedback:"<p>That's correct. You can tell from the slope of her position versus time graph that she must have started right away.</p>",incorrectResponseFeedback:"<p>That's not quite right... </p><p><i>(We could visualize the intersection of the 'chatting' line segment and last 'running' line segment, perhaps including animated and/or interactive explorations of where that intersection would be if Maria had waited longer to start running.)</i></p>"}]
}());Smartgraphs.ResponseTemplate=SC.Record.extend({templateString:SC.Record.attr(String)});
sc_require("models/response_template");Smartgraphs.ResponseTemplate.FIXTURES=[{guid:"template-1",templateString:"(a textarea should show)"}];
Smartgraphs.ResponseVerifier=SC.Record.extend({verifierDelegateName:SC.Record.attr(String),configString:SC.Record.attr(String)});
sc_require("models/response_verifier");Smartgraphs.ResponseVerifier.FIXTURES=[{guid:"verifier-1",verifierDelegateName:"GraphSelection",configString:"x: 4"},{guid:"verifier-2",verifierDelegateName:"ResponseTemplate",configString:"number: 800"}];
Smartgraphs.StaticAnnotation=SC.Record.extend({list:SC.Record.toOne("Smartgraphs.StaticAnnotationList",{inverse:"annotations"}),type:SC.Record.attr(String),args:SC.Record.attr(String)});
Smartgraphs.StaticAnnotationList=SC.Record.extend({annotations:SC.Record.toMany("Smartgraphs.StaticAnnotation",{inverse:"list"})});
Smartgraphs.VerifierDelegate=SC.Object.extend({isVerifierDelegate:YES,configString:"",checkResponse:null,responseAsString:"",responseIsIncomplete:YES,responseIsMalformed:NO,responseIsCorrect:NO});
sc_require("verifier_delegates/verifier_delegate");Smartgraphs.GraphSelectionVerifierDelegate=Smartgraphs.VerifierDelegate.create({checkResponse:function(){if(this.get("responseIsIncomplete")){return
}if(this.get("responseIsMalformed")){return}var a;var b=this.get("configString");
if(b.indexOf("x:")===0){a=parseFloat(b.substring(2))}else{throw"GraphSelectionVerifierDelegate received a configString that didn't start with 'x:'"
}var d=this.get("selectedPoint");this.set("responseAsString","the point ("+d.get("x")+", "+d.get("y")+")");
this.set("responseIsMalformed",NO);var c=d.get("x");this.set("responseIsCorrect",c===a)
},graphSelectionBinding:SC.Binding.oneWay("Smartgraphs.dataSeriesController.selection"),responseIsReady:function(){var a=this.get("graphSelection");
return(!!a&&a.get("length")===1)}.property("graphSelection").cacheable(),responseIsIncomplete:function(){return !this.get("responseIsReady")
}.property("responseIsReady").cacheable(),responseIsMalformed:function(){var a=this.get("graphSelection");
return(a&&a.get("length")>1)}.property("graphSelection").cacheable(),selectedPoint:function(){var a=this.get("graphSelection");
return((a&&a.get("length")===1)?a.toArray().objectAt(0):undefined)}.property("graphSelection").cacheable()});
sc_require("verifier_delegates/verifier_delegate");Smartgraphs.ResponseTemplateVerifierDelegate=Smartgraphs.VerifierDelegate.create({checkResponse:function(){if(this.get("responseIsIncomplete")){return
}var b;var a=NO;var d=this.get("configString");if(d.indexOf("number:")===0){a=YES;
b=parseFloat(d.substring(7))}else{if(d.indexOf("string:"===0)){b=d.substring(7)}else{throw"ResponseTemplateVerifierDelegate received a configString that didn't start with 'number:' or 'string:'"
}}var c=this.get("response");this.set("responseAsString",c);this.set("responseIsMalformed",NO);
if(a){c=parseFloat(c);if(isNaN(c)){this.set("responseIsMalformed",YES)}}if(this.get("responseIsMalformed")){return
}this.set("responseIsCorrect",c===b)},responseArrayBinding:SC.Binding.oneWay("Smartgraphs.responseTemplateController.responseArray"),_oldResponseArray:null,responseArrayDidChange:function(){console.log("ResponseTemplateVerifierDelegate observed responseArray");
var a=this.get("responseArray");if(this._oldResponseArray){this._oldResponseArray.removeObserver("[]",this,this.rawResponseDidChange)
}if(a){a.addObserver("[]",this,this.rawResponseDidChange)}this._oldResponseArray=a;
this.rawResponseDidChange()}.observes("responseArray"),rawResponseDidChange:function(){console.log("Smartgraphs.ResponseTemplateVerifierDelegate rawResponseDidChange");
var b=this.get("responseArray");var a=(b&&b.get(length)>0)?b.objectAt(0):null;if(typeof a==="string"){a=a.strip()
}this.set("response",a)},responseIsReady:function(){var a=this.get("response");return(!!a&&(a.length>0))
}.property("response").cacheable(),responseIsIncomplete:function(){return !this.get("responseIsReady")
}.property("responseIsReady").cacheable()});Smartgraphs.AxesView=SC.View.extend({displayProperties:"xMin xMax yMin yMax padding".w(),didCreateLayer:function(){this.$().css("zIndex","-1")
},render:function(c,a){var m=this.get("parentView");var p=m.get("raphaelObject");
var l=this.get("padding");var h=m.get("layout");var d=this.get("xMin"),g=this.get("xMax"),n=this.get("yMin"),e=this.get("yMax"),f=this.get("xSteps"),i=this.get("ySteps");
if(p&&l&&h&&(d!==undefined)&&(g!==undefined)&&(n!==undefined)&&(e!==undefined)){var o=h.height,b=h.width;
var k=b-l.left-l.right;var j=o-l.top-l.bottom;if(this._x){this._x.remove()}this._x=p.g.axis(l.left,l.top+j,k,0,g,f,0);
if(this._y){this._y.remove()}this._y=p.g.axis(l.left,l.top+j,j,0,e,i,1);this.renderChildViews(c,a)
}}});Smartgraphs.DialogTurnView=SC.View.extend({useStaticLayout:YES,childViews:"beforeTextView responseFieldsView afterTextView buttonsView".w(),beforeTextView:SC.StaticContentView.design({contentBinding:SC.Binding.oneWay("Smartgraphs.dialogTurnController.beforeText"),isVisibleBinding:SC.Binding.bool("Smartgraphs.dialogTurnController.beforeText")}),responseFieldsView:SC.StaticContentView.design({fieldTypesBinding:"Smartgraphs.responseTemplateController.fieldTypes",fieldValuesBinding:"Smartgraphs.responseTemplateController.fieldValues",fieldsTypesDidChange:function(){console.log("fieldTypesDidChange");
this.invokeOnce(this._updateChildViews)}.observes("fieldTypes"),fieldValuesDidChange:function(){console.log("fieldValuesDidChange");
this.invokeOnce(this._updateChildViews)}.observes("fieldValues"),_updateChildViews:function(){console.log("_updateChildViews");
this.removeAllChildren();this.contentLayoutDidChange();var c=this.get("fieldTypes");
var e=this.get("fieldValues");if(!c){return}for(var b=0,d=c.get("length");b<d;b++){var a=SC.View.design({useStaticLayout:YES,layout:{top:0,height:22,left:0,width:150},childViews:[SC.TextFieldView.design({index:b,valueDidChange:function(){console.log("responseFieldsView's child textFieldView observed value");
var f=this.get("index");Smartgraphs.responseTemplateController.updateResponse(f,this.get("value"))
}.observes("value")})]});this.appendChild(a.create())}this.contentLayoutDidChange()
}}),afterTextView:SC.StaticContentView.design({contentBinding:SC.Binding.oneWay("Smartgraphs.dialogTurnController.afterText"),isVisibleBinding:SC.Binding.bool("Smartgraphs.dialogTurnController.afterText")}),buttonsView:SC.View.design({useStaticLayout:YES,layout:{height:24},childViews:"checkResponseButton".w(),checkResponseButton:SC.ButtonView.design({layout:{width:140,right:0},title:"Check My Answer",isVisibleBinding:SC.Binding.oneWay("Smartgraphs.dialogTurnController.checkResponseShouldBeVisible"),isEnabledBinding:SC.Binding.oneWay("Smartgraphs.dialogTurnController.checkResponseShouldBeEnabled"),target:"Smartgraphs.responseVerifierController",action:"checkResponse"})})});
Smartgraphs.EditableListItemView=SC.ListItemView.extend({inlineEditorShouldBeginEditing:function(){return YES
}});Smartgraphs.QuestionAuthorView=SC.View.extend({isVisible:NO,childViews:"titleLabel indexViewLabel indexView shortNameViewLabel shortNameView responseTypeViewLabel responseTypeView promptViewLabel promptView correctResponseViewLabel correctResponseView correctResponseFeedbackViewLabel correctResponseFeedbackView incorrectResponseFeedbackViewLabel incorrectResponseFeedbackView".w(),titleLabel:SC.LabelView.design({layout:{top:0,height:20,width:300},textAlign:"center",backgroundColor:"black",value:"Selected Question's Data:"}),indexViewLabel:SC.LabelView.design({layout:{top:20,height:20,width:300},backgroundColor:"grey",value:"Question#:"}),indexView:SC.LabelView.design({layout:{top:40,height:20,width:300},isEditable:NO,backgroundColor:"darkgrey",valueBinding:"*parentView.content.index"}),shortNameViewLabel:SC.LabelView.design({layout:{top:60,height:20,width:300},backgroundColor:"grey",value:"Short Name for navigation tabs:"}),shortNameView:SC.LabelView.design({layout:{top:80,height:20,width:300},isEditable:YES,backgroundColor:"darkblue",valueBinding:"*parentView.content.shortName"}),responseTypeViewLabel:SC.LabelView.design({layout:{top:100,height:20,width:300},backgroundColor:"grey",value:"Response Type:"}),responseTypeView:SC.LabelView.design({layout:{top:120,height:20,width:300},isEditable:YES,backgroundColor:"darkblue",valueBinding:"*parentView.content.responseType"}),promptViewLabel:SC.LabelView.design({layout:{top:140,height:20,width:300},backgroundColor:"grey",value:"Question Prompt:"}),promptView:SC.LabelView.design({layout:{top:160,height:80,width:300},isInlineEditorMultiline:YES,isEditable:YES,backgroundColor:"darkblue",valueBinding:"*parentView.content.prompt"}),correctResponseViewLabel:SC.LabelView.design({layout:{top:240,height:20,width:300},backgroundColor:"grey",value:"Correct Response:"}),correctResponseView:SC.LabelView.design({layout:{top:260,height:80,width:300},isInlineEditorMultiline:YES,isEditable:YES,backgroundColor:"darkblue",valueBinding:"*parentView.content.correctResponse"}),correctResponseFeedbackViewLabel:SC.LabelView.design({layout:{top:340,height:20,width:300},backgroundColor:"grey",value:"Correct Response Feedback:"}),correctResponseFeedbackView:SC.LabelView.design({layout:{top:360,height:80,width:300},isInlineEditorMultiline:YES,isEditable:YES,backgroundColor:"darkblue",valueBinding:"*parentView.content.correctResponseFeedback"}),incorrectResponseFeedbackViewLabel:SC.LabelView.design({layout:{top:440,height:20,width:300},backgroundColor:"grey",value:"Incorrect Response Feedback:"}),incorrectResponseFeedbackView:SC.LabelView.design({layout:{top:460,height:80,width:300},isInlineEditorMultiline:YES,isEditable:YES,backgroundColor:"darkblue",valueBinding:"*parentView.content.incorrectResponseFeedback"})});
Smartgraphs.RaphaelView=SC.View.extend({raphaelObject:null,_childViewForId:{},_lastViewForMouseMove:null,didCreateLayer:function(){var b=Raphael;
var c=this.get("frame");var a=b(this.get("layer"),c.width,c.height);a.canvas.raphael=a;
this.set("raphaelObject",a)},registerChildView:function(a,b){this._childViewForId[b]=a
},_ID_MATCHER:/^(sc\d+)/,_childViewForEvent:function(b){var c=b.target.id;var a=c.match(this._ID_MATCHER);
return a?this._childViewForId[a[1]]:null},mouseMoved:function(c){var b=this._childViewForEvent(c);
if(b&&b.mouseMoved){b.mouseMoved(c)}var a=this._lastViewForMouseMove;if(b!==a){if(a&&a.mouseExited){a.mouseExited(c)
}if(b&&b.mouseEntered){b.mouseEntered(c)}}this._lastViewForMouseMove=b},mouseDown:function(b){var a=this._childViewForEvent(b);
if(a){return a.mouseDown(b)}}});Smartgraphs.SeriesView=SC.View.extend({_raphaelObjForId:{},_dataPointForId:{},_highlightedPoint:null,NO_HIGHLIGHT_ATTR:{r:4},HIGHLIGHT_ATTR:{r:6},SELECTED_ATTR:{stroke:"#aa0000",fill:"#aa0000",opacity:0.8},NOT_SELECTED_ATTR:{stroke:"#BFADA7",fill:"#BFADA7",opacity:0.5},DATA_POINT_ID_MATCHER:"",id:"",init:function(){arguments.callee.base.apply(this,arguments);
this.id=SC.guidFor(this);this.DATA_POINT_ID_MATCHER=new RegExp(this.id+"-data-point-(\\d+)");
var a=this.get("parentView");a.registerChildView(this,this.id)},displayProperties:"xMin xMax yMin yMax padding selection content content.totalChanges content.[]".w(),didCreateLayer:function(){this.$().css("zIndex","-1")
},mouseDown:function(c){var d=this._dataPointForId[c.target.id];if(d){var a=this.get("controller");
var b=this.get("selection");if(b.contains(d)){a.deselectObject(d)}else{a.selectObject(d,NO)
}}},mouseEntered:function(b){var a=this._raphaelObjForId[b.target.id];if(a){a.attr(this.HIGHLIGHT_ATTR)
}this._highlightedPoint=a},mouseExited:function(b){var a=this._highlightedPoint;if(a){a.attr(this.NO_HIGHLIGHT_ATTR)
}this._highlightedPoint=null},render:function(d,g){var k=this.get("parentView");var B=k.$().children()[0];
var e=(B&&B.raphael)?B.raphael:null;var o=this.get("padding");var v=k.get("layout");
var w=this.get("xMin"),z=this.get("xMax"),a=this.get("yMin"),b=this.get("yMax");if(e&&o&&v&&(w!==undefined)&&(z!==undefined)&&(a!==undefined)&&(b!==undefined)){var p=v.height,r=v.width;
var f=r-o.left-o.right;var u=p-o.top-o.bottom;var D=f/z;var c=u/b;var A=this._raphaelObjForId;
for(var j in A){if(A.hasOwnProperty(j)){A[j].remove()}}this._raphaelObjForId={};this._dataPointForId={};
var m=this.get("content");var C=this.get("selection");for(var t=0,n=m.get("length");
t<n;t++){var q=m.objectAt(t);var l=o.left+(q.get("x")*D);var h=o.top+u-(q.get("y")*c);
var s=e.circle(l,h).attr(this.NO_HIGHLIGHT_ATTR);if(C.contains(q)){s.attr(this.SELECTED_ATTR)
}else{s.attr(this.NOT_SELECTED_ATTR)}s.node.id=this.id+"-data-point-%@".fmt(t);this._raphaelObjForId[s.node.id]=s;
this._dataPointForId[s.node.id]=q}}}});Smartgraphs.main=function main(){Smartgraphs.getPath("mainPage.mainPane").append();
var b=Smartgraphs.store.find(Smartgraphs.DataSeries,"series-1");var c=Smartgraphs.store.find(Smartgraphs.Axes,"1");
Smartgraphs.dataSeriesController.set("content",b.get("points"));Smartgraphs.axesController.set("content",c);
var a=Smartgraphs.store.find(Smartgraphs.GuidePageSequence,"sequence-1");Smartgraphs.guidePageSequenceController.set("sequence",a)
};function main(){Smartgraphs.main()}sc_require("main");Smartgraphs.mainPage=SC.Page.design({mainPane:SC.MainPane.design({layout:{width:1470,height:820},childViews:"dialogView graphView tableView".w(),dialogView:SC.View.design({layout:{left:20,top:20,width:455,height:680},classNames:"smartgraph-pane".w(),childViews:"navButtons textView nextButton backButton".w(),navButtons:SC.SegmentedView.design({layout:{top:25},displayProperties:"nextPageIsSelectable".w(),itemsBinding:SC.Binding.oneWay("Smartgraphs.guidePageSequenceController"),itemTitleKey:"title",itemIsEnabledKey:"isSelectable",valueBinding:"Smartgraphs.guidePageSequenceController.selectedPage",nextPageIsSelectableBinding:SC.Binding.oneWay("Smartgraphs.guidePageSequenceController*nextPage.isSelectable")}),textView:SC.View.design({layout:{top:60,left:20,right:20,bottom:80},classNames:"text-view".w(),childViews:"introTextView dialogTurnView".w(),introTextView:SC.StaticContentView.design({contentBinding:SC.Binding.oneWay("Smartgraphs.guidePageController.introText"),isVisibleBinding:SC.Binding.bool("Smartgraphs.guidePageController.introText")}),dialogTurnView:Smartgraphs.DialogTurnView.design({})}),nextButton:SC.ButtonView.design({displayProperties:["isEnabled"],layout:{bottom:36,height:24,right:50,width:80},title:"Next >>",target:"Smartgraphs.guidePageSequenceController",action:"selectNextPage",isEnabledBinding:SC.Binding.oneWay("Smartgraphs.guidePageSequenceController.canSelectNextPage"),isVisibleBinding:SC.Binding.not("Smartgraphs.guidePageSequenceController.isLastPage").oneWay()}),backButton:SC.ButtonView.design({displayProperties:["isEnabled"],layout:{bottom:36,height:24,left:50,width:80},title:"<< Back",target:"Smartgraphs.guidePageSequenceController",action:"selectPreviousPage",isEnabledBinding:SC.Binding.oneWay("Smartgraphs.guidePageSequenceController.canSelectPreviousPage"),isVisibleBinding:SC.Binding.not("Smartgraphs.guidePageSequenceController.isFirstPage").oneWay()})}),graphView:Smartgraphs.RaphaelView.design({layout:{left:485,top:20,width:455,height:335},childViews:"axesView series1View".w(),classNames:["smartgraph-pane"],axesView:Smartgraphs.AxesView.design({xMinBinding:"Smartgraphs.axesController.xMin",xMaxBinding:"Smartgraphs.axesController.xMax",yMinBinding:"Smartgraphs.axesController.yMin",yMaxBinding:"Smartgraphs.axesController.yMax",xStepsBinding:"Smartgraphs.axesController.xSteps",yStepsBinding:"Smartgraphs.axesController.ySteps",paddingBinding:"Smartgraphs.axesController.padding"}),series1View:Smartgraphs.SeriesView.design({xMinBinding:"Smartgraphs.axesController.xMin",xMaxBinding:"Smartgraphs.axesController.xMax",yMinBinding:"Smartgraphs.axesController.yMin",yMaxBinding:"Smartgraphs.axesController.yMax",xScaleBinding:"Smartgraphs.axesController.xScale",yScaleBinding:"Smartgraphs.axesController.yScale",paddingBinding:"Smartgraphs.axesController.padding",controllerBinding:"Smartgraphs.dataSeriesController",contentBinding:"Smartgraphs.dataSeriesController.arrangedObjects",selectionBinding:"Smartgraphs.dataSeriesController.selection"})}),tableView:SC.View.design({layout:{left:485,top:365,width:455,height:335},classNames:["smartgraph-pane"],childViews:["labelsView","scrollerView"],labelsView:SC.View.design({layout:{left:0,top:0,width:455,height:30},childViews:["xsLabel","ysLabel"],xsLabel:SC.LabelView.design({layout:{left:10,width:40,top:7,height:20},displayValue:"time"}),ysLabel:SC.LabelView.design({layout:{left:70,width:50,top:7,height:20},displayValue:"distance"})}),scrollerView:SC.ScrollView.design({layout:{left:0,top:30,width:455,height:305},borderStyle:SC.BORDER_NONE,contentView:SC.View.design({childViews:["xsView","ysView"],xHeightBinding:SC.Binding.from(".xsView.height").oneWay(),yHeightBinding:SC.Binding.from(".ysView.height").oneWay(),height:function(){return Math.max(this.get("xHeight"),this.get("yHeight"))
}.property("xHeight","yHeight").cacheable(),_heightDidChange:function(){this.adjust("height",this.get("height"))
}.observes("height"),xsView:SC.ListView.design({height:function(){var a=this.get("layout");
return this.get("calculatedHeight")+(a.top||0)+(a.bottom||0)}.property("calculatedHeight","layout").cacheable(),layout:{left:10,top:0,bottom:15,width:50},canEditContent:NO,contentValueKey:"x",contentBinding:"Smartgraphs.dataSeriesController.arrangedObjects",selectionBinding:"Smartgraphs.dataSeriesController.selection",rowHeight:18}),ysView:SC.ListView.design({height:function(){var a=this.get("layout");
return this.get("calculatedHeight")+(a.top||0)+(a.bottom||0)}.property("calculatedHeight","layout").cacheable(),layout:{left:70,top:0,bottom:15,width:50},isEditable:YES,canEditContent:YES,exampleView:Smartgraphs.EditableListItemView,contentValueKey:"y",contentBinding:"Smartgraphs.dataSeriesController.arrangedObjects",selectionBinding:"Smartgraphs.dataSeriesController.selection",rowHeight:18})})})})})});