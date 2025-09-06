const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a new donation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { ngo_id, amount, currency, payment_method, transaction_id, message, anonymous } = req.body;
    const donor_id = req.user.id;

    // Validate required fields
    if (!ngo_id || !amount) {
      return res.status(400).json({ error: 'NGO ID and amount are required' });
    }

    // Check if NGO exists
    const [ngos] = await db.execute(
      'SELECT id FROM users WHERE id = ? AND user_type = "ngo"',
      [ngo_id]
    );

    if (ngos.length === 0) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    // Generate donation ID
    const donationId = uuidv4();

    // Insert donation
    await db.execute(
      `INSERT INTO donations (id, donor_id, ngo_id, amount, currency, payment_method, transaction_id, status, message, anonymous) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        donationId,
        donor_id,
        ngo_id,
        amount,
        currency || 'INR',
        payment_method || null,
        transaction_id || null,
        'pending',
        message || null,
        anonymous || false
      ]
    );

    // Get the created donation with user details
    const [newDonations] = await db.execute(
      `SELECT d.*, 
              donor.name as donor_name, 
              ngo.name as ngo_name
       FROM donations d
       JOIN users donor ON d.donor_id = donor.id
       JOIN users ngo ON d.ngo_id = ngo.id
       WHERE d.id = ?`,
      [donationId]
    );

    res.status(201).json({
      message: 'Donation created successfully',
      donation: newDonations[0]
    });

  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get donations by donor
router.get('/donor/:donorId', authenticateToken, async (req, res) => {
  try {
    const { donorId } = req.params;

    // Check if user can access these donations
    if (req.user.id !== donorId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [donations] = await db.execute(
      `SELECT d.*, 
              ngo.name as ngo_name, 
              ngo.description as ngo_description
       FROM donations d
       JOIN users ngo ON d.ngo_id = ngo.id
       WHERE d.donor_id = ?
       ORDER BY d.created_at DESC`,
      [donorId]
    );

    res.json({ donations });
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get donations by NGO
router.get('/ngo/:ngoId', authenticateToken, async (req, res) => {
  try {
    const { ngoId } = req.params;

    // Check if user can access these donations (NGO owner or donor)
    const [ngos] = await db.execute(
      'SELECT id FROM users WHERE id = ? AND user_type = "ngo"',
      [ngoId]
    );

    if (ngos.length === 0) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    const [donations] = await db.execute(
      `SELECT d.*, 
              donor.name as donor_name,
              CASE WHEN d.anonymous = 1 THEN 'Anonymous' ELSE donor.name END as display_name
       FROM donations d
       JOIN users donor ON d.donor_id = donor.id
       WHERE d.ngo_id = ?
       ORDER BY d.created_at DESC`,
      [ngoId]
    );

    res.json({ donations });
  } catch (error) {
    console.error('Error fetching NGO donations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all donations (admin or for public display)
router.get('/', async (req, res) => {
  try {
    const [donations] = await db.execute(
      `SELECT d.*, 
              donor.name as donor_name,
              ngo.name as ngo_name,
              CASE WHEN d.anonymous = 1 THEN 'Anonymous' ELSE donor.name END as display_name
       FROM donations d
       JOIN users donor ON d.donor_id = donor.id
       JOIN users ngo ON d.ngo_id = ngo.id
       WHERE d.status = 'completed'
       ORDER BY d.created_at DESC
       LIMIT 50`
    );

    res.json({ donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update donation status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if donation exists and user has permission to update
    const [donations] = await db.execute(
      'SELECT donor_id, ngo_id FROM donations WHERE id = ?',
      [id]
    );

    if (donations.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const donation = donations[0];
    
    // Only donor or NGO can update status
    if (req.user.id !== donation.donor_id && req.user.id !== donation.ngo_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update donation status
    await db.execute(
      'UPDATE donations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Donation status updated successfully' });
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get donation by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [donations] = await db.execute(
      `SELECT d.*, 
              donor.name as donor_name,
              ngo.name as ngo_name
       FROM donations d
       JOIN users donor ON d.donor_id = donor.id
       JOIN users ngo ON d.ngo_id = ngo.id
       WHERE d.id = ?`,
      [id]
    );

    if (donations.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const donation = donations[0];

    // Check if user can access this donation
    if (req.user.id !== donation.donor_id && req.user.id !== donation.ngo_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ donation });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
