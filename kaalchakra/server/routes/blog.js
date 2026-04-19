// server/routes/blog.js (updated for UUID)
import express from 'express';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

// Middleware to get user from auth token
const getUserFromToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            req.user = null;
            return next();
        }
        
        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

// Get all blog posts
router.get('/posts', async (req, res) => {
    try {
        const { page = 1, limit = 9, category } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        let query = supabase
            .from('blog_posts')
            .select('*', { count: 'exact' })
            .eq('published', true)
            .order('created_at', { ascending: false });
        
        if (category && category !== 'all') {
            query = query.eq('category', category);
        }
        
        const { data, error, count } = await query
            .range(offset, offset + parseInt(limit) - 1);
        
        if (error) throw error;
        
        // Format posts for frontend
        const posts = data.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            image: post.image_url,
            date: post.created_at,
            readTime: `${Math.ceil((post.content?.length || 1000) / 1000)} min read`,
            category: post.category,
            views: post.views,
            isPremium: post.is_premium,
            author: post.author_name,
            slug: post.slug
        }));
        
        res.json({
            success: true,
            posts,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit))
        });
    } catch (error) {
        console.error('Blog fetch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single blog post
router.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get post
        const { data: post, error: postError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();
        
        if (postError) throw postError;
        
        // Increment view count
        await supabase
            .from('blog_posts')
            .update({ views: (post.views || 0) + 1 })
            .eq('id', id);
        
        res.json({ 
            success: true, 
            post: {
                ...post,
                image: post.image_url,
                readTime: `${Math.ceil((post.content?.length || 1000) / 1000)} min read`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Bookmark functionality (requires user)
router.post('/posts/:id/bookmark', getUserFromToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        const { id } = req.params;
        const userId = req.user.id; // This should be UUID
        
        const { error } = await supabase
            .from('user_bookmarks')
            .insert([{ user_id: userId, post_id: parseInt(id) }]);
        
        if (error) throw error;
        res.json({ success: true, message: 'Bookmarked' });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            res.json({ success: false, message: 'Already bookmarked' });
        } else {
            res.status(500).json({ success: false, message: error.message });
        }
    }
});

router.delete('/posts/:id/bookmark', getUserFromToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        const { id } = req.params;
        const userId = req.user.id;
        
        const { error } = await supabase
            .from('user_bookmarks')
            .delete()
            .eq('user_id', userId)
            .eq('post_id', parseInt(id));
        
        if (error) throw error;
        res.json({ success: true, message: 'Bookmark removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user's bookmarked posts
router.get('/bookmarks', getUserFromToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        const userId = req.user.id;
        
        const { data, error } = await supabase
            .from('user_bookmarks')
            .select('post_id, blog_posts(*)')
            .eq('user_id', userId)
            .eq('blog_posts.published', true);
        
        if (error) throw error;
        
        res.json({ success: true, bookmarks: data.map(b => b.blog_posts) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;