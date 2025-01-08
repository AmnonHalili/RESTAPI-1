import express,{Express} from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';
import bodyParser from 'body-parser';
import userRoutes from './routes/user_routes';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from "swagger-ui-express";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/users", userRoutes);


const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: " Project Web Dev 2025 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT (API for user authentication, post management, and comments)",
      },
      servers: [{ url: "http://localhost:3003", },],
    },
    apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
// Swagger setup
// const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const initApp=()=> { 
    console.log('initApp start');    
    return new Promise<Express>((resolve,reject)=>{
        const db= mongoose.connection;
        db.on("error", (err)=>{
            console.log(err);
        });
        db.once("open",()=>{
            console.log("connected to MongoDB");
        });

        if(process.env.DB_CONNECT === undefined){
            console.error("DB_CONNECT is not set");
            reject();  
        }else{
            mongoose.connect(process.env.DB_CONNECT).then(()=>{
                console.log('initApp finish');
                app.get("/about", (req,res)=>{
                    res.send("About page");
                });
                resolve(app);
            });
        }
    });
};
export default initApp;


