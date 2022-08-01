import conexion from '../database/conexion.js'
import bcrypt from 'bcrypt'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

export async function checkUser(data) {
  let user = await (await conexion.query('SELECT * from usuarios WHERE nombre_usuario=($1)',
    [data.username])).rows[0];
  let referrer = await (await conexion.query('SELECT * from usuarios WHERE nombre_usuario=($1)',
    [data.referralusername])).rows[0];
  if (user) {
    return new ApiError(StatusCodes.CONFLICT, "nombre de usuario ya existente");
  }
  if (!user) {
    if (referrer) {
      return {
        user: {
          id: user?.id, nombre_usuario: user?.nombre_usuario, email: user?.email, is_email_verified: user?.is_email_verified
        }, referrer: {
          id: referrer.id, sponsor: referrer.id_sponsor, progenitor: referrer.id_progenitor
        }
      };
    } else return { status: false, content: "you've entered a not valid username" };
  } else return { status: false, content: "this user already exists" };
}

export async function checkUserExists(data) {
  let user = await (await conexion.query('SELECT * from usuarios WHERE nombre_usuario=($1)',
    [data.username])).rows[0];
  if (user) {
    return user
  } else return { status: false, content: "User does not exist" }
}
export async function addCuenta(data) {
  let name = data.fullname.toUpperCase();
  let newUser = await (await conexion.query("INSERT INTO usuarios(full_nombre,email,codigo_pais,nombre_usuario,password1,id_sponsor, id_progenitor) VALUES ($1,$2,$3,$4,$5,$6, $7) RETURNING *",
    [name, data.email, data.idcountry, data.username, data.pass1, data.referralid, data.id_progenitor])).rows[0];
  if (newUser) {
    return newUser;
  } else return 0;

}
export async function completeUserRegister(data) {
  let skills = data.skills.toUpperCase();
  let status_p2p = "Active";
  let user = await (await conexion.query("UPDATE usuarios SET password2=($1),telefono=($2),habilidades=($3),status_p2p=($4),avatar=($5) WHERE id=($6) RETURNING *",
    [data.pass2, data.phone, skills, status_p2p, data.avatar, data.iduser])).rows[0]
  if (user) {
    return user
  } else return 0
}

export async function getAccount(username) {
  let user = await conexion.query("SELECT * from usuarios WHERE nombre_usuario=($1)",
    [username]);
  return user;
}

export async function listUsers() {
  var users = await conexion.query("SELECT * FROM usuarios");
  return users;
}

export async function searchUser(iduser) {
  var user = await conexion.query("SELECT * FROM usuarios WHERE id=($1)",
    [iduser]);
  return user;
}

export async function updateUser(data) {
  let user = await conexion.query("UPDATE usuarios SET email=($1),habilidades=($2),telefono=($3),codigo_pais=($4) WHERE id=($5)",
    [data.email, data.skills, data.phone, data.idcountry, data.iduser])
  return user
}

export async function updateUserPassword1(data) {
  let user = await conexion.query("UPDATE usuarios SET password1=($1) WHERE id=($2)",
    [data.pass1, data.iduser])
  return user
}

export async function updateUserPassword2(data) {
  let user = await conexion.query("UPDATE usuarios SET password2=($1) WHERE id=($2)",
    [data.pass2, data.iduser])
  return user
}

export async function recoveryPasswordUser(email) {
  let newPassSeek = getReferralCode();
  let salt = bcrypt.genSaltSync(10);
  let password = bcrypt.hashSync(newPassSeek, salt);
  let user = await conexion.query("UPDATE usuarios SET password1=($1) WHERE email=($2)",
    [password, email])
  let resp = {
    status: user.rowCount,
    password: newPassSeek
  }
  return resp
}

export async function verifyEmail(userid) {
  const user = (await conexion.query('SELECT * FROM usuarios WHERE id=($1)', [userid])).rows[0]
  if (!user) {
    return { status: false, content: 'User does not exists' }
  }
  if (!user.is_email_verified) {
    const newUser = await (await conexion.query('UPDATE usuarios SET is_email_verified=($1) WHERE id=($2) RETURNING *', [true, userid])).rows[0]
    await conexion.query('DELETE FROM tokens WHERE owner=($1)', [userid])
    return newUser
  } else return
}

export async function addPaymentMethods(userid, data) {
  const user = await (await conexion.query('UPDATE usuarios SET usd_direction=($2), leal_direction=($3), payment_methods=($4) WHERE id=($1) RETURNING *', [userid, data.usd_direction, data.leal_direction, data.payment_methods])).rows[0]
  return user;
}
function getReferralCode() {//genera un codigo unico para los referidos
  let now = new Date().getTime();
  let uuid = 'xxxx4xxxyxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (now + Math.random() * 16) % 16 | 0;
    now = Math.floor(now / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid.toUpperCase();
}