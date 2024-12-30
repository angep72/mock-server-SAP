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
                //This function is or opening the add new user dialog
		onAdd: function () {
			this.byId("creating-dialog").open();
		},

		onCancelNewUser: function () {
			this.byId("creating-dialog").close();
		},
		onSaveNewUser: function () {
			const ID = this.byId("creating-id").getValue();
			console.log(ID)
			const Name = this.byId("creating-name").getValue();
			console.log(Name);
			const Email = this.byId("creating-email").getValue();
			console.log(Email);
			const City=this.byId("creating-city").getValue();
			console.log(City);
			const Occupation=this.byId("creating-occupation").getValue();
			console.log(Occupation);
			
            fetch("http://localhost:3000/add-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: ID,
					firstName: Name,
					email: Email,
					city: City,
					occupation: Occupation
				})
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`Failed to add user: ${response.statusText}`);
			}
			return response.json();
		})
		.then(data => {
			MessageToast.show("User added successfully");
			this._refreshModel();
			this.byId("creating-dialog").close();
		})
		.catch(error => {
			MessageToast.show(`Failed to add user: ${error.message}`);
		});
	},

		onEdit: function (oEvent) {
			const button = oEvent.getSource();
			const listItem = button.getParent();
			const context = listItem.getBindingContext();
			const userData = context.getObject();
			this._selectedUserId = userData.id;
			const dialog = this.byId("updatingDialog");
			this.byId("updating-id").setValue(userData.id);
			this.byId("updating-name").setValue(userData.firstName);
			this.byId("updating-email").setValue(userData.email);
			this.byId("updating-city").setValue(userData.city);
			this.byId("updating-occupation").setValue(userData.occupation);
			dialog.open();
		},

		onCancelUpdatedUser: function () {
			this.byId("updatingDialog").close();
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
		    const pressedID = this._selectedUserId;
			const oEditedSupplier = {
				id: oView.byId("updating-id").getValue(),
				firstName: oView.byId("updating-name").getValue(),
				email: oView.byId("updating-email").getValue(),
				city: oView.byId("updating-city").getValue(),
				occupation: oView.byId("updating-occupation").getValue()
			};
		
			// Log the request details for debugging
			 console.log('Updating user:', oEditedSupplier);
		
			// Send the request to the server
			fetch(`http://localhost:3000/data/${pressedID}`,{
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(oEditedSupplier)
			})
			.then(response => {
				if (!response.ok) {
					throw new Error(`Failed to update user: ${response.statusText}`);
				}
				return response.json();
			})
			.then(data => {
				MessageToast.show("User updated successfully");
				this._refreshModel();
				this.byId("updatingDialog").close();
			})
			.catch(error => {
				MessageToast.show(`Failed to update user: ${error.message}`);
			});

		},

		
	})


});
