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
  
channel.on("search:1:result", (resp) => {
  if (resp.data.user) {
      const issueCount = resp.data.user.issues.edges.length || 0;
      const pullRequestCount = resp.data.user.pullRequests.edges.length || 0

    if (resp.data.user.following.edges && resp.data.user.following.edges.length > 0) {
      const html = renderFollowingHtml(resp.data.user.following.edges);
      console.log(html);
      const followDiv = document.getElementById("follow");
      followDiv.innerHTML = '';
      followDiv.innerHTML = html;
    }

    // if (resp.data.user.pinnedRepositories.edges && resp.data.user.pinnedRepositories.edges.length > 0) {
    //   resp.data.user.pinnedRepositories.edges.forEach(node => {
    //     console.log(node)
    //   });
    // }

    if (resp.data.user.watching.edges && resp.data.user.watching.edges.length > 0) {
        const html = renderWatchingHtml(resp.data.user.watching.edges);
        const watchDiv = document.getElementById("watch");
        watchDiv.innerHTML = '';
        watchDiv.innerHTML = html;
    }

  }
})

const renderWatchingHtml = watching => {
  let html = '';
  watching.forEach(w => {
    html += 
    `<div class="item"><i class="large github middle aligned icon"></i>
    <div class="content"><a class="header" href="${w.node.url}">${w.node.name}</a>
    <div class="description">${w.node.description}</div></div></div>`;
  });
  return html;
}

const renderFollowingHtml = follow => {
  let html = '';
  follow.forEach(w => {
    console.log(w);
    html +=
    // `<div class="card"><div class="image"><img src="${w.node.avatarUrl}"></div></div>`;
    `<div class="column">
    <div class="ui fluid card">
        <img class="ui small rounded image" src="${w.node.avatarUrl}">
      <div class="content">
        <a href="${w.node.url}">${w.node.login}</a>
      </div>
    </div>
  </div>`
  });
  return html;
}

const renderCard = (issueCount, pullRequests) => {
  return `<div class="card">
  <div class="image">
    <img src="/images/avatar2/large/matthew.png">
  </div>
  <div class="content">
    <div class="header">Matt Giampietro</div>
    <div class="meta">
      <a>Friends</a>
    </div>
    <div class="description">
      Matthew is an interior designer living in New York.
    </div>
  </div>
  <div class="extra content">
    <span class="right floated">
      ${issueCount} issues.
    </span>
    <span>
      <i class="user icon"></i>
      ${pullRequestCount} pull requests.
    </span>
  </div>
</div>`

}


export default socket
