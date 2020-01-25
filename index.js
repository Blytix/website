const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const nodemailer = require("nodemailer");
const keys = require('./gkeys');
const templateViews = require('./views/contactEmailTemplate')
const jobTemplate = require('./views/jobApplicationTemplate')
const siteSecret = '6LeyltIUAAAAAGD9sb6G6fzhlbFR0NIHiC92M6qa'
const axios = require("axios");

async function sendMail(content, EmailTemplate, Subject){
        
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: keys.baseMailTransporter.mail,
            pass: keys.baseMailTransporter.pw
        }
    });

    const html = await EmailTemplate(content)
    let mailOptions = {
        from: "blossomanalyticsleads@gmail.com",
        to: ["info@blytix.com", "jeph@blytix.com"],
        subject: Subject,
        html: html,
    };

    transporter.sendMail(mailOptions, (error, success) => {
        if (error) {
            _message = 'Error sending message'
            console.log('error', error, _message)

            return false
        } else {

            _message = 'Message recieved and will get in touch soon'
            console.log('success', success, _message)
            return true
        }
    });
    transporter.close();
}

async function SafeToSend(data){ 
    if(!data.captcha){
        return false
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${siteSecret}&response=${data.captcha}`;

    try {
        const response = await axios.get(verifyUrl);
        const body = response.data;
        if(!body.success || body.score < 0.5){
            return false;
        }
        return true
      } catch (error) {
        console.log(error);
      }
}

app.use(cookieParser())

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/assets'));

const multer = require('multer');
const upload = multer({ dest: 'uploads/' })


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

app.use('/join_blytix', upload.single('cv_file'), async (req, res, next) => {
    console.log('file', req.files)
    if (req.method == 'POST') {
        const data = {
            name : req.body.name,
            email : req.body.email,
            country : req.body.country,
            phone : req.body.phone,
            linkedin : req.body.linkedin,
            cv_file : req.files
        }

        var template = jobTemplate.jobApplicationTemplate

        var safe = await SafeToSend(data)
        if(safe){
            sendMail(data, template, "Application to work at Blytix")
        }
    }

})

app.use('/contact', async (req, res, next) => {
    _message = ''
    if (req.method == 'POST') {
        const data = {
             name : req.body.name,
             email : req.body.email,
             company : req.body.company,
             phone : req.body.phone,
             job_type : req.body.job_type,
             message : req.body.message
        }

        var template = templateViews.contactFormTemplate

        var safe = await SafeToSend(req.body)
        console.log(safe)
        if(safe){
            sendMail(data, template, data.job_type)
        }
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