const sucessResponse = (res, data, message = "data fetched successfully") => {
  return res.status(200).json({
    status: true,
    message,
    data,
  });
};

const errorResponse = (res, error, message) => {
  return res.status(500).json({
    status: false,
    message: message || "an error occurred",
    error: error.message || "error",
  });
};

const notFoundResponse = (res, message) => {
  return res.status(404).json({
    status: false,
    message: message || "data not found",
  });
};

const sucessfullyCreatedResponse = (res, data) => {
  return res.status(201).json({
    status: true,
    message: "data created successfully",
    data: data,
  });
};

module.exports = {
  sucessResponse,
  errorResponse,
  notFoundResponse,
  sucessfullyCreatedResponse,
};
