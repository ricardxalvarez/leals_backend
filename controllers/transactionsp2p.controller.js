// var utils = require('./utils')

// module.exports = {

//   create : function(req, res, next){
//     const { idclient, transactiontype, paymentmethod, idpackage, amountusdt, amountleal } = req.body

//     var correct = 1;
//     if((!utils.isNumber(idclient)) || (!utils.isNumber(transactiontype)) || (!utils.isNumber(paymentmethod)) || (!utils.isNumber(amountusdt)) || (!utils.isNumber(amountleal)) || (!utils.isNumber(idpackage))){
//       correct = 0;
//     }
//     if((idclient < 1) || (transactiontype < 1) || (paymentmethod < 1) || (idpackage < 1) || (amountusdt < 1) || (amountleal < 1)){
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
//         idclient,
//         transactiontype,
//         paymentmethod,
//         idpackage,
//         amountusdt,
//         amountleal
//       }
//       const dataMov = require("../models/modTransactionsp2p");
//       dataMov
//         .addMov(values)
//         .then(ticket => {
//           if(ticket.rowCount>0){
//             console.log("La transacción fue creada con éxito ");
//             result = {
//               status: true,
//               content: "Transaction was successfully created"
//             }
//             res.status(200).json(result)
//           }else{
//             result = {
//               status: false,
//               content: "Transaction was not created"
//             }
//             res.status(200).json(result)
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           result = {
//             status: false,
//             content: "Error Creating transaction"
//           }
//           res.status(500).json(result);
//         });
//     }
// 	},
// 	listBuy : function(req, res){
//     const { idclient } = req.body;

//     var correct = 1;
//     if(!utils.isNumber(idclient)){
//       correct = 0;
//     }
//     if(idclient < 1){
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
//       const dataMov = require("../models/modTransactionsp2p");
//       dataMov
//         .listTransactionsBuy(idclient)
//         .then(list => {
//           if(list.rows.length>0){
//             result = {
//               status: true,
//               content: list.rows
//             }
//             res.status(200).json(result);
//           }else{
//             result = {
//               status: false,
//               content: "No Purchase Transactions"
//             }
//             res.status(200).json(result);
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           result = {
//             status: false,
//             content: "Error Listing Purchase Transactions"
//           }
//           res.status(500).json(result);
//         });
//     }
//   },
//   listSell : function(req, res){
//     const { idclient } = req.body;

//     var correct = 1;
//     if(!utils.isNumber(idclient)){
//       correct = 0;
//     }
//     if(idclient < 1){
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
//       const dataMov = require("../models/modTransactionsp2p");
//       dataMov
//         .listTransactionsSell(idclient)
//         .then(list => {
//           if(list.rows.length>0){
//             result = {
//               status: true,
//               content: list.rows
//             }
//             res.status(200).json(result);
//           }else{
//             result = {
//               status: false,
//               content: "No Sales Transactions"
//             }
//             res.status(200).json(result);
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           result = {
//             status: false,
//             content: "Error Listing Sales Transactions"
//           }
//           res.status(500).json(result);
//         });
//     }
//   },
//   listOpen : function(req, res){
//     const { idclient } = req.body;

//     var correct = 1;
//     if(!utils.isNumber(idclient)){
//       correct = 0;
//     }
//     if(idclient < 1){
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
//       const dataMov = require("../models/modTransactionsp2p");
//       dataMov
//         .listTransactionsOpen(idclient)
//         .then(list => {
//           if(list.rows.length>0){
//             result = {
//               status: true,
//               content: list.rows
//             }
//             res.status(200).json(result);
//           }else{
//             result = {
//               status: false,
//               content: "No Open Transactions"
//             }
//             res.status(200).json(result);
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           result = {
//             status: false,
//             content: "Error Listing Open Transactions"
//           }
//           res.status(500).json(result);
//         });
//     }
//   },
//   search : function(req, res, next){
//     const { idtransaction } = req.body

//     var correct = 1;
//     if(!utils.isNumber(idtransaction)){
//       correct = 0;
//     }
//     if(idtransaction < 1){
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
//       const dataMov = require("../models/modTransactionsp2p");
//       dataMov
//         .searchTransaction(idtransaction)
//         .then(transaction => {
//           if(transaction.rows.length>0){
//             respuesta = {
//               existe: true,
//               contenido: transaction.rows
//             }
//             res.status(200).json(respuesta);
//           }else{
//             console.log("La Transacción no existe");
//             respuesta = {
//               existe: false,
//               contenido: "Transaction does not exist"
//             }
//             res.status(200).json(respuesta);
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           respuesta = {
//             contenido: "Transaction Query Error"
//           }
//           res.status(500).json(respuesta);
//         });
//     }
//   },
//   updateStatusTicket : function(req, res, next){
//     const { idticketbuy,status } = req.body
//     var values = {
//       val1: idticketbuy,
//       val2: status
//     }
//     const dataMov = require("../models/modTransactionsp2p");
//     dataMov
//       .updateStatusbuy(values)
//       .then(ticket => {
//         if(ticket.rowCount>0){
//           console.log("Estado de Ticket de Compra Actualizado correctamente: ", ticket.rowCount);
//           resp = {
//             status: true,
//             content: "Purchase Ticket Status Correctly Updated"
//           }
//           res.status(200).json(resp);
//         }else{
//           console.log("Ticket de Compra no esxiste");
//           resp = {
//             status: false,
//             content: "Purchase Ticket does not exist"
//           }
//           res.status(200).json(resp);
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         resp = {
//           content: "Error Updating Purchase Ticket Status"
//         }
//         res.status(500).json(resp);
//       });
//   },
//   match : function(req, res){
//     const dataMov = require("../models/modTransactionsp2p");
//     dataMov
//       .matchTicketsbuy()
//       .then(list => {
//         if(list.buy!=0 || list.sell!=0){
//           console.log("Tickets: ", list);
//           result = {
//             status: true,
//             content: list
//           }
//           res.status(200).json(result);
//         }else{
//           result = {
//             status: false,
//             content: "No Tickets open"
//           }
//           res.status(200).json(result);
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         result = {
//           status: false,
//           content: "Error Listing Tickets"
//         }
//         res.status(500).json(result);
//       });
//   }

// } // Fin module.exports