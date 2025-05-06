import Order from "../models/Order.js"; 


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

        // If pay_status is "New", change it to "Pending"
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
            return res.status(404).json({ message: "Order not found" });
        }

        order.pay_status = pay_status;
        await order.save();

        res.status(200).json({ 
            message: "Order payment status updated successfully", 
            status: pay_status 
        });
    } catch (error) {
        console.error("Error updating order payment status:", error);
        res.status(500).json({ message: "Server error", error: error.toString() });
    }
};

export const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order(orderData);
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
