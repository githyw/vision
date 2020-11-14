export default class SocketService{

  static instanct = null
  static get Instance(){
    if(!this.instanct){
      this.instanct = new SocketService()
    }
    return this.instanct
  }

  ws = null
  callBackMapping = {}
  connected = false
  sendRetryCount = 0
  connectRetryCount = 0

  connect(){
    if(!window.WebSocket){
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://42.192.16.209:9998/back')

    this.ws.onopen = () =>{
      this.connectRetryCount = 0
      console.log('连接服务器成功')
      this.connected = true
    }
    this.ws.onclose = () =>{
      this.connected = false
      console.log('连接服务器失败')
      this.connectRetryCount++
      setTimeout(()=>{
        this.connect()
      },this.connectRetryCount * 500)
    }
    this.ws.onmessage = msg =>{
      console.log('从服务器获得数据')
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      if(this.callBackMapping[socketType]){
        const action = recvData.action
        if(action === 'getData'){
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        }else if(action ==='fullScreen'){
          this.callBackMapping[socketType].call(this, recvData)
        }else if(action ==='themeChange'){

        }
      }
    }
  }
  registerCallBack ( socketType,callBack ){
    this.callBackMapping[socketType] = callBack
  }
  unRegisterCallBack(socketType){
    this.callBackMapping[socketType] = null
  }
  send(data){
    this.sendRetryCount = 0
    if(this.connected){
      this.ws.send(JSON.stringify(data))
    }else{
      this.sendRetryCount++
      setTimeout(()=>{
        this.send(data)
      },this.sendRetryCount * 500)
    }
  }
}