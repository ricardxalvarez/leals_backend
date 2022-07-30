import bcrypt from 'bcrypt'
import transporter from '../config/email.transporter.js';
import { tokenService, userService } from '../services/index.js';
import Hogan from 'hogan.js'
import fs from 'fs'
import config from '../config/config.js';
import { StatusCodes } from 'http-status-codes';
import generateToken from '../utils/generateToken.js';

export function postSignup(req, res, next) {
  const { fullname, email, idcountry, username, password1, referralusername } = req.body
  let salt = bcrypt.genSaltSync(10);
  let pass1 = bcrypt.hashSync(password1, salt);
  let values = {
    fullname,
    email,
    idcountry,
    username,
    pass1,
    referralusername
  }
  userService
    .checkUser(values)
    .then(data => {
      let results
      if (data.user?.id) {
        return res.send(data)
      }
      if (!data.referrer.progenitor) {
        results = {
          ...values,
          referralid: data.referrer.id,
          id_progenitor: data.referrer.id
        }
      } else {
        results = {
          ...values,
          referralid: data.referrer.id,
          id_progenitor: data.referrer.progenitor
        }
      }
      userService
        .addCuenta(results)
        .then(cuenta => {
          if (cuenta) {
            res.status(200).send({
              status: true,
              content: "Cuenta creada con éxito"
            })
          } else {
            res.status(StatusCodes.BAD_GATEWAY).send({
              status: false,
              content: "there was an error"
            })
          }
        })
        .catch(err => {
          console.log(err);
          return res.status(500).send("Error creating account");
        })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("Error creating account");
    });

}

export function completeRegister(req, res, next) {
  const { iduser, skills, phone, password2, avatar } = req.body;
  let salt = bcrypt.genSaltSync(10);
  let pass2 = bcrypt.hashSync(password2, salt);
  var values = {
    iduser,
    skills,
    phone,
    pass2,
    avatar
  };
  userService.completeUserRegister(values)
    .then(user => {
      if (user) {
        let result = {
          status: true,
          content: "Profile successfully completed",
        };
        res.status(200).json(result)
      } else {
        let result = {
          status: false,
          content: "Internal Error",
        };
        res.status(200).json(result)
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("Error Updating Profile")
    })

}

export function postSignin(req, res, next) {
  const { username, password } = req.body
  userService.getAccount(username)
    .then(account => {
      if (account.rowCount > 0) {
        let user = account.rows[0]
        let fullname = user.full_nombre
        let idusuario = user.id_usuario
        //compara la clave del form con la de la BD
        if (bcrypt.compareSync(password, user.password1)) {
          // Se genera el token
          const token = generateToken({ ...user, password1: password })
          let result = {
            status: true,
            content: "Login successful",
            fullname: fullname,
            username: username,
            iduser: idusuario,
            token: token
          };
          res.status(200).send(result)
        } else {
          console.log("Clave Incorrecta")
          let result = {
            status: 'false',
            content: 'Incorrect Password'
          }
          res.status(200).send(result)
        }
      } else {
        console.log("Cuenta de usuario no afilida")
        let result = {
          status: false,
          content: 'User account unaffiliated'
        }
        res.status(200).send(result)
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("Error getting account");
    });

}

export function postSigninPsswd2(req, res, next) {
  const { username, password } = req.body
  userService.getAccount(username)
    .then(account => {
      if (account.rowCount > 0) {
        let user = account.rows[0]
        let fullname = user.full_nombre
        let idusuario = user.id
        //compara la clave del form con la de la BD
        if (bcrypt.compareSync(password, user.password2)) {
          // Se genera el token
          let result = {
            status: true,
            content: "Login successful",
            fullname: fullname,
            username: username,
            iduser: idusuario,
          };
          req.session.tokenPsswd2 = { iduser: idusuario, password: password }
          res.status(200).send(result)
        } else {
          console.log("Clave Incorrecta")
          let result = {
            status: 'false',
            content: 'Incorrect Password'
          }
          res.status(500).send(result)
        }
      } else {
        console.log("Cuenta de usuario no afilida")
        let result = {
          status: false,
          content: 'User account unaffiliated'
        }
        res.status(500).send(result)
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("Error getting account");
    });
}

export function list(req, res) {
  try {
    userService
      .listUsers()
      .then(list => {
        if (list.rows.length > 0) {
          const result = {
            status: true,
            content: list.rows
          }
          res.status(200).send(result);
        } else {
          result = {
            status: false,
            content: "No Registered Users"
          }
          res.status(400).send(result);
        }
      })
      .catch(err => {
        console.log(err);
        result = {
          status: false,
          content: "Error Listing Users"
        }
        res.status(500).json(result);
      });
  } catch (error) {
    console.log(error);
  }
}

export function search(req, res, next) {
  const { idclient } = req.body
  userService
    .searchUser(idclient)
    .then(user => {
      if (user.rows.length > 0) {
        respuesta = {
          existe: true,
          contenido: user.rows
        }
        res.send(respuesta);
      } else {
        respuesta = {
          existe: false,
          contenido: "User does not exist"
        }
        res.send(respuesta);
      }
    })
    .catch(err => {
      console.log(err);
      respuesta = {
        contenido: "User Query Error"
      }
      res.status(500).json(respuesta);
    });
}

export function updatePassword1(req, res) {
  const { password } = req.body
  const iduser = req.user.id
  let salt = bcrypt.genSaltSync(10);
  let pass1 = bcrypt.hashSync(password, salt);
  var values = {
    iduser,
    pass1
  };
  userService.updateUserPassword1(values)
    .then(user => {
      if (user.rowCount > 0) {
        let result = {
          status: true,
          content: "Password successfully updated"
        }
        res.status(200).json(result)
      } else {
        console.log("El Usuario no existe")
        let result = {
          status: false,
          content: "User does not exist"
        }
        res.status(200).json(result)
      }
    })
    .catch(err => {
      console.log(err)
      let result = {
        content: "Password Update Error"
      }
      res.status(500).json(result)
    });
}

export function updatePassword2(req, res) {
  const { password } = req.body
  const iduser = req.user.id
  let salt = bcrypt.genSaltSync(10);
  let pass2 = bcrypt.hashSync(password, salt);
  var values = {
    iduser,
    pass2
  };
  userService.updateUserPassword2(values)
    .then(user => {
      if (user.rowCount > 0) {
        result = {
          status: true,
          content: "Password successfully updated"
        }
        res.status(200).json(result)
      } else {
        result = {
          status: false,
          content: "User does not exist"
        }
        res.status(400).json(result)
      }
    })
    .catch(err => {
      console.log(err)
      result = {
        content: "Password Update Error"
      }
      res.status(500).json(result)
    });
}

export function updateUser(req, res) {
  const { email, skills, idcountry, phone } = req.body
  const iduser = req.user.id
  var values = {
    iduser,
    email,
    skills,
    phone,
    idcountry
  };
  userService.updateUser(values)
    .then(user => {
      if (user.rowCount > 0) {
        result = {
          status: true,
          content: "User successfully updated"
        }
        res.status(200).send(result)
      } else {
        console.log("El Usuario no existe")
        result = {
          status: false,
          content: "User not found"
        }
        res.status(400).send(result)
      }
    })
    .catch(err => {
      console.log(err)
      result = {
        content: "Error Updating User"
      }
      res.status(500).json(result)
    });
}

export function recoveryPassword(req, res) {
  const { mail } = req.body
  userService
    .recoveryPasswordUser(mail)
    .then(user => {
      if (user.status > 0) {
        let data = {
          email: mail,
          pass: user.password
        }
        var template = fs.readFileSync('./views/restartPassword.hjs', 'utf-8')
        var compiledTemplate = Hogan.compile(template)
        var mailOptions = {
          from: config.email.auth.user,
          to: mail,
          subject: 'LEALS - Reinicio de Password',
          html: compiledTemplate.render(data)
        };
        sendMailToClient(mailOptions)
        result = {
          status: true,
          content: "Password successfully reset. Your new password has been sent to your email address."
        }
        res.status(200).send(result)
      } else {
        result = {
          status: false,
          content: "Unable to Reset Password"
        }
        res.status(400).send(result)
      }
    })
    .catch(err => {
      result = {
        content: "Error Updating User"
      }
      res.status(500).send(result)
    });
}

export async function sendVerificationEmail(req, res, next) {
  const user = req.user
  userService.checkUserExists(user.nombre_usuario)
    .then(async usuario => {
      if (!usuario.status) {
        return res.send(usuario)
      }
      if (!usuario.user.is_email_verified) {
        var template = fs.readFileSync('./views/verifyEmail.hjs', 'utf-8')
        var compiledTemplate = Hogan.compile(template)
        var mailOptions = {
          from: config.email.auth.user,
          to: user.email,
          subject: 'LEALS - Reinicio de Password',
          html: compiledTemplate.render(user)
        };
        await tokenService.createToken(user.id)
        await
          sendMailToClient(mailOptions)
        res.send({ status: true, content: `Check your inbox at ${user.email}` })
      } else res({ error: 'user already veified' })
    })
    .catch(error => console.log(error))

}

export async function verifyEmail(req, res, next) {
  const userid = req.body.userid
  const token = await tokenService.getToken(userid)
  if (token) {
    const user = await userService.verifyEmail(userid)
    res.send({ status: true, content: "Email verificado" })
  } else res.send({ status: false, content: 'Token expired' })
}

export async function addPaymentMethods(req, res, next) {
  const user = req.user
  const { payment_methods, usd_direction, leal_direction } = req.body
  userService.addPaymentMethods(user.id, { payment_methods, usd_direction, leal_direction })
    .then(user => {
      if (user) {
        res.send({ status: true, content: "payment info updated" })
      } else res.send({ status: false })
    })
    .catch(error => console.log(error))
}

async function sendMailToClient(mailOptions) {
  transporter.sendMail(mailOptions, function (error, info) {
    var resp = true;
    if (error) {
      console.log(error);
      var resp = false;
      return resp
    } else {
      console.log('Email enviado: ' + info.response);
      console.log('Email enviado, body: ' + req.body);
      return resp
    }
  });
}