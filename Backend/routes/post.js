const router = require("express").Router();

const postController = require("../controllers/postController");
const authMiddleWare = require("../middlewares/authjwt");
const upload = require("../utils/imgLoader")

//CONTROLLER PATHS
router.post("/create", authMiddleWare, upload.array("image", 5), postController.createPost);
router.put("/update/:postId", upload.single("image"), postController.updatePostById);
router.get("/allPosts", postController.getPosts);
router.get("/singlePost/:id", postController.getPost);
router.delete("/delete/:id", postController.deletePostById);


module.exports = router;