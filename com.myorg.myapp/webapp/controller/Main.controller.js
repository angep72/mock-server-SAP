sap.ui.define([	"sap/ui/core/mvc/Controller",	"sap/m/MessageToast","sap/ui/model/json/JSONModel"], function(Controller, MessageToast,JSONModel) {
	"use strict";
	return Controller.extend("com.myorg.myapp.controller.Main", {
       onInit:function(){
		const oModel = new JSONModel();
		oModel.loadData("localhost:3000/data");
	   },
		onPress: function() {
			MessageToast.show("Hello World");
		},
		onAdd:function(){
			alert("Add button clicked");
		}
	});
})