import Return from '../models/Return.js';

// Get all returns
export const getReturns = async (req, res) => {
  try {
    const returns = await Return.find().sort({ createdAt: -1 });
    res.status(200).json(returns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching returns', error: error.message });
  }
};

// Get return by ret_Id
export const getReturnByID = async (req, res) => {
  const { id } = req.params;
  try {
    const ret = await Return.findOne({ ret_Id: id });
    if (!ret) {
      return res.status(404).json({ message: `Return with ID ${id} not found` });
    }
    res.status(200).json(ret);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching return', error: error.message });
  }
};
