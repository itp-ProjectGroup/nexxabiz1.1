import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Simple in-memory notification store (for demo purposes)
// In production, consider using a proper notification system or database
const notifications = [];
let notificationId = 1;

// Function to add a notification
const addNotification = (text) => {
    const notification = {
        id: notificationId++,
        text,
        isRead: false,
        time: new Date().toISOString()
    };
    notifications.push(notification);
    return notification;
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getOrderById = async (req, res) => {
    try {
      const order = await Order.findOne({ od_Id: req.params.id });
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      res.status(500).json({ message: "Server error", error });
    }
};

export const updateOverdueDate = async (req, res) => {
    try {
        const { id } = req.params;
        const { overdue_date } = req.body;

        const order = await Order.findOne({ od_Id: id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        const updatedFields = { overdue_date };
        if (order.pay_status === "New") {
            updatedFields.pay_status = "Pending";
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { od_Id: id },
            updatedFields,
            { new: true }
        );

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Failed to update overdue date", error });
    }
};

export const updateOrderPaymentStatus = async (req, res) => {
    const { orderId } = req.params;
    const { pay_status } = req.body;

    if (!pay_status) {
        return res.status(400).json({ message: "Payment status is required" });
    }

    try {
        const order = await Order.findOne({ od_Id: orderId });

        if (!order) {
            console.error("Order not found for ID:", orderId);
            return res.status(404).json({ message: "Order not found" });
        }

        order.pay_status = pay_status;
        await order.save();

        return res.status(200).json({
            message: "Order payment status updated successfully",
            status: pay_status
        });
    } catch (error) {
        console.error("Error updating order payment status:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message || error.toString()
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order(orderData);

        // Update product quantities and check for low stock
        for (const item of orderData.od_items) {
            const product = await Product.findOne({ manufacturingID: item.manufacturingID });

            if (!product) {
                return res.status(404).json({
                    message: `Product with manufacturingID ${item.manufacturingID} not found`
                });
            }

            if (product.quantity < item.qty) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${product.productName}`
                });
            }

            // Update quantity using findOneAndUpdate to avoid full validation
            const updatedProduct = await Product.findOneAndUpdate(
                { manufacturingID: item.manufacturingID },
                { $inc: { quantity: -item.qty } },
                { new: true }
            );

            // Check for low stock
            if (updatedProduct.quantity <= updatedProduct.lowStockLevel) {
                addNotification(`Low stock alert: ${updatedProduct.productName} (Current: ${updatedProduct.quantity})`);
            }
        }

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findOneAndDelete({ od_Id: id });

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { od_Id: id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};

// New endpoint to get notifications
export const getNotifications = async (req, res) => {
    try {
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
};

// New endpoint to mark notification as read
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = notifications.find(n => n.id === parseInt(id));
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.isRead = true;
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error marking notification as read", error: error.message });
    }
};

// New endpoint to clear all notifications
export const clearNotifications = async (req, res) => {
    try {
        notifications.length = 0;
        res.status(200).json({ message: "Notifications cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing notifications", error: error.message });
    }
};
