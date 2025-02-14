const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true, cookie: { secure: false }}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const token = req.headers["authorization"].slice("Bearer ".length)
if(!token){
    return res.status(403).json({
        error: "Forbidden",
        message: "Access denied. No token provided."
    })
}else {
    jwt.verify(token, "secret_key", (err, decoded)=>{
        if(err){
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid token."
            })
        } else{
            req.user = decoded;
            next();
        }
    })
}

});
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
