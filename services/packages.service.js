import conexion from '../database/conexion.js'


export async function addPackages(data) {
	let packag
	if (data.available_packages)
		packag = await conexion.query("INSERT INTO packages(leals_quantity, name, available_packages) VALUES ($1, $2, $3)",
			[data.leals_quantity, data.name, data.available_packages])
	else
		packag = await conexion.query("INSERT INTO packages(leals_quantity, name) VALUES ($1, $2)",
			[data.leals_quantity, data.name])
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
	let oldPackage = await (await conexion.query('SELECT * FROM packages WHERE id=($1)', [idpackage])).rows[0]
	if (!oldPackage) return { status: false, content: 'This package does not exist' }
	const newData = { ...oldPackage, ...data }
	let packag = await (await conexion.query("UPDATE packages SET leals_quantity=($1), name=($2), available_packages=($3) WHERE package_id=($4) RETURNING *",
		[newData.leals_quantity, newData.name, newData.available_packages, idpackage])).rows[0]
	return { status: true, content: packag }
}

export async function deletePackage(idpackage) {
	let response = await conexion.query("DELETE FROM packages WHERE package_id=($1)", [idpackage])
	return response
}