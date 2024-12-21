sap.ui.define([	"sap/ui/core/mvc/Controller",	"sap/m/MessageToast"], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("com.myorg.myapp.controller.Main", {
		onPress: function() {
			MessageToast.show("Hello World");
		}
	});
})