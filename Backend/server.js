const express = require('express');

const bodyParser = require('body-parser');
var urlEncodeParser = bodyParser.urlencoded({extended:true});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(urlEncodeParser);

let port = 3001;

const uri = 'mongodb+srv://jflg24:YX1gkFQQab8yWq0u@claseux.zciih6l.mongodb.net/?retryWrites=true&w=majority&appName=ClaseUX';

const client = new MongoClient(uri, {
    serverApi:{
        version:ServerApiVersion.v1,
        strict:true
    }
});

async function run(){
    try{
        await client.connect();
        console.log('Conectado a la base de datos');
    }catch(error){
        console.log('Hubo un error al conectarse a la base de datos', error);
    }
}

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto", port)
    run();
}); 


///////////////////////
app.post('/createPost',async (req,res)=>{
    try{
        let datos = req.body;
        let {titulo, descripcion, usuarioID} = datos;

        const client = new MongoClient(uri);
        const database = client.db('Examen2');
        const collection = database.collection('Post');

        const resultado = await collection.insertOne({
            titulo: titulo,
            descripcion: descripcion,
            usuarioID: usuarioID
        });
        console.log("Post creado con exito!");
        res.status(200).send({
            mensaje: "Post creado con exito!",
            resultado: resultado
        });
    } catch(error){
        console.log("No se puedo crear el post!",error);
        res.status(500).send({
            mensaje: "No se puedo crear el post!"+error
        });
    }
});

app.get('/listPost',async (req,res)=>{
    try{
        const client = new MongoClient(uri);
        const database = client.db('Examen2');
        const collection = database.collection('Post');

        const resultado = await collection.find({}).toArray();
        if(resultado.length>0){
            console.log("Posts obtenidos con exito!");
            res.status(200).send({
                mensaje: "Posts obtenidos con exito!",
                resultado: resultado
            });
        } else{
            res.status(200).send({
                message: 'Posts obtenidos con exito',
                resultado: []
            });
        }
    } catch(error){
        console.log("No se puedieron listar los Post!",error);
        res.status(500).send({
            mensaje: "No se puedieron listar los Post!"+error
        });
    }
});

app.put('/editPost',(req,res)=>{

});

app.delete('/deletePost',(req,res)=>{

});