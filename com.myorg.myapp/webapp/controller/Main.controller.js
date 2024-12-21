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
		},
		onSaveNewUser:function(){
			const ID = this.byId("creating-id").getValue();
			const Name = this.byId("creating-name").getValue();
			const email = this.byId("creating-email").getValue();
			const address = this.byId("creating-address").getValue();
			const city = this.byId("creating-city").getValue();
			
			fetch("http://localhost:3000/add-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: ID,
					name: Name,
					email: email,
					address: address,
					city: city
				})
			}).then(() => {
				MessageToast.show("User added successfully");
				this.byId("creating-dialog").close();
			}).catch(() => {
				MessageToast.show("Error adding user");
			});
		},
		onDelete:function(oEvent){
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			var sPath = oCtx.getPath();
			var oModel = this.getView().getModel();
			var aData = oModel.getProperty("/users");
			aData.splice(sPath, 1);
			oModel.setProperty("/users", aData);
			oModel.updateBindings();
		},
	});
})