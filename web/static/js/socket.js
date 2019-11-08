import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("search:1", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

  document.querySelector('button').addEventListener('click', ()=> {
    let username = document.getElementById('username').value;
    channel.push('search', { username: `${username}` })
    document.getElementById('username').value = '';
  });
  

export default socket
