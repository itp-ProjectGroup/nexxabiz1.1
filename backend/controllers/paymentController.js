import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

// Controller function to handle payment creation
export const createPayment = async (req, res) => {
    const { paymentId, orderId, paymentAmount, paymentMethod, remark } = req.body;

    // Validate the incoming data
    if (!paymentId || !orderId || !paymentAmount || !paymentMethod) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Create a new payment document using the provided data
        const newPayment = new Payment({
            paymentId,
            orderId,
            paymentAmount,
            paymentMethod,
            remark,
        });

        // Save the payment to the database
        await newPayment.save();

        // Respond with success
        res.status(201).json({ message: "Payment successful", paymentId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const updatePayment = async (req, res) => {
    const { paymentMethod, paymentAmount, remark, createdAt } = req.body;
    const { paymentId } = req.params;

    try {
        const updated = await Payment.findOneAndUpdate(
            { paymentId },
            { paymentMethod, paymentAmount, remark, createdAt },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Payment not found" });

        res.status(200).json({ message: "Payment updated", payment: updated });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

export const deletePayment = async (req, res) => {
    const { paymentId } = req.params;

    try {
        // Step 1: Find and delete the payment
        const deleted = await Payment.findOneAndDelete({ paymentId });
        if (!deleted) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // Step 2: Update the related order's pay_status to 'Pending'
        const updatedOrder = await Order.findOneAndUpdate(
            { od_Id: deleted.orderId },
            { pay_status: "Pending" },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Related order not found" });
        }

        res.status(200).json({ message: "Payment deleted, order status updated", updatedOrder });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

