import conexion from '../database/conexion.js'


export async function addPackages(data) {
	let packag = await conexion.query("INSERT INTO packages(leals_quantity) VALUES ($1)",
		[data.leals_quantity])
	return packag
}

export async function listPackages() {
	var list = await (await conexion.query("SELECT * FROM packages")).rows
	return list
}
export async function searchPackages(idpackage) {
	var packag = await (await conexion.query("SELECT * FROM packages WHERE package_id=($1)",
		[idpackage])).rows[0]
	return packag
}

export async function updatePackages(data, idpackage) {
	// let oldPackage = await (await conexion.query('SELECT * FROM packages WHERE id=($1)', [idpackage])).rows[0]
	// const newData = { ...oldPackage, ...data }
	let packag = await (await conexion.query("UPDATE packages SET leals_quantity=($1) WHERE package_id=($2) RETURNING *",
		[data.leals_quantity, idpackage])).rows
	return packag
}

export async function deletePackage(idpackage) {
	let response = await conexion.query("DELETE FROM packages WHERE package_id=($1)", [idpackage])
	return response
}