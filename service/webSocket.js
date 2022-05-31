const SocketServer = require('ws').Server
const jwt = require('jsonwebtoken')
const Channel = require('../models/ChannelModel')

const CMD_CODE = {
  // ACTION
  WEB_SOCKET_LOGIN_REQUEST: '00',
  WEB_SOCKET_LOGIN_RESPONSE: '01',

  GET_CHANNEL_HISTORY_REQUEST: '40',
  GET_CHANNEL_HISTORY_RESPONSE: '41',

  SEND_CHAT_MESSAGE_REQUEST: '10',
  SEND_CHAT_MESSAGE_RESPONSE: '11',
  // BC
  CHAT_MESSAGE_NOTIFY: '20',
  USER_LOGIN_NOTIFY: '30',
  USER_LOGOUT_NOTIFY: '31',
  USER_LIKES_POST: '50',
  USER_COMMENT_POST: '60',
}

class WebSocketService {
  #connections = {
    // [userId]: ws
  }

  #MAPPER = null

  constructor() {
    this.#MAPPER = {
      RESPONSE_CODE: {
        [CMD_CODE.WEB_SOCKET_LOGIN_REQUEST]: CMD_CODE.WEB_SOCKET_LOGIN_RESPONSE,
        [CMD_CODE.GET_CHANNEL_HISTORY_REQUEST]: CMD_CODE.GET_CHANNEL_HISTORY_RESPONSE,
        [CMD_CODE.SEND_CHAT_MESSAGE_REQUEST]: CMD_CODE.SEND_CHAT_MESSAGE_RESPONSE,
      },
      MIDDLEWARE: {
        [CMD_CODE.WEB_SOCKET_LOGIN_REQUEST]: this.#handleWebSocketLoginRequest,
        [CMD_CODE.SEND_CHAT_MESSAGE_REQUEST]: this.#handleSendChatMessageRequest,
        [CMD_CODE.GET_CHANNEL_HISTORY_REQUEST]: this.#handleGetChannelHistoryRequest,
      }
    }
  }

  create = (server) => {
    this.wss = new SocketServer({ server, path: '/websocket' })

    this.wss.on('connection', (ws) => {
      console.log('Client connected')

      // 當收到 client 消息時
      ws.on('message', async (text) => {
        this.#onMessage(ws, text)
      })

      // 當連線關閉
      ws.on('close', () => {
        this.#onClose(ws)
      })
    })
  }
  
  // message handler
  #handleWebSocketLoginRequest = async (ws, data, decoded) => {
    // 加到連線列表中
    this.#connections[decoded.id] = ws
  
    // 回應成功
    this.#send(ws, CMD_CODE.WEB_SOCKET_LOGIN_RESPONSE, { message: '連線成功', online: Object.keys(this.#connections) })
  
    // 廣播上線通知
    this.broadcast(CMD_CODE.USER_LOGIN_NOTIFY, {
      userId: decoded.id,
    })
  }

  #handleSendChatMessageRequest = async (ws, data) => {
    const { from, to, message } = data
    await Channel.findOneAndUpdate(
      { $and: [{ user: { $in: to } }, { user: { $in: from } }] },
      { $push: { messages: { from, message } } },
      { returnDocument: 'after' }
    )

    // 回應成功
    this.#send(ws, CMD_CODE.SEND_CHAT_MESSAGE_RESPONSE, { from, to, message, createAt: Date.now() })

    // 傳訊息給對方
    this.sendToUser(to, CMD_CODE.CHAT_MESSAGE_NOTIFY, { from, to, message, createAt: Date.now() })
  }

  #handleGetChannelHistoryRequest = async (ws, data) => {
    const { to, userId } = data
    let channel = await Channel.findOne({ $and: [{ user: { $in: to } }, { user: { $in: userId } }] })

    if (!channel) {
      channel = await Channel.create({ user: [to, userId] })
    }

    // 回應成功
    this.#send(ws, CMD_CODE.GET_CHANNEL_HISTORY_RESPONSE, { channel, channelId: to })
  }
  
  #isAuth = async (token) =>
    await jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        throw err
      } else {
        return payload
      }
    })

  // connection handler
  #onMessage = async (ws, text) => {
    const data = JSON.parse(text)

    console.log('message: ', data)
    
    const { commandCode, token } = data
  
    try {
      const decoded = await this.#isAuth(token)
      this.#MAPPER.MIDDLEWARE[commandCode]?.(ws, data, decoded)
    } catch (err) {
      const responseCode = this.#MAPPER.RESPONSE_CODE[commandCode]
      // 回應失敗
      this.#send(ws, responseCode, { message: '認證失敗' })
    }
  }

  #onClose = (ws) => {
    console.log('Close connected')

    // 重連線列表中移除, 並且廣播下線訊息
    Object.entries(this.#connections).forEach(([userId, wsInstance]) => {
      if (wsInstance === ws) {
        delete this.#connections[userId]

        this.broadcast(CMD_CODE.USER_LOGOUT_NOTIFY, {
          userId,
        })
      }
    })
  }

  #send = (client, code, data) => {
    client?.send(
      JSON.stringify({
        commandCode: code,
        ...data,
      })
    )
  }

  // 傳輸方法
  sendToUser = (userId, code, data) => this.#send(this.#connections[userId], code, data)

  broadcast = (code, data) => {
    this.wss.clients.forEach((client) => {
      this.#send(client, code, data)
    })
  }
}

const webSocketService = new WebSocketService()

module.exports = { webSocketService, CMD_CODE }
