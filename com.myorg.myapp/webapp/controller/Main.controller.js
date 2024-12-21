sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/m/MessageToast", 
	"sap/ui/model/json/JSONModel"], function (Controller, MessageToast, JSONModel) {
	"use strict";
	return Controller.extend("com.myorg.myapp.controller.Main", {
		onInit: function () {
			const oModel = new JSONModel();
			oModel.loadData("http://localhost:3000/data");
			this.getView().setModel(oModel);

			// You can directly access the model data if needed
			var oData = oModel.getData();  // This gets the raw data from the model
			console.log(oData);
		},
		validateProductId: function(oEvent) {
			const input = oEvent.getSource();
			const value = input.getValue();
			
			if (!/^\d+$/.test(value)) {
				input.setValueState("Error");
				return false;
			}
			
			input.setValueState("None");
			return true;
		},
		onPress: function () {
			MessageToast.show("Hello World");
		},
		onAdd: function () {
			this.byId("creating-dialog").open();
		},
		onCancelNewUser: function () {
			this.byId("creating-dialog").close();
		},
		onEdit: function (oEvent) {
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			this.byId("updatingDialog").setBindingContext(oCtx);
			this.byId("updatingDialog").open();
		},
		onCancelUpdatedUser: function () {
			this.byId("updatingDialog").close();
		},
		onSaveNewUser: function () {
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
		onDelete: function (oEvent) {
			var oItem = oEvent.getSource();
			var oCtx = oItem.getBindingContext();
			var sPath = oCtx.getPath();
			var oModel = this.getView().getModel();
			var aData = oModel.getProperty("/users");

			// Create a confirmation dialog
			var oDialog = new sap.m.Dialog({
				title: 'Confirm',
				type: 'Message',
				content: new sap.m.Text({ text: 'Do you want to delete this user?' }),
				beginButton: new sap.m.Button({
					text: 'Delete',
					press: function () {
						// Delete the user
						aData.splice(sPath.substring(sPath.lastIndexOf('/') + 1), 1);
						oModel.setProperty("/users", aData);
						oModel.updateBindings();
						oDialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			// Open the dialog
			oDialog.open();
		},
		onEdit: function (oEvent) {
			const button = oEvent.getSource();
			const listItem = button.getParent();
			const context = listItem.getBindingContext();
			const userData = context.getObject();
			this._selectedUserId = userData.id;
			const dialog = this.byId("updatingDialog");
			this.byId("updating-id").setValue(userData.id);
			this.byId("updating-name").setValue(userData.name);
			this.byId("updating-email").setValue(userData.email);
			this.byId("updating-address").setValue(userData.address);
			this.byId("updating-city").setValue(userData.city);
			dialog.open();
		},
		onSaveUpdatedUser: function () {
			const ID = this._selectedUserId
			const Name = this.byId("updating-name").getValue();
			const email = this.byId("updating-email").getValue();
			const address = this.byId("updating-address").getValue();
			const city = this.byId("updating-city").getValue();

			fetch(`http://localhost:3000/update-user/${ID}`, {
				method: "PUT",
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
				MessageToast.show("User updated successfully");
				this.byId("updatingDialog").close();
			}).catch(() => {
				MessageToast.show("Error updating user");
			})
		}
	});
})