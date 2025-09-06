const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all NGOs (public endpoint)
router.get('/ngos', async (req, res) => {
  try {
    const [ngos] = await db.execute(
      `SELECT id, name, description, city, state, country, website, logo_url, verified, created_at 
       FROM users 
       WHERE user_type = 'ngo' 
       ORDER BY created_at DESC`
    );

    res.json({ ngos });
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.execute(
      'SELECT id, email, user_type, name, phone, address, city, state, country, pincode, description, website, logo_url, verified, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user exists and user is updating their own profile
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    // Build dynamic update query
    const allowedFields = ['name', 'phone', 'address', 'city', 'state', 'country', 'pincode', 'description', 'website', 'logo_url'];
    const updateFields = [];
    const updateValues = [];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updates[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateValues.push(id);

    const query = `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    await db.execute(query, updateValues);

    // Get updated user
    const [updatedUsers] = await db.execute(
      'SELECT id, email, user_type, name, phone, address, city, state, country, pincode, description, website, logo_url, verified, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUsers[0]
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await db.execute('SELECT user_type FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userType = users[0].user_type;
    let stats = {};

    if (userType === 'donor') {
      // Get donor statistics
      const [donationStats] = await db.execute(
        `SELECT 
           COUNT(*) as total_donations,
           SUM(amount) as total_amount,
           AVG(amount) as average_amount,
           COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_donations
         FROM donations 
         WHERE donor_id = ?`,
        [id]
      );
      stats = donationStats[0];
    } else if (userType === 'ngo') {
      // Get NGO statistics
      const [donationStats] = await db.execute(
        `SELECT 
           COUNT(*) as total_donations_received,
           SUM(amount) as total_amount_received,
           AVG(amount) as average_donation
         FROM donations 
         WHERE ngo_id = ? AND status = 'completed'`,
        [id]
      );

      const [requirementStats] = await db.execute(
        `SELECT 
           COUNT(*) as total_requirements,
           COUNT(CASE WHEN status = 'active' THEN 1 END) as active_requirements,
           COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) as fulfilled_requirements
         FROM requirements 
         WHERE ngo_id = ?`,
        [id]
      );

      stats = {
        ...donationStats[0],
        ...requirementStats[0]
      };
    }

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
