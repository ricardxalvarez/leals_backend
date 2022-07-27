// var utils = require('./utils')
// module.exports = {

//   create : function(req, res){
//     const { packagename, lealsnums, price, usernum, available } = req.body
    
//     var correct = 1;
//     if((!utils.isString(packagename))){
//       correct = 0;
//     }
//     if((!utils.isBoolean(available))){
//       correct = 0;
//     }
//     if((!utils.isNumber(lealsnums)) || (!utils.isNumber(price)) || (!utils.isNumber(usernum))){
//       correct = 0;
//     }
//     if((lealsnums < 1) || (price < 1) || (usernum < 1)){
//       correct = 0;
//     }

//     if(correct == 0){
//       let result = {
//         status: false,
//         content: "Incorrect data"
//       };
//       console.log(result)
//       res.status(200).json(result);
//     }else{
//       var values = {
//         packagename,
//         lealsnums,
//         price,
//         usernum,
//         available
//       }
//       const dataPackages = require("../models/modPackages")
//       dataPackages
//         .addPackages(values)
//         .then(package => {
//           if(package.rowCount>0){
//             console.log("El Paquete fue creado con éxito ")
//             result = {
//               status: true,
//               message: "Package successfully created"
//             }
//             res.status(200).json(result)
//           }else{
//             result = {
//               status: false,
//               message: "Package not created"
//             }
//             res.status(200).json(result)
//           }
//         })
//         .catch(err => {
//           console.log(err)
//           result = {
//             status: false,
//             message: "Package Creation Error"
//           }
//           res.status(500).json(result)
//         })
//     }
// 	},
// 	list : function(req, res){
//     const dataPackages = require("../models/modPackages")
//     dataPackages
//       .listPackages()
//       .then(lists => {
//         if(lists.rows.length>0){
//           console.log("Paquetes: ", lists.rows)
//           result = {
//             status: true,
//             content: lists.rows
//           }
//           res.status(200).json(result)
//         }else{
//           console.log("No hay Paquetes registradas")
//           result = {
//             status: false,
//             content: "No Packages registered"
//           }
//           res.status(200).json(result)
//         }
//       })
//       .catch(err => {
//         console.log(err)
//         result = {
//           status: false,
//           content: "Packages Listing Error"
//         }
//         res.status(500).json(result)
//       });
//   },
//   search : function(req, res){
//     const { idpackage } = req.body

//     var correct = 1;
//     if(!utils.isNumber(idpackage)){
//       correct = 0;
//     }
//     if((idpackage < 1)){
//       correct = 0;
//     }

//     if(correct == 0){
//       let result = {
//         status: false,
//         content: "Incorrect data"
//       };
//       console.log(result)
//       res.status(200).json(result);
//     }else{
//       const dataPackages = require("../models/modPackages")
//       dataPackages
//         .searchPackages(idpackage)
//         .then(package => {
//           if(package.rows.length>0){
//             console.log("Paquete: ", package.rows)
//             result = {
//               status: true,
//               content: package.rows
//             }
//             res.status(200).json(result)
//           }else{
//             console.log("El Paquete no existe")
//             result = {
//               status: false,
//               content: "Package does not exist"
//             }
//             res.status(200).json(result)
//           }
//         })
//         .catch(err => {
//           console.log(err)
//           result = {
//             status: false,
//             content: "Package Query Error"
//           }
//           res.status(500).json(result)
//         });
//     }
// 	},
// 	update : function(req, res){
//     const { idpackage, packagename, lealsnums, price, usernum, available } = req.body

//     var correct = 1;
//     if((!utils.isString(packagename))){
//       correct = 0;
//     }
//     if((!utils.isBoolean(available))){
//       correct = 0;
//     }
//     if((!utils.isNumber(idpackage)) || (!utils.isNumber(lealsnums)) || (!utils.isNumber(price)) || (!utils.isNumber(usernum))){
//       correct = 0;
//     }
//     if((idpackage < 1) || (lealsnums < 1) || (price < 1) || (usernum < 1)){
//       correct = 0;
//     }

//     if(correct == 0){
//       let result = {
//         status: false,
//         content: "Incorrect data"
//       };
//       console.log(result)
//       res.status(200).json(result);
//     }else{
//       var values = {
//         idpackage,
//         packagename,
//         lealsnums,
//         price,
//         usernum,
//         available
//       }
//       const dataPackages = require("../models/modPackages")
//       dataPackages
//         .updatePackages(values)
//         .then(package => {
//           if(package.rowCount>0){
//             result = {
//               status: true,
//               content: "Package updated successfully"
//             }  
//             res.status(200).json(result)
//           }else{
//             console.log("El Paquete no esxiste")
//             result = {
//               status: false,
//               content: "Package does not exist"
//             }
//             res.status(200).json(result)
//           }
//         })
//         .catch(err => {
//           console.log(err)
//           result = {
//             content: "Package Upgrade Error"
//           }
//           res.status(500).json(result)
//         });
//     }
// 	}
	

// } // Fin module.exports
