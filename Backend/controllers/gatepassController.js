const Gatepass = require("../models/gatepass");
const Student = require("../models/student");

const applyGatePass = async (req, res) => {
  const studentId = req.user.id;
  const { reason, outDateTime, returnDateTime } = req.body;

  try {
    const gatePass = await Gatepass.findOne({
       studentId,
      statusGatePass: "pending",
    });

    if (gatePass) {
      return res.status(400).json({
        message:
          "Your GatePass request is pending. You cannot apply for another GatePass.",
      });
    }

    const applyGatepass = await Gatepass.create({
      studentId,
      reason,
      outDateTime,
      returnDateTime,
    });
    res
      .status(200)
      .json({ message: "Apply GatePass Seccessfully", applyGatepass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const myGatePass = async (req, res) => {
  const studentId = req.user.id;
  try {
    const Mygatepass = await Gatepass.find({ studentId });
    res.status(200).json(Mygatepass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const gatePassRequest = async (req, res) => {
  const hostel = req.user.hostel;

  try {
    const gatepasses = await Gatepass.find().populate({
      path: "studentId",
      match: { hostel },
      select: "name email rollNumber phone department course hostel",
    });
    const filteredGatepasses = gatepasses.filter(
      (gp) => gp.studentId !== null
    );
    res.status(200).json(filteredGatepasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGatepassStatus = async(req, res) => {
  const { statusGatePass } = req.body;

  const gatepass = await Gatepass.findByIdAndUpdate(
    req.params.id,
    {statusGatePass},
    { new: true }
  );

  res.status(200).json({
    message: `Gatepass status ${statusGatePass} successfully`,
    gatepass,
  });
}

module.exports = {
  applyGatePass,
  myGatePass,
  gatePassRequest,
  updateGatepassStatus
};
