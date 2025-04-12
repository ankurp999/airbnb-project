const { fileLoader } = require("ejs");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); 

module.exports.index =
    async (req, res) => {
        const allListing = await Listing.find({});
        res.render("./listings/index.ejs", { allListing });
    };


module.exports.newListing = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
        
    let url = req.file.path;
    let fileName = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.image = { url, fileName };
    newListing.owner = req.user._id;
    newListing.geometry  =  response.body.features[0].geometry;
    let savedlisting = await newListing.save();
    console.log(savedlisting);
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
};

module.exports.showIndex = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }

    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};

module.exports.editListings = async (req, res) => {


    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you are trying to edit does not exist!");
        return res.redirect("/listings");
    }
    let originalImage = listing.image.url;    
    originalImage = originalImage.replace("/upload","/upload/h_250,w_250/e_blur:300");
    res.render("./listings/edit.ejs", { listing, originalImage });
};

module.exports.editData = async (req, res) => {

    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let fileName = req.file.filename;
        updatedListing.image = { url, fileName };
        await updatedListing.save();
    }
    if (!updatedListing) {
        req.flash("error", "The listing you are trying to update does not exist!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "The listing you are trying to delete does not exist!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
