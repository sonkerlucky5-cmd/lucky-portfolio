import defaultProfile from "../data/defaultProfile.json" with { type: "json" };

export const getProfileInfo = (req, res) => {
  res.status(200).json({
    success: true,
    data: defaultProfile,
  });
};

