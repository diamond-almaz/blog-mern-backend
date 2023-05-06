import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import * as Validations from './validations';
import {UserController, PostController } from './controllers';
import {checkAuth, handleValidationsErrors} from './utils';

mongoose.connect('mongodb+srv://diamondsharipov:wwwwww@cluster0.4j6xniy.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => {
  console.log('DB OK')
})
.catch((err) => {
  console.log("DB ERROR", err)
})

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({storage});

app.use(express.json())

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/auth/login',  Validations.loginValidation, handleValidationsErrors, UserController.login)
app.post('/auth/register', Validations.registerValidation, handleValidationsErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe) 

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: '/uploads/' + req.file?.originalname
  })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, Validations.postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, Validations.postCreateValidation, PostController.update)


app.listen(4444, () => {

  console.log('Server is working');
})