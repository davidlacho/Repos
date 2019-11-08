defmodule Repos.SearchChannel do
  use Repos.Web, :channel
  def join(_name, _auth_msg, socket) do
    {:ok, %{hey: "there"}, socket}
  end

  def handle_in(_, %{"username" => username}, socket) do
    # %{"data" => %{"user" => %{"following" => %{"edges" => following},"issues" => %{"edges" => issues},"pinnedRepositories" => %{"edges" => pinned_repositories}, "pullRequests" => %{"edges" => pull_requests}, "watching" => %{"edges" => watching}}}} = Repos.Worker.get_user(username)
    # IO.inspect(following)
    # IO.inspect(Enum.count(issues))
    # IO.inspect(pinned_repositories)
    # IO.inspect(Enum.count(pull_requests))
    # IO.inspect(watching)
    broadcast!(socket, "search:1:result", Repos.Worker.get_user(username))
    {:reply, :ok, socket}
  end

end
