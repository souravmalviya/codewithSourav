


const express= require('express');
const app= express();
const jwt= require('jsonwebtoken') //external library 
const JWT_SECRET= "sourav123"

app.use(express.json()) //middlewear 


const users= []

function signinhandler(req, res){
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && user.password === password);
    console.log(user)

    if (user) {

        const token = jwt.sign({ 
            username: username  
        }, JWT_SECRET)
    

        res.send({
            token
        })
        console.log(users);

    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    } 

}

function signuphandler(req, res){
    const username= req.body.username;
    const password= req.body.password;

    // if(users.find(u => u.username=== username)){
    //     res.json({
    //         message: "you are already signed in "
    //     })
    // }
    users.push({
        username: username,
        password: password
    })
    res.json({
        message: "you are signed up  "
    })


}

function auth(req, res, next){
    const token=req.headers.token;
    const decode= jwt.verify(token,JWT_SECRET);
     //const username= 
     if(decode.username ){
        req.username= decode.username
        next();
     }else{
        res.json({
            message:"Invalid Sir, You are Not Logged in"
        })
     }

}

app.get('/me',auth, (req, res)=>{ //usr get  the user name someone is
  
    const user = users.find(user => user.username=== req.username);

    if(user){
        res.send({
            messgae: user.username
        })

    }else{
        res.status(401).send({
            message: "unauthorized"
        })
    }
})


app.post('/signup',signuphandler )


app.post('/signin',signinhandler)


app.listen(3000,()=>{
    console.log("your app is Running on 3000 port")

})