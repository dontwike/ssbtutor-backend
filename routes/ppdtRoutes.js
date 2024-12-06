const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/Authorization");
const ppdt = require("../model/mongodb/ppdt");
const PurchasedItem = require("../model/mongodb/PurchasedItem");
const User = require("../model/mongodb/user");
const { getUserById } = require("../Service/UserService/userSevrice");

const getUserPurchasedPPDT = async (userId) => {
  const purchasedItems = await PurchasedItem.findOne({
    userId,
  });
  if (!purchasedItems) {
    return [];
  }

  return purchasedItems.itemId.filter((item) => item.startsWith("PPDT"));
};

//Get all PPDTS
router.get("/ppdt", Authorization, async (req, res) => {
  try {
    console.log("ppdt");
    const userId = req.userId;

    const purchasedPPDTItems = await getUserPurchasedPPDT(userId);

    if (purchasedPPDTItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No PPDT posts found in purchased items.",
        PPDT_posts: [],
      });
    }

    const allPPDTPosts = await ppdt.find();

    const purchasedPosts = allPPDTPosts.filter((post) =>
      purchasedPPDTItems.includes(post.name)
    );

    const unPurchasedPosts = allPPDTPosts.filter(
      (post) => !purchasedPPDTItems.includes(post.name)
    );

    res.status(200).json({
      success: true,
      purchasedPosts,
      unPurchasedPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

//Get the PPDT according to the id
router.get("/ppdt/:id", Authorization, async (req, res) => {
  try {
    console.log("ppdt id");
    const userId = req.userId;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const purchasedPPDTItems = await getUserPurchasedPPDT(userId);

    if (!purchasedPPDTItems.includes(`PPDT ${id}`)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this PPDT post.",
      });
    }

    // MongoDB: Get the specific PPDT post
    const post = await ppdt.findOne({
      id: id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.post("/buyppdt", Authorization, async (req, res) => {
  try {
    console.log("buy ppdt");
    const userId = req.userId;
    const findUser = await getUserById(userId);

    const { ppdtprice, ppdtname } = req.body;

    const findPPDT = await ppdt.findOne({
      name: ppdtname,
    });

    const findIfUserHaveThisPPDT = await PurchasedItem.findOne({
      userId: userId,
      itemId: {
        $in: [findPPDT.name],
      },
    });

    if (findIfUserHaveThisPPDT) {
      res.status(401).json({
        success: false,
        message: "You already have this PPDT",
      });
    }

    const addPPDT = await PurchasedItem.updateOne(
      {
        userId: userId,
      },
      {
        $addToSet: { itemId: findPPDT.name },
      }
    );

    const updatedUser = await User.updateOne(
      {
        _id: userId,
      },
      {
        credits: findUser.credits - ppdtprice,
      }
    );

    res.status(200).json({
      success: true,
      message: "Successfully Purchased",
      credits: updatedUser.credits,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Something went wrong!!!",
    });
  }
});

module.exports = {
  router,
};
