const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const nodemailer = require("nodemailer");
const keys = require('./gkeys');
const templateViews = require('./views/contactEmailTemplate')

const showToast = require('show-toast');
app.use(cookieParser())

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/assets'));

app.use('/faq', async (req, res, next) => {
    res.render('faq')
})

app.use('/career', async (req, res, next) => {
    res.render('career')
})

app.use('/hire-analytics-talent', async (req, res, next) => {
    res.render('hire_analytics_talent')
})
app.use('/what-we-do', async (req, res, next) => {
    res.render('what_we_do')
})
app.use('/contact', async (req, res, next) => {
    _message = ''
    if (req.method == 'POST') {
        const name = req.body.name
        const email = req.body.email
        const subject = req.body.subject
        const message = req.body.message

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: keys.baseMailTransporter.mail,
                pass: keys.baseMailTransporter.pw
            }
        });

        const content = {
            name,
            email,
            message
        }
        const html = templateViews.contactFormTemplate(content)
        let mailOptions = {
            from: email,
            to: email,
            subject: subject,
            html: html,
        };

        transporter.sendMail(mailOptions, (error, success) => {
            if (error) {
                console.log('')
                _message = 'Error sending message'
            } else {
                _message = 'Message recieved and will get in touch soon'
            }
            transporter.close();
        });
    }
    res.render('contact')
})
app.use('/about', async (req, res, next) => {
    res.render('about')
})
app.use('/', async (req, res, next) => {
    res.render('index')
})


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error
    })
})

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Page starts on http://localhost:${port}`))