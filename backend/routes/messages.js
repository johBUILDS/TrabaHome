import express from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST: Start a conversation / Send first message
router.post('/start', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { workerId, requestId, initialMessage } = req.body;

    if (!workerId || !initialMessage) {
      return res.status(400).json({ message: 'Worker ID and initial message are required' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      homeownerId,
      workerId
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        homeownerId,
        workerId,
        requestId: requestId || null,
        messageCount: 0
      });
      await conversation.save();
    }

    // Send initial message
    const message = new Message({
      conversationId: conversation._id,
      senderId: homeownerId,
      senderType: 'homeowner',
      recipientId: workerId,
      content: initialMessage
    });
    await message.save();

    // Update conversation
    conversation.lastMessage = {
      content: initialMessage,
      senderId: homeownerId,
      createdAt: new Date()
    };
    conversation.messageCount += 1;
    conversation.workerUnread = (conversation.unreadCount.workerUnread || 0) + 1;
    await conversation.save();

    res.status(201).json({
      message: 'Conversation started',
      conversation,
      firstMessage: message
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST: Send message in conversation
router.post('/:conversationId/send', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Determine sender type and recipient
    let senderType, recipientId;
    if (conversation.homeownerId.toString() === senderId) {
      senderType = 'homeowner';
      recipientId = conversation.workerId;
    } else if (conversation.workerId.toString() === senderId) {
      senderType = 'worker';
      recipientId = conversation.homeownerId;
    } else {
      return res.status(403).json({ message: 'Not authorized in this conversation' });
    }

    // Create message
    const message = new Message({
      conversationId,
      senderId,
      senderType,
      recipientId,
      content
    });
    await message.save();

    // Update conversation
    conversation.lastMessage = {
      content,
      senderId,
      createdAt: new Date()
    };
    conversation.messageCount += 1;
    conversation.updatedAt = new Date();

    if (senderType === 'homeowner') {
      conversation.unreadCount.workerUnread = (conversation.unreadCount.workerUnread || 0) + 1;
    } else {
      conversation.unreadCount.homeownerUnread = (conversation.unreadCount.homeownerUnread || 0) + 1;
    }

    await conversation.save();

    res.status(201).json({
      message: 'Message sent',
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get all conversations for user (homeowner)
router.get('/homeowner/conversations', auth, async (req, res) => {
  try {
    const homeownerId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const conversations = await Conversation.find({ homeownerId })
      .populate('workerId', 'firstName lastName profileImage specialization averageRating')
      .populate('requestId', 'title service')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Conversation.countDocuments({ homeownerId });

    res.status(200).json({
      conversations,
      totalConversations: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get conversation messages
router.get('/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 30 } = req.query;
    const userId = req.user.id;

    // Verify user is in conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (conversation.homeownerId.toString() !== userId && conversation.workerId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ conversationId });

    // Mark messages as read for current user
    await Message.updateMany(
      { conversationId, recipientId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Update unread count in conversation
    if (conversation.homeownerId.toString() === userId) {
      conversation.unreadCount.homeownerUnread = 0;
    } else {
      conversation.unreadCount.workerUnread = 0;
    }
    await conversation.save();

    res.status(200).json({
      conversationId,
      messages,
      totalMessages: total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get conversation details
router.get('/:conversationId/details', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('homeownerId', 'firstName lastName profileImage')
      .populate('workerId', 'firstName lastName profileImage specialization')
      .populate('requestId', 'title service');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Mark conversation as read
router.put('/:conversationId/mark-read', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (conversation.homeownerId.toString() === userId) {
      conversation.unreadCount.homeownerUnread = 0;
    } else {
      conversation.unreadCount.workerUnread = 0;
    }

    await conversation.save();

    res.status(200).json({ message: 'Marked as read', conversation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Close conversation
router.delete('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (conversation.homeownerId.toString() !== req.user.id && conversation.workerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    conversation.isActive = false;
    await conversation.save();

    res.status(200).json({ message: 'Conversation closed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
