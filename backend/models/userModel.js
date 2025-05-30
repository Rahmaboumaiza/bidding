const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: { type: String, required: [true ,"please add a name"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: [true ,"please provide your password"]},
      photo: {
      type: String,
      require: [true, "Please add a photo"],
      default: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
    },
    role: { type: String, enum: ['admin', 'seller', 'buyer'], default:"buyer" }, 
    commissionBalance: { type: String, default:0 }, 
    Balance :{ type:Number, default:0 }, 
    favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Reference to your Product model
  }]
}, 
{timestamps:true}
);

userSchema.pre("save",async function(next){
    if (!this.isModified("password")){
        return next();
    }
    const salt =await bcrypt.genSalt(10);
    const hashedPassword =await bcrypt.hash (this.password ,salt);
    this.password =hashedPassword;
    next();

})

/*🔐 Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 🔒 Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};*/

const User = mongoose.model('User', userSchema);
module.exports = User;
