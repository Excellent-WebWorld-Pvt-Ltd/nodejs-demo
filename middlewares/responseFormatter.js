const responseFormatter = (req, res, next) => {
  res.success = (data = {}, message = 'Success') => {
    res.status(200).json({
      status: true,
      message,
      data
    });
  };

  res.status(200).error = (message = 'Error') => {
    res.json({
      status: false,
      message
    });
  };

  next();
};

module.exports = responseFormatter;
