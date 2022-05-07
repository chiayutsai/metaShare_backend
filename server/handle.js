const successHandle = (res, data, message) => {
  res.status(200).json({
    status: 'success',
    data,
    message,
  })
}

module.exports = successHandle
