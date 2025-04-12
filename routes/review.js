const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js"); 
const {listingSchema,reviewSchema} = require("../schema.js");
const review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLoggedin , validateReview,isReviewAuthor } = require("../middlewares.js");
const reviewController =require("../controllers/reviews.js");


// post route for review 
router.post("/",isLoggedin,validateReview, wrapAsync(reviewController.createReview));
 
 //delete route for review
 router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(reviewController.destroyReview));

 module.exports = router;
 