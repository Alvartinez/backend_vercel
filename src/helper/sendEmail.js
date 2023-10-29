const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const enviarMensajeInsideServer = async (usuarioDestino, asunto) => {

    let mailOptions, info;

    const CLIENTD_ID = "877162813446-785knmt5drhn9urrq3nrmck4jpfme4t6.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN = "1//04q3zNx6JQQHuCgYIARAAGAQSNwF-L9IrfKfiKwJIxfyOR7w6qHonwEEjFmHTgRUJTlKtAaTVY_q-szsUoWDwyB7kI4RMsMgaFIA";

    const oAuth2Client = new google.auth.OAuth2(CLIENTD_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "alvaro.martinezudes2@gmail.com",
                clientId: CLIENTD_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        switch (asunto) {

            case "Usuario registrado":
                mailOptions = {
                    from: "HealthTrain <alvaro.martinezudes2@gmail>",
                    to: usuarioDestino.email,
                    subject: "Cuenta creada exitosamente",
                    html:
                        `<!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>HealthTrain - Cuenta creada</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    border: 1px solid #ccc;
                                    background-color: #f9f9f9;
                                }
                                .title {
                                    font-size: 24px;
                                    font-weight: bold;
                                    margin-bottom: 10px;
                                }
                                .content {
                                    font-size: 16px;
                                    margin-bottom: 20px;
                                }
                                .list-item {
                                    margin-bottom: 5px;
                                    marigin-left: 20px;
                                    list-style: none;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="title">HealthTrain - Cuenta creada</div>
                                <div class="content">
                                    <p>
                                        Hola <b> ${usuarioDestino.nombre}</b>,
                                    </p>
                                    <p>
                                        Tu cuenta de usuario ha sido creada con éxito. Aquí están los detalles de tu cuenta:
                                    </p>
                                    <ul>
                                        <li class="list-item"><b>Username:</b> ${usuarioDestino.username}</li>
                                        <li class="list-item"><b>Contraseña:</b> ${usuarioDestino.password}</li>
                                    </ul>
                                </div>
                            </div>
                        </body>
                        </html>`
                }
                info = await transporter.sendMail(mailOptions);
                break;

            case " Cuenta docente creada":
                mailOptions = {
                    from: "HealthTrain <alvaro.martinezudes2@gmail>",
                    to: usuarioDestino.email,
                    subject: "Cuenta docente creada exitosamente",
                    html:
                        `<!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>HealthTrain - Cuenta creada</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    border: 1px solid #ccc;
                                    background-color: #f9f9f9;
                                }
                                .title {
                                    font-size: 24px;
                                    font-weight: bold;
                                    margin-bottom: 10px;
                                }
                                .content {
                                    font-size: 16px;
                                    margin-bottom: 20px;
                                }
                                .list-item {
                                    margin-bottom: 5px;
                                    marigin-left: 20px;
                                    list-style: none;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="title">HealthTrain - Cuenta docente creada</div>
                                <div class="content">
                                    <p>
                                        Hola <b> ${usuarioDestino.nombre}</b>,
                                    </p>
                                    <p>
                                        Tu cuenta de docente ha sido creada con éxito. Aquí están los detalles de tu cuenta:
                                    </p>
                                    <ul>
                                        <li class="list-item"><b>Username:</b> ${usuarioDestino.username}</li>
                                        <li class="list-item"><b>Contraseña:</b> ${usuarioDestino.password}</li>
                                    </ul>
                                </div>
                            </div>
                        </body>
                        </html>`
                }
                info = await transporter.sendMail(mailOptions);
                break;

            default:
                break;

        }

        console.log(info);

    } catch (error) {
        console.log(error);
    }

}

module.exports = enviarMensajeInsideServer;