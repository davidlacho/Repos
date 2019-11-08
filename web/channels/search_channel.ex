defmodule Repos.SearchChannel do
  use Repos.Web, :channel
  def join(_name, _auth_msg, socket) do
    {:ok, %{hey: "there"}, socket}
  end

  def handle_in(_, %{"username" => username}, socket) do
    broadcast!(socket, "search:1:result", Repos.Worker.get_user(username))
    {:reply, :ok, socket}
  end

end
