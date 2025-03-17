import User from "../models/User.js";

// Register user
export const registerUser = async (req, res) => {
    try {
        const { 
            u_fullName,
            u_pEmail,
            u_pPhone,
            u_p1stLine,
            u_p2ndLine,
            u_pCity,
            u_pCountry,
            u_pZip,
            u_dob,
            u_gender,
            u_companyName,
            u_businessRegNumber,
            u_cEmail,
            u_cPhone,
            u_c1stLine,
            u_c2ndLine,
            u_cCity,
            u_cCountry,
            u_cZip,
            username,
            password,
            confirmPassword,
            securityQuestion,
            securityAnswer,
        } = req.body;


        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Password and Confirm Password do not match' });
        }

        // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ u_pEmail }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      u_fullName,
      u_pEmail,
      u_pPhone,
      u_p1stLine,
      u_p2ndLine,
      u_pCity,
      u_pCountry,
      u_pZip,
      u_dob,
      u_gender,
      u_companyName,
      u_businessRegNumber,
      u_cEmail,
      u_cPhone,
      u_c1stLine,
      u_c2ndLine,
      u_cCity,
      u_cCountry,
      u_cZip,
      username,
      password: hashedPassword, // Save the hashed password
      securityQuestion,
      securityAnswer,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
