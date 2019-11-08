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

  const profileDiv = document.getElementById("profile");
  const followDiv = document.getElementById("follow");
  const watchDiv = document.getElementById("watch");
  const pinDiv = document.getElementById("pinned");

  profileDiv.innerHTML = '';
  followDiv.innerHTML = '';
  watchDiv.innerHTML = '';
  pinDiv.innerHTML = '';

  if (resp.data.user) {
      const issueCount = resp.data.user.issues.edges.length || 0;
      const pullRequestCount = resp.data.user.pullRequests.edges.length || 0;
      const userAvatar = resp.data.user.avatarUrl;
      const userLogin = resp.data.user.login;
      const userName = resp.data.user.name;
      const userUrl = resp.data.user.url;

      profileDiv.innerHTML = renderCard(userAvatar, userLogin, userName, userUrl, issueCount, pullRequestCount)


    if (resp.data.user.following.edges && resp.data.user.following.edges.length > 0) {
      const html = renderFollowingHtml(resp.data.user.following.edges);
      followDiv.innerHTML = html;
    }

    if (resp.data.user.pinnedRepositories.edges && resp.data.user.pinnedRepositories.edges.length > 0) {
      const html = renderRepositories(resp.data.user.pinnedRepositories.edges);
      pinDiv.innerHTML = '<h3 class="ui dividing header">Pinned Repositories</h3>' + html;
  }

    if (resp.data.user.watching.edges && resp.data.user.watching.edges.length > 0) {
        const html = renderRepositories(resp.data.user.watching.edges);
        watchDiv.innerHTML = '<h3 class="ui dividing header">Watched Repositories</h3>'+ html;
    }

  } else {
    profileDiv.innerHTML = "<h3>User not found.</h3>"
  }
})

const renderRepositories = watching => {
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
  let html = '<h3 class="ui dividing header">Following</h3>';
  follow.forEach(w => {
  html +=
  `<div class="comment">
  <a class="avatar">
    <img src="${w.node.avatarUrl}">
  </a>
  <div class="content">
    <a class="author">${w.node.login}</a>
  </div>
</div>`
  });
  return html;
}

const renderCard = (userAvatar, userLogin, userName, userUrl, issueCount, pullRequestCount) => {
return `
<h3 class="ui dividing header">${userLogin}'s Profile</h3>
<div class="ui items">
  <div class="item">
    <a class="ui small image">
      <img src="${userAvatar}">
    </a>
    <div class="content">
      <a class="header" href="${userUrl}">github.com/${userLogin}</a>
      <div class="description">
        <h4>${userName}</h4>
        <h6>Pull Requests: ${pullRequestCount}</h6>
        <h6>Issues: ${issueCount}</h6>
      </div>
    </div>
  </div>
</div>
`

}


export default socket
