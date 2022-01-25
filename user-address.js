
router.route("/address")
  .get(async (req, res) => {
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      return res.status(200).json({ addresses: user.addresses, success: true, message: "Success" })
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while retrieving addresses", errorMessage: error.message })
    }
  })
  .post(async (req, res) => {
    const { newAddress } = req.body;
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }
      user.addresses.push(newAddress);
      const updatedUser = await user.save();
      const newAddressFromDB = updatedUser.addresses.find((item) => item.phoneNumber === newAddress.phoneNumber);
      return res.status(201).json({ address: newAddressFromDB, success: true, message: "Successful" });
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while adding address", errorMessage: error.message })
    }
  })