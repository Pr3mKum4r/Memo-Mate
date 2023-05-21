const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Note = require('./dataSchema')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/reactdata', { useNewUrlParser: true });

app.post('/save', async (req, res) => {
    const Id = req.body.NoteDataId
    const Text = req.body.NoteDataText
    const Date = req.body.NoteDataDate
    const UserId = req.body.UserId

    const noteData = new Note({
        UserId: UserId,
        UserData:
        {
            NoteDataId: Id,
            NoteDataText: Text,
            NoteDataDate: Date,
        }
    })

    try {
        await noteData.save();
        console.log("Inserted \n" + Text + "\nfor " + UserId);
    } catch (err) {
        console.log(err)
    }
});

app.get("/getUserData", async(req,res)=>{
    try{
        const userData = await Note.find({});
        res.send({status: "ok", data: userData});
    }
    catch(err){
        console.log(err)
    }
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
