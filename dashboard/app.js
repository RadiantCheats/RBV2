const cors = require("cors")
const ejs = require("ejs")
const session = require('express-session');
const cookieParser = require('cookie-parser');
const config = require('../assets/config.js');
const express = require('express');

export default async (client) => {

    // const port = config.development ? config.dev.dashboard.port : config.prod.dashboard.port
    // const secret = config.development ? config.dev.dashboard.secret : config.prod.dashboard.secret

    // const app = express();

    // app.use(cors({
    //     origin: '*',
    //     optionsSuccessStatus: 200
    // }))
    // app.use(session({ secret: secret, resave: false, saveUninitialized: false }))
    // app.engine("html", ejs.renderFile);
    // app.use(express.static('./dashboard/public'));
    // app.use(express.urlencoded({ extended: true }))
    // app.use(cookieParser());
    // app.use('/', Root);
    // app.set('views', `./dashboard/views`);
    // app.set('view engine', 'ejs');
    // app.get('*', (req, res) => {
    //     res.render("./errors/404.ejs");
    // })
    // app.listen(port, () => {
    //     console.log(`Running the Radiant Dashboard on port ${port}`);
    // })

}