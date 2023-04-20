require('dotenv').config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const methodOverride = require("method-override")
const session = require("express-session");
const passport = require("passport");
const MongoStore = require('connect-mongo')


const app = express();
const port = 5000 || process.env.PORT;


app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.MONGODB_URI
    }, { bufferTimeoutMS: 30000 }),
    cookie:{maxAge:new Date (Date.now()+(3600000))}
    // date = 30*24*60*60*1000
}));

app.use(passport.initialize());
app.use(passport.session())

//static files
app.use(express.static('public'))

//template engine
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

// routes
app.use(require("./server/routes/auth"));
app.use(require("./server/routes/index"));
app.use(require("./server/routes/dashboard"));


// handle the 404 error
app.get('*',(req,res)=>{
    res.status(404).render('404');
})
connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`app listening on ${port}`);
    })
});
