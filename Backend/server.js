const express = require('express');

const bodyParser = require('body-parser');
var urlEncodeParser = bodyParser.urlencoded({extended:true});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const {initializeApp} = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');

const app = express();
app.use(urlEncodeParser);

let port = 3001;

const uri = 'mongodb+srv://jflg24:YX1gkFQQab8yWq0u@claseux.zciih6l.mongodb.net/?retryWrites=true&w=majority&appName=ClaseUX';

const firebaseConfig = {
    apiKey: "AIzaSyDTlXOlK5btn-oijMjrCanCnZrZ_S77Ilk",
    authDomain: "examen2ux-e5dff.firebaseapp.com",
    projectId: "examen2ux-e5dff",
    storageBucket: "examen2ux-e5dff.appspot.com",
    messagingSenderId: "51059550869",
    appId: "1:51059550869:web:bb721afaafe6221ba5499c",
    measurementId: "G-S4JD54LFW9"
};
  
const client = new MongoClient(uri, {
    serverApi:{
        version:ServerApiVersion.v1,
        strict:true
    }
});

const firebaseApp = initializeApp(firebaseConfig);

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

////////////////////Firebase
app.post('/createUser',async (req,res)=>{
    const auth = getAuth(firebaseApp);
    const email = req.body.correo;
    const password = req.body.contrasena;
    try{
        const userCredential = await createUserWithEmailAndPassword(auth,email,password);
        console.log("Usuario creado con exito!");
        res.status(200).send({ 
            descripcion: 'Usuario creado con exito!',
            resultado: userCredential
        });
    }catch(error){
        console.log('Hubo un error al crear el usuario!',error);
        res.status(500).send({ 
            descripcion: 'No se pudo crear el usuario en firebase!',
            resultado: error
        });
    }
});

app.post('/logIn',async (req,res)=>{
    const auth = getAuth(firebaseApp); // inicializamos nuestro servicio de autenticacion
    const email = req.body.correo; // obtenemos el email
    const password = req.body.contrasena; // obtenemos la contrasena
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Sesion iniciada con exito!");
        res.status(200).send({
            descripcion: 'Sesion iniciada con exito!',
            resultado: userCredential
        });
    }catch(error){
        res.status(500).send({
            descripcion: 'No se pudo iniciar sesion!',
            resultado: error
        });
    }
});

app.post('/logOut',async (req,res)=>{
    const auth = getAuth(firebaseApp);
    try{
        await signOut(auth);
        console.log("Sesion cerrada con exito!");
        res.status(200).send({
            descripcion: 'Sesion cerrada con exito!'
        });
    }catch(error){
        res.status(500).send({
            descripcion: 'No se pudo cerrar sesion!',
            resultado: error
        });
    }
});

////////////////////Mongo
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

app.put('/editPost/:usuarioID',async (req,res)=>{
    try{
        //console.log(req.params.id);
        const client = new MongoClient(uri);
        const database = client.db('Examen2');
        const collection = database.collection('Post');

        const resultado = await collection.updateOne({
            usuarioID: req.params.usuarioID
        },{
            $set:{
                ...req.body
            }
        });
        console.log("Post actualizado con exito!");
        res.status(200).send({
            message: 'Se actualizo el Post!',
            resultado: resultado
        });
    }catch(error){
        console.log("No se pudo actualizar el Post!", error);
        res.status(500).send({
            message: "No se pudo actualizar el Post!"+error
        });
    }
});

app.delete('/deletePost/:usuarioID', async (req,res)=>{
    try{
        const client = new MongoClient(uri);
        const database = client.db('Examen2');
        const collection = database.collection('Post');
        
        //const query = {_id: new ObjectId(req.body.id)};
        const query = {usuarioID: req.params.usuarioID};
        const resultado = await collection.deleteOne(query);

        if(resultado.deletedCount===1){
            console.log("Post eliminado con exito!");
            res.status(200).send({
                message: 'Post eliminado con exito!',
                resultado: resultado
            });
        }else{
            res.status(200).send({
                message: 'No se encontro el post a eliminar, no se elimino nada!'
            });
        }
        
    }catch(error){
        console.log("No se pudo eliminar el post!", error);
        res.status(500).send({
            message: "No se pudo eliminar el post!"+error
        });
    }
});