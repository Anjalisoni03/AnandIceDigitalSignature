const mongoose = require('mongoose');

const url=`mongodb+srv://chat_app_admin:KGNUaiclOtscL2TL@cluster0.on76y2v.mongodb.net/?retryWrites=true&w=majority`;
// const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zw6hky5.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB')).catch((e)=> console.log('Error', e))