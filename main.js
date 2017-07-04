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

//HOME PAGE

app.get('/', function(req, res)
{
    res.render('home'); //Filler
});


//CONTACT PAGES

app.get('/contact', function(req, res)
{
    res.render('contactpages/contact');
});

app.get('/contact/socialmedia', function(req, res)
{
    res.render('contactpages/socialmedia');
})

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
        res.render('contactpages/error');
    }
    else
    {
        transporter.sendMail(mailOptions, function(error, info)
        {
            if(error)
            {
                console.log(error);
                res.render('contactpages/error');
            }
            else
            {
                res.render('contactpages/success');
            }
        });
    }
});

//RESOURCE PAGES

app.get('/resources/software', function(req, res)
{
    res.render('resourcepages/software');
});

app.get('/resources/electronics', function(req, res)
{
    res.render('resourcepages/electronics');
});

app.get('/resources/hardware', function(req, res)
{
    res.render('resourcepages/hardware');
});

app.get('/resources/safety', function(req, res)
{
    res.render('resourcepages/safety');
});


//ABOUT PAGES

app.get('/about', function(req, res)
{
    res.render('aboutpages/about');
});

app.get('/about/first', function(req, res)
{
    res.render('aboutpages/aboutfirst');
});

app.get('/about/history', function(req, res)
{
    res.render('aboutpages/abouthistory');
});

app.get('/about/robot', function(req, res)
{
    res.render('aboutpages/aboutrobot');
});

//SPONSOR PAGES

app.get('/sponsors', function(req, res)
{
    res.render('sponsorpages/sponsors');
});

app.get('/sponsors/info', function(req, res)
{
    res.render('sponsorpages/sponsorinfo');
});


//UPDATE PAGES

app.get('/updates', function(req, res)
{
    res.render('updatepages/posts');
});

app.get('/updates/stream', function(req, res)
{
    res.render('updatepages/stream');
});

app.get('/updates/calendar', function(req, res)
{
    res.render('updatepages/calendar');
})


app.listen(3000);
