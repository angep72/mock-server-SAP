sap.ui.define([	"sap/ui/core/mvc/Controller",	"sap/m/MessageToast","sap/ui/model/json/JSONModel"], function(Controller, MessageToast,JSONModel) {
	"use strict";
	return Controller.extend("com.myorg.myapp.controller.Main", {
       onInit:function(){
		const oModel = new JSONModel();
		oModel.loadData("http://localhost:3000/data");
		this.getView().setModel(oModel);

		// You can directly access the model data if needed
		var oData = oModel.getData();  // This gets the raw data from the model
		console.log(oData);  
	   },
		onPress: function() {
			MessageToast.show("Hello World");
		},
		onAdd:function(){
			this.byId("creating-dialog").open();
		},
		onCancelNewUser:function(){
			this.byId("creating-dialog").close();
		},
		onEdit:function(oEvent){
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			this.byId("updatingDialog").setBindingContext(oCtx);
			this.byId("updatingDialog").open();
		},
		onCancelUpdatedUser:function(){
			this.byId("updatingDialog").close();
		}
	});
})