const { Router } = require("express");
const { faker } = require("@faker-js/faker");
faker.locale = 'es_MX'
const router = Router()
const path = require('path')
const util = require('util')

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

router.get('/info', (req, res)=>{
    res.json({
        argumentos_entrada: '',
        sistema_operativo: process.platform, 
        version_node: process.version,
        rss: util.inspect(process.memoryUsage(), {
            showHidden:false,
            depth: null,
            colors: true
        }),
        path_ejecucion: '',
        process_id: process.pid,
        carpeta_proyecto: __filename
    })
})

router.get('/randoms', (req, res)=>{
    try{
        let cantidad 
        if(req.query.cant){
            cantidad=Number(req.query.cant)
        }else{
            cantidad = 100000000
        }
        numero = Math.floor(Math.random() * 122 + 1)
        res.send({cantidad, numero})
    }catch(err){
        res.send(err)
    }
    
})

module.exports = router