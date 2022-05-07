const handleErrorAsync = (func) => {
  return (req, res, next) => {
    //async 可再用 catch 統一捕捉
    func(req, res, next).catch((error) => {
      return next(error)
    })
  }
}

module.exports = handleErrorAsync
