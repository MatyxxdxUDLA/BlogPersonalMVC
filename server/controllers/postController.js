import { Post } from '../models/Post.js';

export const postController = {
  create: async (req, res) => {
    try {
      const post = new Post({
        ...req.body,
        author: req.user.id
      });
      await post.save();
      res.json({ success: true, post });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const posts = await Post.find({ author: req.user.id })
        .sort({ createdAt: -1 });
      res.json({ success: true, posts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id, author: req.user.id },
        req.body,
        { new: true }
      );
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
      res.json({ success: true, post });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        author: req.user.id
      });
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
      res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};