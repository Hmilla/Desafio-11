const { Router } = require("express");
const { faker } = require("@faker-js/faker");
faker.locale = 'es_MX'
const router = Router()
const path = require('path')


router.get('/productos-test',(req, res)=>{
    let productos = []
    for(let i = 1; i<=5; i++){
        productos.push(
            {
                nombre:  faker.commerce.product(),
                precio: faker.commerce.price(),
                foto: faker.image.image()
            }
        )
    }
    res.render('products', {productos, hasAny:true})
})

/// DESAFIO 12 /////
function AuthMiddleware(req, res, next){
    if(req.session.username){
        next()
    }else{
        res.redirect('/api/login')
    }
}
function loginMiddleware(req, res, next){
    if(!req.session.username){
        next()
    }else{
        res.redirect('/api')
    }
}

router.get('/login',loginMiddleware, (req, res)=>{
    res.sendFile(path.join(__dirname, '../public/login.html'))
})
router.get('/loginpost',loginMiddleware, (req, res)=>{
    try{
        console.log("entre")
        req.session.username = req.query.username
        console.log(req.session.username)
        res.redirect('/api')
    }catch(err){
        console.log(err)
        res.json({error:true, message: 'Error'})
    }
    
})

router.get('/', AuthMiddleware,(req, res)=>{
    res.sendFile(path.join(__dirname, '../public/home.html'))
})

router.get('/logout', AuthMiddleware, (req, res)=>{
    req.session.destroy(err=>{
        if(!err){
            res.redirect('/api/login')
        }else{
            res.json({status: 'Logout error'})
        }
    })
})


module.exports = router