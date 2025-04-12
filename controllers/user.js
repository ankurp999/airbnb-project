const User = require("../models/user.js");

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newuser = new User({
            email, username
        });
        const registereduser = await User.register(newuser, password);
        req.login(registereduser,(err)=>{
            if(err){
               return next(err);
            }
            console.log(registereduser);
        req.flash("success", "welcome to wanderLust");
        res.redirect("/listings");

        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}
module.exports.signIn =async (req, res) => {
    req.flash("success","welcome to wanderLust you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log(redirectUrl);
    res.redirect(redirectUrl);
 }

 module.exports.signOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}