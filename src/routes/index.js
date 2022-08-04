const { Router } = require("express");
const { faker } = require("@faker-js/faker");
faker.locale = 'es_MX'
const router = Router()


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


module.exports = router