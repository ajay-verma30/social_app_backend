const pool = require("../../db/conn");

const createPost = async (data) => { 
    const { created_by, title, content } = data;
    
    if(!created_by || !title || !content){
        throw new Error("All details are mandatory!");
    }

    try {
        const addPostQuery = `
            INSERT INTO socializer.posts (created_by, title, content)
            VALUES ($1, $2, $3)
            RETURNING *; 
        `;

        const { rows } = await pool.query(addPostQuery, [
            created_by,
            title,
            content
        ]);

        return rows[0];
    }
    catch (err) {
        if (err.message.includes("exists") || err.message.includes("mandatory")) {
            throw err;
        }
        console.error("Database Error:", err.message);
        throw new Error("Internal Server Error!");
    }
}

// Function ka naam getPosts (plural) kar diya taaki samajhne mein aasan ho
const getPosts = async () => { 
    try {
        const allPostsQuery = `
            SELECT * FROM socializer.posts 
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(allPostsQuery);
        
        if (result.rows.length === 0) {
            throw new Error("No Posts Available as of now!");
        }
        return result.rows; 
        
    } catch (err) {
        if (err.message.includes("Available")) {
            throw err;
        }
        
        console.error("Database Error:", err.message);
        throw new Error("Internal Server Error!"); 
    }
}


module.exports = { createPost, getPosts }; 