const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name:{
        type : String,
        required: [true,"Please add your name"]
    },
    email: {
        type : String,
        required: [true,"Please add your name"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid emaial",
        ]
    },
    password: {
        type : String,
        required: [true,"Please add your password"],
        minLength: [6, "Password must be up to 6 characters"],
       //   maxLength: [20, "Password must not be more than 20 characters"],
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
      },
      phone: {
        type: String,
        default: "+94",
      },
      bio: {
        type: String,
        maxLength: [100, "Bio must not be more than 100 characters"],
        default: "Your bio",
      }
    },{
        timestamps: true,
    }

);

 // Encrypt password before saving to DB
 userSchema.pre("save", async function(next){
      if(!this.isModified("password")){
         return next();
      }

    // Hash password
    const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
 })

const User = mongoose.model("User", userSchema)
module.exports = User