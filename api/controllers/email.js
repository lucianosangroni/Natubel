const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
    const { email, codigo } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'natubel.com.ar@gmail.com',
            pass: 'cfyn kuvs yvvh gwiq',
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

module.exports = { sendEmail };