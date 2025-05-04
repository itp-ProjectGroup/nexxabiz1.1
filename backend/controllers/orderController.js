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


