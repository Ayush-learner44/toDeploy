var mongoose=require('mongoose');

var AdminSchema = new mongoose.Schema({	
	AdminId:String,
	AdminPassword:String,	
	Photo:{
		type:String, 
		default:"https://picsum.photos/200/300",
	},
	token:String,
});

module.exports = mongoose.model(
	'admin', AdminSchema);
