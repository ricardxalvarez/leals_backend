var conexion = require('../database/conexion');

module.exports = {

	async addPackages(v) {
		let name = v.packagename.toUpperCase()
		let package = await conexion.query("INSERT INTO paquetes(nombre_paquete,leal,usdt,nro_usuarios,disponible) VALUES ($1,$2,$3,$4,$5)",
			[name, v.lealsnums, v.price, v.usernum, v.available])
		return package
	},

	async listPackages() {
		var list = await conexion.query("SELECT * FROM paquetes")
		return list
	},
	async searchPackages(idpackage) {
		var package = await conexion.query("SELECT * FROM paquetes WHERE id=($1)",
			[idpackage])
		return package
	},

	async updatePackages(v) {
		let name = v.packagename.toUpperCase()
		let package = await conexion.query("UPDATE paquetes SET nombre_paquete=($1),usdt=($2),leal=($3),nro_usuarios=($4),disponible=($5) WHERE id=($6)",
			[name, v.price, v.lealsnums, v.usernum, v.available, v.idpackage])
		return package
	}

} // Fin module.exports