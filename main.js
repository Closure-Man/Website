//Centeral Node File

//Requires
let express = require('express'); //Express lets us do routing more easily

let app = express();

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

app.get('/about', function(req, res)
{
    res.render('about');
});

app.listen(3000);
