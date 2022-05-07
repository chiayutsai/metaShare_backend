const resErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      message: error.message,
    })
  } else {
    console.error('出現重大錯誤', error)
    res.status(500).json({
      status: false,
      message: '系統錯誤，請洽系統管理員',
    })
  }
}

const resErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: false,
    message: error.message,
    error: error,
    stack: error.stack,
  })
}

module.exports = { resErrorProd, resErrorDev }
