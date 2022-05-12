const nodemailer = require('nodemailer')
const successHandle = require('../server/handle')
const appError = require('../service/appError')

const sendEmail = (user, verification, res, next) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.NODE_MAILER,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  })
  const array = verification.split('')
  transporter
    .sendMail({
      from: process.env.NODE_MAILER,
      to: user.email,
      subject: 'MetaShare - 密碼重置驗證碼',
      html: `<div>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f0e4f3">
      <tbody>
        <tr>
          <td align="center" style="padding:40px 0"> 
              <img src="https://imgur.com/aCkqvsr.png" alt="metaShare">
          </td>
        </tr>
        <tr>
          <td align="center" valign="top" style="padding-bottom:40px;padding-left:20px;padding-right:20px">
            <table align="center" width="650" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
              <tbody>
                <tr>
                  <td align="left" style="padding:20px">
                    <div style="font-family:sans-serif;font-size:14px;color:#333;">
                      <p >${user.name}，您好</p>

                      <p>要重新設定您的密碼，請在網頁上輸入以下驗證碼</p>
                      <p>驗證成功後，即可設定您的新密碼。</p>
                      <div style="text-align:center;margin-bottom:20px;">
                     
                        <div style="display:inline-block;padding:5px 15px;background:#e6e4fb;font-size:24px;font-weight:bold;border:1px solid #caa9f7;border-radius:5px;margin:0 4px;color:#712caf;">${array[0]}</div>
                        <div style="display:inline-block;padding:5px 15px;background:#e6e4fb;font-size:24px;font-weight:bold;border:1px solid #caa9f7;border-radius:5px;margin:0 4px;color:#712caf;">${array[1]}</div>
                        <div style="display:inline-block;padding:5px 15px;background:#e6e4fb;font-size:24px;font-weight:bold;border:1px solid #caa9f7;border-radius:5px;margin:0 4px;color:#712caf;">${array[2]}</div>
                        <div style="display:inline-block;padding:5px 15px;background:#e6e4fb;font-size:24px;font-weight:bold;border:1px solid #caa9f7;border-radius:5px;margin:0 4px;color:#712caf;">${array[3]}</div>
                     </div>
                      <p style="font-size:12px;"><strong style="color:#6a00ff;">本郵件請勿直接回覆。</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table></div>`,
    })
    .then((info) => {
      successHandle(res, [], '寄送驗證碼至Email')
    })
    .catch(() => {
      next(appError(400, '請重新申請驗證碼或聯絡管理者'))
    })
}

module.exports = sendEmail
