import bcrypt from 'bcrypt'
import transporter from '../config/email.transporter.js';
import { tokenService, userService } from '../services/index.js';
import Hogan from 'hogan.js'
import fs from 'fs'
import config from '../config/config.js';
import { StatusCodes } from 'http-status-codes';
import generateToken from '../utils/generateToken.js';
import client from '../config/phone.client.js';
import { getCountryByISO } from './countries.controller.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logo from './../views/images'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function postSignup(req, res, next) {
  const { fullname, email, idcountry, username, password1, referralusername, phone } = req.body
  let salt = bcrypt.genSaltSync(10);
  let pass1 = bcrypt.hashSync(password1, salt);
  let values = {
    fullname,
    email,
    idcountry,
    username,
    pass1,
    referralusername,
    phone
  }
  userService
    .checkUser(values)
    .then(data => {
      let results
      if (data.status === false) {
        return res.send(data)
      }
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
        .then(response => {
          if (response.status) {
            res.send(response)
          } else {
            res.status(StatusCodes.BAD_GATEWAY).send(response)
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
  const { iduser, skills, password2, avatar } = req.body;
  let salt = bcrypt.genSaltSync(10);
  let pass2 = bcrypt.hashSync(password2, salt);
  var values = {
    iduser,
    skills,
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
        let idusuario = user.id
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
            status: false,
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
      return res.status(500).send({
        status: false,
        content: 'There was an error logging to your account'
      });
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
          res.status(403).send(result)
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
  const id = req.user.id
  userService
    .searchUser(id)
    .then(user => {
      if (user.rows.length > 0) {
        const countryInfo = getCountryByISO(user.rows[0].codigo_pais)
        const full_telephono = user.rows[0].telefono
        const telephono = full_telephono?.slice(full_telephono.indexOf('-') + 1)
        let respuesta = {
          status: true,
          content: { ...user.rows[0], payment_methods: user.rows[0].payment_methods || [], countryName: countryInfo?.countryName, currencyCode: countryInfo?.currencyCode, password2: user.rows[0].password2 ? true : false, telefono: undefined, full_telephono, telephono }
        }
        res.send(respuesta);
      } else {
        let respuesta = {
          status: false,
          content: "User does not exist"
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
  const { password, oldPassword } = req.body
  const iduser = req.user.id
  var values = {
    iduser,
    password,
    oldPassword
  };
  userService.updateUserPassword1(values)
    .then(response => {
      res.send(response)
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
  const { password, oldPassword } = req.body
  const iduser = req.user.id
  let salt = bcrypt.genSaltSync(10);
  let pass2 = bcrypt.hashSync(password, salt);
  var values = {
    iduser,
    pass2,
    oldPassword
  };
  userService.updateUserPassword2(values)
    .then(response => {
      res.send(response)
    })
    .catch(err => {
      console.log(err)
      let result = {
        content: "Password Update Error"
      }
      res.status(500).json(result)
    });
}

export function updateUser(req, res) {
  const iduser = req.user.id
  const emailUser = req.user.email
  const phoneUser = req.user.telefono
  const email = req.body.email || emailUser
  const phone = req.body.phone || phoneUser
  var values = {
    ...req.body,
    iduser,
    email,
    phone,
  };
  userService.checkEmailExists(email, emailUser)
    .then(response => {
      if (response.status) {
        let newData = { ...response.myUser, fullname: response.myUser.full_nombre, skills: response.myUser.habilidades, ...values }
        userService.updateUser(newData, email, emailUser, phone, phoneUser)
          .then(user => {
            res.send(user)
          })
          .catch(err => {
            console.log(err)
            let result = {
              status: false,
              content: "Error Updating User"
            }
            res.status(500).json(result)
          });
      } else res.send(response)
    })
    .catch(error => {
      let result = {
        content: "Error Updating User"
      }
      console.log(error);
      res.send(result)
    })
}

export function recoveryPassword(req, res) {
  const { email } = req.body
  userService
    .recoveryPasswordUser(email)
    .then(async data => {
      if (data.user) {
        let user = {
          email,
          pass: data.password,
          name: data.user.full_nombre,
          attachments: [{   // stream as an attachment
            filename: 'logo.png',
            path: './../views/images/logo.png',
            cid: 'logo'
          }]
        }

        var template = fs.readFileSync('./views/passwordreset.hjs', 'utf-8')
        var compiledTemplate = Hogan.compile(template)
        var mailOptions = {
          from: config.email.auth.email,
          to: email,
          subject: 'LEALS - Password reset',
          html: compiledTemplate.render(user)
        };
        await sendMailToClient(mailOptions)
        let result = {
          status: true,
          content: "Password successfully reset. Your new password has been sent to your email address."
        }
        res.status(200).send(result)
      } else {
        let result = {
          status: false,
          content: "User nor registered"
        }
        res.status(400).send(result)
      }
    })
    .catch(err => {
      console.log(err);
      let result = {
        status: false,
        content: "Error Updating User"
      }
      res.status(500).send(result)
    });
}

export async function sendVerificationEmail(req, res, next) {
  const user = req.user
  userService.checkUserExists(user)
    .then(async usuario => {
      if (usuario.status === false) {
        return res.send(usuario)
      }
      if (!usuario.is_email_verified) {
        await tokenService.deleteTokensEmailVerification(user.id)
        const code = await (await tokenService.createTokenEmailVerification(user.id)).rows[0]
        var template = fs.readFileSync('./views/mailverification.hjs', 'utf-8')
        var compiledTemplate = Hogan.compile(template)
        var mailOptions = {
          from: config.email.auth.email,
          to: user.email,
          subject: 'LEALS - Verificación de email',
          html: compiledTemplate.render({ ...user, code: code.code })
        };
        await sendMailToClient(mailOptions)
        res.send({ status: true, content: `Check your inbox at ${user.email}` })
      } else res.send({ status: false, content: 'user already verified' })
    })
    .catch(error => console.log(error))

}

export async function verifyEmail(req, res, next) {
  const code = req.body.code
  const userid = req.user.id
  tokenService.getTokenEmailVerification(userid, code)
    .then(response => {
      if (response.status === false) {
        res.send(response)
      } else {
        userService.verifyEmail(userid)
          .then(response => {
            res.send(response)
          })
          .catch(error => {
            console.log(error);
            res.send({ status: false, content: "error verifing email" })
          })
      }
    })
    .catch(error => {
      console.log(error);
      res.send({ status: false, content: "error verifing email" })
    })
  // this endpoint must remove all tokens and update the user to is_email_veirfied to true
}

export async function addPaymentMethods(req, res, next) {
  const user = req.user
  const { payment_methods, usd_direction, leal_direction } = req.body
  userService.addPaymentMethods(user.id, { payment_methods, usd_direction, leal_direction })
    .then(response => res.send(response))
    .catch(error => console.log(error))
}

export async function updateAvatar(req, res, next) {
  const userid = req.user.id
  const avatar = req.body.avatar
  userService.updateAvatar(userid, avatar)
    .then(response => res.send(response))
    .catch(error => {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ status: false, content: 'error uploading your new avatar' })
    })
}

export async function sendVerificationMessage(req, res, next) {
  const user = req.user
  userService.checkUserExists(user)
    .then(async response => {
      if (response.status === false) {
        return res.send(response)
      }
      if (!response.is_phone_verified) {
        await tokenService.deleteTokensPhoneVerification(user.id)
        const code = await (await tokenService.createTokenPhoneVerification(user.id)).rows[0]
        const body = `Your verification code for Leals is: \n*${code.code}* \nDon't share this information with anyone, our employees will never ask for it.`
        let result = await sendMessageToClient(user.telefono, body)
        return res.send(result)
      } else return res.send({ status: false, content: 'number phone already verified' })
    })
    .catch(error => {
      console.log(error)
      res.send({ status: false, content: 'Error sending message' })
    })
}

export async function verifyPhone(req, res, next) {
  const code = req.body.code
  const userid = req.user.id
  tokenService.getTokenPhoneVerification(userid, code)
    .then(response => {
      if (response.status === false) {
        res.send(response)
      } else {
        userService.verifyPhone(userid)
          .then(response => {
            res.send(response)
          })
          .catch(error => {
            console.log(error);
            res.send({ status: false, content: "error verifing phone number" })
          })
      }
    })
    .catch(error => {
      console.log(error);
      res.send({ status: false, content: "error verifing phone number" })
    })
}

async function sendMailToClient(mailOptions) {
  var resp = true;
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      resp = false;
    } else {
      console.log('Email enviado: ' + info.response);
      console.log('Email enviado, body: ' + req.body);
    }
  });
  return resp
}

async function sendMessageToClient(phone, body) {
  let content
  let status
  phone = phone.replace(/\ /g, "").replace(/\-/g, "").replace(/\(/g, "").replace(/\)/g, "")
  await client.messages.create({
    to: 'whatsapp:' + phone,
    from: 'whatsapp:' + config.twilio.phone_number,
    body
  })
    .then(response => { content = "Message sent successfully"; status = true })
    .catch(error => { content = 'This is not a valid number phone'; status = false })
  return { content, status }
}