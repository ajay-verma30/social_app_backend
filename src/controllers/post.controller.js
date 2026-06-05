const postService = require('../services/post.services'); // Apne service ka path theek kar lena

const postCreation = async (req, res) => {
    try {
        const { title, content } = req.body;
        const created_by = req.user.id; 
        const newPost = await postService.createPost({
            created_by,
            title,
            content
        });

        res.status(201).json({
            success: true,
            message: "Post created successfully!",
            post: newPost
        });

    } catch (error) {
        const statusCode = error.message.includes("mandatory") ? 400 : 500;
        
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};


const fetchPosts = async (req, res) => {
    try {
        const postsList = await postService.getPosts();
        
        res.status(200).json({
            success: true,
            posts: postsList
        });
        
    } catch (error) {
        // FIX: Ab hum "Available" check kar rahe hain (Jo service se aayega)
        // Agar posts nahi hain toh 404 (Not Found), warna 500 (Server Error)
        const statusCode = error.message.includes("Available") ? 404 : 500;
        
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { postCreation, fetchPosts };