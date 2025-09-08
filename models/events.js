const mongoose = require("mongoose");
const broadcastMail = require("../services/emails")

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "teacher", required: true }, // teacher id
    department: { type: String },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    attendes: [{ type: mongoose.Schema.Types.ObjectId, ref: "student", required: true }],
    mode: { type: String, enum: ['online','offline'], required: true},
    address : { type: String, default: 'N/A'}
  },
  { timestamps: true }
);

eventSchema.post('save',async (doc, next) => {
  try{
    await doc.populate('attendes','email')
    
    broadcastMail(doc)
    .then(result => console.log("Email send")).catch(err=>console.log(err))

    next()
  }catch(err){
    next(err);
  }
})

eventSchema.post('findOneAndUpdate',async (doc, next) => {
  try{
    await doc.populate('attendes','email')
    
    broadcastMail(doc,"U")
    .then(result => console.log("Email send")).catch(err=>console.log(err))

    next()
  }catch(err){
    next(err);
  }
})

eventSchema.post('findOneAndDelete',async (doc, next) => {
  try{
    await doc.populate('attendes','email')
    
    broadcastMail(doc,"C")
    .then(result => console.log("Email send")).catch(err=>console.log(err))

    next()
  }catch(err){
    next(err);
  }
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event