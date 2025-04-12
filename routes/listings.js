const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedin ,isOwner,validateListing } = require("../middlewares.js");
const methodOverride = require("method-override");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

router.use(methodOverride("_method"));


router.route("/")
.get( wrapAsync( ListingController.index))
.post(isLoggedin,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.createListing))


// New listing form
router.get("/new", isLoggedin, ListingController.newListing);

router.route("/:id")
.get(wrapAsync(ListingController.showIndex))
.put(upload.single('listing[image]'),validateListing,isLoggedin,isOwner,  wrapAsync(ListingController.editData))
.delete(isLoggedin,isOwner,wrapAsync(ListingController.destroyListing))
// Edit route (GET)
router.get(
    "/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(ListingController.editListings)
);

module.exports = router;