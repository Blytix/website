const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const nodemailer = require("nodemailer");
const keys = require('./gkeys');
const templateViews = require('./views/contactEmailTemplate')
const alert = require('alert-node')


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

app.use('/career/data-engineer', async (req, res, next) => {
    res.render('data-engineer')
})

app.use('/career/data-scientist', async (req, res, next) => {
    res.render('data-scientist')
})

app.use('/careers', async (req, res, next) => {
    res.render('career')
})

app.use('/hire-analytics-talent', async (req, res, next) => {
    res.render('hire_analytics_talent')
})

app.use('/what-we-do', async (req, res, next) => {
    res.render('what_we_do')
})

app.use('/privacy-policy', async (req, res, next) => {
    res.render('privacy')
})

app.use('/terms-of-service', async (req, res, next) => {
    res.render('terms')
})

app.use('/contact', async (req, res, next) => {
    _message = ''
    if (req.method == 'POST') {
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const job_type = req.body.job_type
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
            message,
            phone,
            job_type
        }

        const html = templateViews.contactFormTemplate(content)
        let mailOptions = {
            from: email,
            to: email,
            subject: job_type,
            html: html,
        };

        transporter.sendMail(mailOptions, (error, success) => {
            if (error) {

                _message = 'Error sending message'
                console.log('error', error, _message)
                alert(_message)
            } else {

                _message = 'Message recieved and will get in touch soon'
                console.log('success', success, _message)
                alert(_message)
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