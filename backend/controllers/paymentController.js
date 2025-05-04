import Payment from "../models/Payment.js";

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

