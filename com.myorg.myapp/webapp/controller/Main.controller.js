sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel,MessageBox) {
	"use strict";
	return Controller.extend("com.myorg.myapp.controller.Main", {
		onInit: function () {
			const oModel = new JSONModel();
			oModel.loadData("http://localhost:3000/data", null, false);
			this.getView().setModel(oModel);
			this._originalData = oModel.getProperty("/users");
		},

		validateProductId: function (oEvent) {
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
				this._refreshModel();
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
			console.log(aData)

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



		onSearch: function (oEvent) {
			const searchValue = oEvent.getParameter("newValue").toLowerCase();
			const oModel = this.getView().getModel();
			const aData = this._originalData; // Use the original data

			if (searchValue) {
				const filteredData = aData.filter(user => {
					return ['id', 'name', 'city'].some(key => {
						return String(user[key]).toLowerCase().includes(searchValue);
					});
				});
				oModel.setProperty("/users", filteredData);
			} else {
				// If search field is cleared, restore all data
				oModel.setProperty("/users", aData);
			}
		},

		_refreshModel: function () {
			const oModel = this.getView().getModel();
			oModel.loadData("http://localhost:3000/data", null, false);
			this._originalData = oModel.getProperty("/users");
		},
		onSaveUpdatedUser: function () {
			const oView = this.getView();
			const oModel = oView.getModel("usersModel");
		
			const oEditedSupplier = {
				ID: oView.byId("updating-id").getValue(),
				Name: oView.byId("updating-name").getValue(),
				Email: oView.byId("updating-email").getValue(),
				Address: oView.byId("updating-address").getValue(),
				City: oView.byId("updating-city").getValue()
			};
		
			// Log the request details for debugging
			console.log('Updating user:', oEditedSupplier);
		
			// Verify your actual endpoint URL here
			fetch(`http://localhost:3000/data/${oEditedSupplier.ID}`, { // Changed endpoint
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(oEditedSupplier)
			})
			.then(response => {
				console.log('Response status:', response.status);
				if (!response.ok) {
					if (response.status === 404) {
						throw new Error('User not found. Please check the ID.');
					}
					throw new Error(`Server error: ${response.status}`);
				}
				return response.json(); // Changed to .json() if server returns JSON
			})
			.then(data => {
				// Update the model with new data
			console.log('Updated user:', data);
				oView.byId("editSupplierDialog").close();
			})
			.catch(error => {
				console.error('Update error:', error);
				MessageToast.show(`Error updating user: ${error.message}`);
			});
		},

		
	})


});