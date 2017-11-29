const express = require('express');
//handlebars js is a view engine
const hbs = require('hbs');
const fs = require('fs');

var app = express();

//stored partials (pieces of a page) need to be registered
//__dirname is the absolute path of the app folder
hbs.registerPartials(__dirname + '/views/partials');
//the view engine needs to be set in the express app
app.set('view engine', 'hbs');
//register middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log +'\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        }
    });
    next(); 
});

//Maintence middleware
// app.use((req, res, next) => {
//     res.render('maintanence.hbs');
// });

app.use(express.static(__dirname + '/public'));

//helper functions can be called in hbs
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) =>{
    return text.toUpperCase();
});


//view engines such as hbs are rendered on the go, hence the render function
//the get function returns a request obj and a response obj 
app.get('/', (request, response) => {
    // response.send('<h1>Hello Express</h1>');
    response.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to blabla.com'
    });
});

app.get('/about', (request, response) => {
    response.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

//the send function is used to send data to a static page.
app.get('/bad', (request, response) => {
    response.send({
        code: 404,
        errorMessage: 'There was an error retrieving the page'
    });
});

//The expressapp is always listening on a port
app.listen(3000, () => {
    console.log("Server is up on port 3000");
});