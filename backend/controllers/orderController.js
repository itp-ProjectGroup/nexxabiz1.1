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

    console.log("Received request to update payment status.");
    console.log("Order ID from params:", orderId);
    console.log("New payment status from body:", pay_status);

    if (!pay_status) {
        return res.status(400).json({ message: "Payment status is required" });
    }

    try {
        // Debug log to check if orderId is being passed correctly
        console.log("Searching for order with od_Id:", orderId);

        // Make sure 'od_Id' matches the field in your MongoDB documents
        const order = await Order.findOne({ od_Id: orderId });

        if (!order) {
            console.error("Order not found for ID:", orderId);
            return res.status(404).json({ message: "Order not found" });
        }

        // Update and save payment status
        order.pay_status = pay_status;
        await order.save();

        console.log("Order updated successfully:", order);

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

