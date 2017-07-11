//Centeral Node File

//Requires
const express = require('express'); //Express lets us do routing more easily
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const https = require('https');

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


//Posting System




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
    https.get({ host: 'www.facebook.com', port: 443, headers: {'user-agent' : 'Mozilla/5.0'}, path: '/RedRockRobot'}, function(resF)
    {
        let body = ''

        resF.on('data', function(chunk)
        {
            body += chunk;
        });

        resF.on('end', function()
        {
            let posts = new Array();


            const CLASS = '_5pbx userContent';
            let positionArray = new Array();
            let postArray = new Array();
            for(let i = 0; i < body.length; i++)
            {
                if(body.slice(i, (i+CLASS.length)) == CLASS)
                {
                    positionArray.push([i, i+CLASS.length])
                }
            }

            for(let i = 0; i < positionArray.length; i++)
            {
                let nextPos = 0;
                if(i+1 == positionArray.length)
                {
                    nextPos = positionArray[i][1] + 400;
                }
                else
                {
                    nextPos = positionArray[i+1][0];
                }
                for(let j = positionArray[i][0]; j < nextPos; j++)
                {
                    if(body.slice(j, j+3) == '<p>')
                    {
                        postArray.push([j + 3]);
                    }
                    else if(body.slice(j, j+4) == '</p>')
                    {
                        postArray[postArray.length-1].push(j)
                    }
                }
            }

            res.render('updatepages/posts', {body: body, postArray: postArray});
            //console.log(body.slice(postArray[0][0], postArray[0][1]));
        });
    }).on('error', function(e)
    {   
        console.log('Error: ' + e.message);
    });
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
