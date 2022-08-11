const express = require('express')
const {Server : IOServer} = require('socket.io')
const path = require('path')
const fs = require('fs')
const app = express()
const routes = require('./routes/index.js')
const {engine} = require('express-handlebars')

const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(express.json())
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://hector:hector12345678@cluster0.gz2gxsv.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions
    }),
    secret: "coderhouse",
    resave: false,
    saveUninitialized: false,
    rolling: true, // reinicia el tiempo de expiración con cada request
    cookie: {
      maxAge: 600000,
    },
  })
);



app.engine('hbs', engine({
    extname : 'hbs',
    defaultLayout: path.join(__dirname , './views/layouts/main.hbs'),
    layoutsDir: path.join(__dirname, './views'),
    partialsDir: path.join(__dirname, './views/partials')
}))

app.set('views', path.join(__dirname,'./views'))
app.set('view engine', 'hbs')

const serverExpress = app.listen(8080, (err)=>{
    if (err){
        console.log(`Hubo un error ${err}`)
    }else{
        console.log('Servidor escuchando puerto: 8080')
    }
})
const io = new IOServer(serverExpress)
const products = []
let messages = []

app.use(express.static(path.join(__dirname, './public')))
app.use('/api', routes)

async function write(){
    try{
        await fs.promises.writeFile(path.join(__dirname,'/messages'), JSON.stringify(messages))
        console.log('se guardaron los mensajes con éxito')
    }catch(err){
        console.log('Hubo un error al guardar los mensajes',  err)
    }

}

function read(){
    try{
        const messages_archivo = fs.readFileSync(path.join(__dirname,'/messages'),"utf-8")
        const messagesData = JSON.parse(messages_archivo)
        messages = messagesData
    } catch(error){
        console.log("Hubo un error -> " + error)
    }
}

io.on('connection', socket =>{

    read()
    console.log(`Se conectó un usuario ${socket.id}`)
    io.emit('server:product', products)
    io.emit('server:message', messages)
    socket.on('client:product', productInfo =>{
        const product = productInfo
        if(products.length){
            const id = products[products.length - 1].id + 1
            product.id = id
        }else{
            product.id = 1
        }
        products.push(product)
        io.emit('server:product', products)
    })
    socket.on('client:message', messageInfo =>{

        messages.push(messageInfo)
        write()
        io.emit('server:message', messages)
    })
})


