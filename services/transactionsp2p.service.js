var conexion = require('../database/conexion');

module.exports = {
  
	async addMov(v) {
    var moment = require("moment");
    var now = moment();
    let createdDate = moment(now).format("DD/MM/YYYY");
    let createdTime = moment(now).format("hh:mm");

    let status = "PENDING";
		let ticket = await conexion.query("INSERT INTO mov_p2p(fecha,hora,monto_usdt,monto_leal,status,id_tipo_mov,id_usuario,id_paquete,id_metodo_pago) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
		[createdDate,createdTime,v.amountusdt,v.amountleal,status,v.transactiontype,v.idclient,v.idpackage,v.paymentmethod]);
	  return ticket;
	},
	
	async listTransactionsBuy(idclient) {
		let txType = 1;
		let status = "FINISH";
		var buy = await conexion.query("SELECT * FROM mov_p2p WHERE id_usuario = ($1) AND id_tipo_mov = ($2) AND status = ($3)",
		[idclient, txType, status]);
		return buy;
  },

	async listTransactionsSell(idclient) {
		let txType = 2;
		let status = "FINISH";
		var sell = await conexion.query("SELECT * FROM mov_p2p WHERE id_usuario = ($1) AND id_tipo_mov = ($2) AND status = ($3)",
		[idclient, txType, status]);
		return sell;
  },

	async listTransactionsOpen(idclient) {
		let status = "FINISH";
		var sell = await conexion.query("SELECT * FROM mov_p2p WHERE id_usuario = ($1) AND status <> ($2)",
		[idclient, status]);
		return sell;
  },
  
  async searchTransaction(idtransaction) {
		var transaction = await conexion.query("SELECT * FROM mov_p2p WHERE id = ($1)",
		[idtransaction]);
		return transaction;
	},
  async updateStatusbuy(v) {
    let status = v.val2.toUpperCase()
		let ticket= await conexion.query("UPDATE mov_p2p SET status=($1) WHERE idticketbuy=($2)",
		[status,v.val1]);
		return ticket
	},

	
	
	
	
	
} // Fin module.exports