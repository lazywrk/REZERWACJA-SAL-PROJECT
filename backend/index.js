require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use(
 '/api-docs',
 swaggerUi.serve,
 swaggerUi.setup(swaggerSpec)
);


// DB CONNECT
(async () => {
 try {
   await connectDB();
   console.log('DB connected');
 } catch (err) {
   console.log('Failed to connect to DB');
   process.exit(1);
 }
})();


// ROUTES
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/rooms', require('./routes/rooms'));
app.use('/bookings', require('./routes/bookings'));
app.use('/equipment', require('./routes/equipment'));

app.use('/export', require('./routes/exportCsv'));
app.use('/export', require('./routes/exportPdf'));

app.use('/statistics', require('./routes/stats'));
// TEST
app.get('/', (req,res)=>{
 res.json({ message:'Server works' });
});

app.use(errorMiddleware);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
 console.log(`Server running on http://localhost:${PORT}`);
});