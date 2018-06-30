const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
// middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('unable to write server.log');
        }
    });

    // it must be called to execture the middleware and go to the next action
    // without it the call to the server keep hanging
    next();
});

// maintainance
let isMaintenanceOn = false;
app.use((req, res, next) => {
    console.log("isMaintenanceOn", isMaintenanceOn);
    if (isMaintenanceOn) {
        res.render('maintenance.hbs', {
            pageTitle: "Maintenance page"
        });
    } else {
        next();
    }
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>hello Express!</h1>');
    // res.send({
    //     name: 'Mike',
    //     likes: [
    //         'Bikes',
    //         'Yoga'
    //     ]
    // });
    res.render('home.hbs', {
        pageTitle: "Home page",
        welcomeMessage: "Welcome to our website!"
    });
});
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: "About page"
    });
});

app.listen(port, () => {
    console.log('Server is up on port 3000');

});