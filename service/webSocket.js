const SocketServer = require('ws').Server
const jwt = require('jsonwebtoken')

const createWebsocket = (server) => {
  const wss = new SocketServer({ server })
  let conns = {}
  wss.on('connection', (ws) => {
    console.log('Client connected')
    // 當收到client消息時
    ws.on('message', async (data) => {
      // 收回來是 Buffer 格式、需轉成字串
      console.log(JSON.parse(data))
      const { commandCode } = JSON.parse(data)
      if (commandCode == '00') {
        const { token } = JSON.parse(data)
        try {
          const decoded = await jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
              throw err
            } else {
              return payload
            }
          })
          conns[decoded.id] = ws
          ws.send(
            JSON.stringify({
              commandCode: '01',
              message: '連線成功',
              online: Object.keys(conns),
            })
          )

          // 廣播上線通知
          wss.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                commandCode: '30',
                userId: decoded.id,
              })
            )
          })
        } catch (err) {
          ws.send(
            JSON.stringify({
              commandCode: '01',
              message: '連線失敗',
            })
          )
        }
      }
      if (commandCode == '10') {
        const { from, to, message } = JSON.parse(data)
        ws.send(
          JSON.stringify({
            commandCode: '11',
            from,
            to,
            message,
            createAt: Date.now(),
          })
        )
        conns[to]?.send(
          JSON.stringify({
            commandCode: '20',
            from,
            to,
            message,
            createAt: Date.now(),
          })
        )
      }
    })
    // 當連線關閉
    ws.on('close', () => {
      const objArray = Object.entries(conns)
      objArray.forEach((item) => {
        if (item[1] === ws) {
          delete conns[item[0]]

          wss.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                commandCode: '31',
                userId: item[0],
              })
            )
          })
        }
      })
      console.log('Close connected')
    })
  })
}

module.exports = createWebsocket
