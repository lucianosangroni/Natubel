const nodemailer = require('nodemailer');

const sendEmailCodigo = async (req, res) => {
    const { email, codigo } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'natubel.com.ar@gmail.com',
            pass: 'oygv ccjo bygt kgwb',
        },
    });
    
    const mailOptions = {
        from: 'Natubel.com.ar <natubel.com.ar@gmail.com>',
        to: email,
        subject: 'Verificar pedido de Natubel',
        text: `Tu código de verificación es: ${codigo}`,
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Correo enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
}

const sendEmailPedido = async (req, res) => {
    const { file } = req
    const { email } = req.body

    if (!file || !email) {
        return res.status(400).send(`Error al enviar pedido al mail: ${email}`);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'natubel.com.ar@gmail.com',
            pass: 'oygv ccjo bygt kgwb',
        },
    });
    
    const mailOptions = {
        from: 'Natubel.com.ar <natubel.com.ar@gmail.com>',
        to: email,
        subject: 'Pedido Natubel',
        text: `Adjunto encontrarás el PDF de tu pedido`,
        attachments: [
            {
                filename: file.originalname,
                content: file.buffer
            }
        ]
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Correo enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
}

module.exports = { sendEmailCodigo, sendEmailPedido };