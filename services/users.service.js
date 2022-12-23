import conexion from '../database/conexion.js'
import bcrypt from 'bcrypt'

export async function checkUser(data) {
  let user = await (await conexion.query('SELECT * from usuarios WHERE nombre_usuario=($1) OR email=($2)',
    [data.username, data.email])).rows[0];
  let referrer = await (await conexion.query('SELECT * from usuarios WHERE nombre_usuario=($1)',
    [data.referralusername])).rows[0];
  if (user) {
    return { status: false, content: "already exists a user with this username or email" };
  }
  if (referrer) {
    return {
      user: {
        id: user?.id, nombre_usuario: user?.nombre_usuario, email: user?.email, is_email_verified: user?.is_email_verified
      }, referrer: {
        id: referrer.id, sponsor: referrer.id_sponsor, progenitor: referrer.id_progenitor
      }
    };
  } else return { status: false, content: "you've entered a not existing username" };
}

export async function checkUserExists(data) {
  let user = await (await conexion.query('SELECT * from usuarios WHERE nombre_usuario=($1)',
    [data.nombre_usuario])).rows[0];
  if (user) {
    return user
  } else return { status: false, content: "User does not exist" }
}
export async function checkEmailExists(email, emailUser) {
  let user = await (await conexion.query('SELECT * from usuarios WHERE email=($1)',
    [email])).rows[0];
  let myUser = await (await conexion.query('SELECT * FROM usuarios WHERE email=($1)', [emailUser])).rows[0]
  if (!user || user?.email === emailUser) {
    return { status: true, user, myUser }
  } else return { status: false, content: "Already exists a user with that email" }
}
export async function addCuenta(data) {
  const app_config = await (await conexion.query('SELECT * FROM config')).rows[0]
  if (!app_config.is_registering_active) return { status: false, content: "Registering new users is not available in this moment, please try again sooner" }
  let name = data.fullname.toUpperCase();
  const userExists = await (await conexion.query("SELECT id FROM usuarios WHERE nombre_usuario=($1) OR email=($2)",
    [data.username, data.email])).rows[0];
  const phoneExists = await (await conexion.query('SELECT * FROM usuarios WHERE telefono=($1)', [data.phone])).rows[0]
  if (phoneExists) return { status: false, content: 'This number phone already belongs to a user' }
  if (!userExists) {
    let newUser = await (await conexion.query("INSERT INTO usuarios(full_nombre,email,codigo_pais,nombre_usuario,password1,id_sponsor, id_progenitor, telefono) VALUES ($1,$2,$3,$4,$5,$6, $7, $8) RETURNING *",
      [name, data.email, data.idcountry, data.username, data.pass1, data.referralid, data.id_progenitor, data.phone])).rows[0];
    if (newUser) {
      return { status: true, content: "Account succesfully created" }
    }
  } else return { status: false, content: "Already exists an account with same email or username" }
}
export async function completeUserRegister(data) {
  let skills = data.skills.toUpperCase();
  let user = await (await conexion.query("UPDATE usuarios SET password2=($1),habilidades=($2),avatar=($3) WHERE id=($4) RETURNING *",
    [data.pass2, skills, data.avatar, data.iduser])).rows[0]
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
  var users = await conexion.query("SELECT id, email, telefono, avatar, nombre_usuario, status_p2p, habilidades, full_nombre, codigo_pais, payment_methods FROM usuarios");
  return users;
}

export async function searchUser(iduser) {
  var user = await conexion.query("SELECT id, email, telefono, avatar, nombre_usuario, status_p2p, habilidades, full_nombre, codigo_pais, is_email_verified, is_phone_verified, password2, usd_direction, leal_direction, payment_methods, is_user_blocked_p2p FROM usuarios WHERE id=($1)",
    [iduser]);
  return user;
}

export async function updateUser(data, newEmail, oldEmail, newPhone, oldPhone) {
  const isNumberPhoneTaken = await (await conexion.query('SELECT id FROM usuarios WHERE telefono=($1) AND id<>($2)', [data.phone, data.iduser])).rows[0]
  if (isNumberPhoneTaken) {
    return {
      status: false,
      content: "Already exists a user with this phone number"
    }
  }
  if (newEmail === oldEmail) {
    if (newPhone === oldPhone) {
      await conexion.query("UPDATE usuarios SET full_nombre=($1),email=($2),habilidades=($3),telefono=($4),codigo_pais=($5) WHERE id=($6)",
        [data.fullname, data.email, data.skills, data.phone, data.idcountry, data.iduser])
    } else {
      await conexion.query("UPDATE usuarios SET full_nombre=($1),email=($2),habilidades=($3),telefono=($4),codigo_pais=($5), is_phone_verified=($6) WHERE id=($7)",
        [data.fullname, data.email, data.skills, data.phone, data.idcountry, false, data.iduser])
    }
    return {
      status: true,
      content: "User successfully updated"
    }
  } else {
    if (newPhone === oldPhone) {
      await conexion.query("UPDATE usuarios SET full_nombre=($1),email=($2),habilidades=($3),telefono=($4),codigo_pais=($5), is_email_verified=($6) WHERE id=($7)",
        [data.fullname, data.email, data.skills, data.phone, data.idcountry, false, data.iduser])
    } else {
      await conexion.query("UPDATE usuarios SET full_nombre=($1),email=($2),habilidades=($3),telefono=($4),codigo_pais=($5), is_email_verified=($6), is_phone_verified=($7) WHERE id=($8)",
        [data.fullname, data.email, data.skills, data.phone, data.idcountry, false, false, data.iduser])
    }
    return {
      status: true,
      content: "User successfully updated"
    }
  }
}

export async function updateUserPassword1(data) {
  let user = await (await conexion.query('SELECT id, password1 FROM usuarios WHERE id=($1)', [data.iduser])).rows[0]
  const isPasswordMatch = await bcrypt.compare(data.oldPassword, user.password1)
  if (!user) {
    return { status: false, content: 'User does not exist' }
  }
  if (isPasswordMatch) {
    let salt = bcrypt.genSaltSync(10);
    const newPassword = bcrypt.hashSync(data.password, salt);
    await conexion.query("UPDATE usuarios SET password1=($1) WHERE id=($2) RETURNING *",
      [newPassword, data.iduser])
    return { status: true, content: 'Password successfully updated' }
  } else return { status: false, content: 'Current password is not correct' }
}

export async function updateUserPassword2(data) {
  let user = await (await conexion.query('SELECT password2 FROM usuarios WHERE id=($1)', [data.iduser])).rows[0]
  if (!user) {
    return { status: true, content: 'User does not exist' }
  }
  if (user.password2) {
    if (!data.oldPassword) return { status: false, content: 'Old password is must' }
    const isPasswordMatch = await bcrypt.compare(data.oldPassword, user.password2)
    if (isPasswordMatch) {
      await conexion.query("UPDATE usuarios SET password2=($1) WHERE id=($2)",
        [data.pass2, data.iduser])
      return { status: true, content: 'Password updated successfully' }
    } else return { status: false, content: 'incorrect password' }
  } else {
    await conexion.query("UPDATE usuarios SET password2=($1) WHERE id=($2)",
      [data.pass2, data.iduser])
    return { status: true, content: 'Password updated successfully' }
  }
}

export async function updateAvatar(userid, avatar) {
  let user = await conexion.query('UPDATE usuarios SET avatar=($1) WHERE id=($2)', [avatar, userid])
  return { status: true, content: 'avatar successfully updated' }
}

export async function recoveryPasswordUser(email) {
  let newPassSeek = getReferralCode();
  let salt = bcrypt.genSaltSync(10);
  let password = bcrypt.hashSync(newPassSeek, salt);
  let user = await (await conexion.query("UPDATE usuarios SET password1=($1) WHERE email=($2) RETURNING *",
    [password, email])).rows[0]
  let resp = {
    user: user,
    password: newPassSeek
  }
  return resp
}

export async function recoveryPassword2User(email) {
  let newPassSeek = getReferralCode();
  let salt = bcrypt.genSaltSync(10);
  let password = bcrypt.hashSync(newPassSeek, salt);
  let user = await (await conexion.query("UPDATE usuarios SET password2=($1) WHERE email=($2) RETURNING *",
    [password, email])).rows[0]
  let resp = {
    user: user,
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
    await (await conexion.query('UPDATE usuarios SET is_email_verified=($1) WHERE id=($2) RETURNING *', [true, userid])).rows[0]
    await conexion.query('DELETE FROM email_verification_tokens WHERE owner=($1)', [userid])
    return { status: true, content: "User's email verified succesfully" }
  } else return { status: false, content: "User's email already verified" }
}

export async function verifyPhone(userid) {
  const user = (await conexion.query('SELECT * FROM usuarios WHERE id=($1)', [userid])).rows[0]
  if (!user) {
    return { status: false, content: 'User does not exists' }
  }
  if (!user.is_phone_verified) {
    await (await conexion.query('UPDATE usuarios SET is_phone_verified=($1) WHERE id=($2) RETURNING *', [true, userid])).rows[0]
    await conexion.query('DELETE FROM phone_verification_tokens WHERE owner=($1)', [userid])
    return { status: true, content: "User's phone number verified succesfully" }
  } else return { status: false, content: "User's phone number already verified" }
}

export async function addPaymentMethods(userid, data) {
  const user = await (await conexion.query('SELECT * FROM usuarios WHERE id=($1)', [userid])).rows[0]
  const result = await (await conexion.query('UPDATE usuarios SET usd_direction=($2), leal_direction=($3), payment_methods=($4) WHERE id=($1) RETURNING *', [userid, data.usd_direction || user.usd_direction, data.leal_direction || user.leal_direction, data.payment_methods || user.payment_methods])).rows[0]
  if (!user) return { status: false, content: "no user with such id" }
  if (result) {
    return { status: true, content: "payment info updated" }
  } else return { status: false, content: "error updating payment methods" }
}

export async function getAdmin(userid) {
  const admin = await (await conexion.query('SELECT role FROM admins WHERE iduser=($1)', [userid])).rows[0]
  return admin
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