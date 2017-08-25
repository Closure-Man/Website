//Centeral Node File

//Requires
const express = require('express'); //Express lets us do routing more easily
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const https = require('https');
const DOMParser = require('dom-parser');
const mongodb = require('mongodb');

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

const mongoClient = mongodb.MongoClient;

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

app.get('/resources', function(req, res)
{
    res.render('resourcepages/resources');
});

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

        let body = '';

        resF.on('data', function(chunk)
        {
            body += chunk;
        });

        resF.on('end', function()
        {

            let fbFinisher = new Promise((resolve, reject) => {});

            let fbDoc = new DOMParser().parseFromString(body, 'text/html');

            let posts = new Array();
            let content = fbDoc.getElementsByClassName('fbUserPost'); 
            for(let i = 0; i < content.length; i++)
            {
                let para = content[i].getElementsByClassName('_5pbx userContent');
                let date = content[i].getElementsByClassName('timestampContent')[0].textContent;

                let finalP = '';

                for(let j = 0; j < para.length; j++)
                {
                    let temp = para[j].getElementsByTagName('p');
                    posts.push([date, temp]);
                }
            }
            res.render('updatepages/posts', {posts: posts});
        });
    }).on('error', function(e)
    {   
        res.render('updatepages/postserror');
    });
});

app.get('/updates/stream', function(req, res)
{
    res.render('updatepages/stream');
});

app.get('/updates/calendar', function(req, res)
{
    res.render('updatepages/calendar');
});


//Scouting Database Stuff

app.get('/scoutingdata', function(req, res) {
    res.render('scoutingdatabase/scoutingdata');
});

app.post('/scoutingdata', urlendcodedParser, (req, res) => {
    mongoClient.connect('mongodb://localhost:27017/sample', (error, db) => {
        if (error) {
            console.log("Error: " + error);
        }
        else {
            let collections = db.collection('data');

            let output = "No data on that team yet";

            collections.find({"teamnum" : req.body.teamnum}).toArray((err, result) => {
                if(err){
                    console.log("Error: " + err);
                }
                else if(result.length){
                    output = result;
                }
                else {
                    console.log("No Data currently");
                    output = [{"teamnum" : "NO DATA", "matchnum" : "NO DATA", "ballsscored" : "NO DATA", "gearsscored" : "NO DATA"}];
                }
                

                res.render('scoutingdatabase/scoutingresult', {out: output});
            });
        }
    });
});

app.listen(8080);
