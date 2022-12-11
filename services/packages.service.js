import conexion from '../database/conexion.js'


export async function addPackages(data) {
	let packag
	if (data.available_packages) {
		if (data.users_to_free_package) {
			packag = await conexion.query("INSERT INTO packages(usdt, available_packages, users_to_free_package) VALUES ($1, $2, $3)",
				[data.usdt_quantity, data.available_packages, data.users_to_free_package])
		} else packag = await conexion.query("INSERT INTO packages(usdt, available_packages) VALUES ($1, $2)",
			[data.usdt_quantity, data.available_packages])
	}
	else
		if (data.users_to_free_package) {
			packag = await conexion.query("INSERT INTO packages(usdt, users_to_free_package) VALUES ($1, $2)",
				[data.usdt_quantity, data.users_to_free_package])
		} else packag = await conexion.query("INSERT INTO packages(usdt_quantity) VALUES ($1)",
			[data.usdt_quantity])
	return packag
}

export async function listPackages() {
	const users_qnty = await (await conexion.query('SELECT FROM usuarios')).rowCount
	var list = await (await conexion.query("SELECT * FROM packages WHERE users_to_free_package<=($1)", [users_qnty])).rows
	var p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
	var results = []
	for (let i = 0; i < list.length; i++) {
		const packag = list[i];
		const leals_quantity = packag.usdt_quantity / p2p_config.value_compared_usdt
		results.push({ ...packag, leals_quantity })
	}
	return results
}

export async function listPackagesAdmin() {
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
	let packag = await (await conexion.query("UPDATE packages SET usdt_quantity=($1), available_packages=($2), users_to_free_package=($3) WHERE package_id=($4) RETURNING *",
		[newData.usdt_quantity, newData.available_packages, newData.users_to_free_package, idpackage])).rows[0]
	return { status: true, content: packag }
}

export async function deletePackage(idpackage) {
	let response = await conexion.query("DELETE FROM packages WHERE package_id=($1)", [idpackage])
	return response
}