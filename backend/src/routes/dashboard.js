import express from 'express';
import { authenticateToken, requirePharmacy } from '../middleware/auth.js';
import { 
  getPharmacyStock, 
  updateStock, 
  getPharmacyOrders, 
  updateOrderStatus,
  updatePrescriptionStatus,
  getPharmacyIdFromUser
} from '../services/dashboardService.js';

export const dashboardRouter = express.Router();

// All routes require authentication and pharmacy role
dashboardRouter.use(authenticateToken);
dashboardRouter.use(requirePharmacy);

// GET /api/dashboard/stock - Get pharmacy stock
dashboardRouter.get('/stock', (req, res) => {
  try {
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy. Please contact support.' 
      });
    }
    
    const stock = getPharmacyStock(pharmacyId);
    res.json(stock);
  } catch (error) {
    console.error('Error getting stock:', error);
    res.status(500).json({ error: 'Failed to get stock', message: error.message });
  }
});

// PUT /api/dashboard/stock/:medicineId - Update stock
dashboardRouter.put('/stock/:medicineId', (req, res) => {
  try {
    const { medicineId } = req.params;
    const { quantity, priceRWF } = req.body;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    if (quantity === undefined || priceRWF === undefined) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Quantity and priceRWF are required' 
      });
    }
    
    const stock = updateStock(pharmacyId, parseInt(medicineId), quantity, priceRWF);
    res.json(stock);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock', message: error.message });
  }
});

// GET /api/dashboard/orders - Get pharmacy orders
dashboardRouter.get('/orders', (req, res) => {
  try {
    const { status } = req.query;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    const orders = getPharmacyOrders(pharmacyId, status || null);
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Failed to get orders', message: error.message });
  }
});

// PUT /api/dashboard/orders/:orderId/status - Update order status
dashboardRouter.put('/orders/:orderId/status', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    if (!status) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Status is required' 
      });
    }
    
    const orders = updateOrderStatus(pharmacyId, orderId, status);
    res.json(orders);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status', message: error.message });
  }
});

// PUT /api/dashboard/orders/:orderId/prescription - Update prescription status
dashboardRouter.put('/orders/:orderId/prescription', (req, res) => {
  try {
    const { orderId } = req.params;
    const { prescriptionStatus } = req.body;
    const pharmacyId = getPharmacyIdFromUser(req.user.userId);
    
    if (!pharmacyId) {
      return res.status(404).json({ 
        error: 'Pharmacy not found', 
        message: 'Your account is not linked to a pharmacy.' 
      });
    }
    
    if (!prescriptionStatus) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Prescription status is required' 
      });
    }
    
    const orders = updatePrescriptionStatus(pharmacyId, orderId, prescriptionStatus);
    res.json(orders);
  } catch (error) {
    console.error('Error updating prescription status:', error);
    res.status(500).json({ error: 'Failed to update prescription status', message: error.message });
  }
});
