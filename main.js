//Centeral Node File

//Requires
const express = require('express'); //Express lets us do routing more easily
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const urlendcodedParser = bodyParser.urlencoded({extended: false});
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'redrockfrc@gmail.com',
        pass: '#0Mn!wh3EL5'
    }
});

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/', function(req, res)
{
    res.render('home'); //Filler
});

app.get('/contact', function(req, res)
{
    res.render('contact');
});

app.post('/contact', urlendcodedParser, function(req, res)
{
    //if(!req.body) return res.send(400);
    let mailOptions = {
        from: req.body.senderEmail,
        to: req.body.toEmail,
        subject: req.body.subject,
        text: req.body.senderEmail + ' ' + req.body.message
    };
    if(!req.body.senderEmail || !req.body.message)
    {
        res.render('error');
    }
    else
    {
        transporter.sendMail(mailOptions, function(error, info)
        {
            if(error)
            {
                console.log(error);
                res.render('error');
            }
            else
            {
                res.render('success');
            }
        });
    }
});

app.get('/about', function(req, res)
{
    res.render('about');
});

app.listen(3000);
