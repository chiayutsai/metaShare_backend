const successHandle = (res,data,message)=> {
  res.status(200).json({
    status:'success',
    data,
    message
  });
}

const errorHandle = (res,error,message) => {
  res.status(400).json({
    status:'false',
    error,
    message
  });
}

module.exports = {successHandle, errorHandle}