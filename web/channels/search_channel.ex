defmodule Repos.SearchChannel do
  use Repos.Web, :channel
  def join(name, _auth_msg, socket) do
    IO.puts("+++++++++")
    IO.puts(name)
    {:ok, %{hey: "there"}, socket}
  end

  def handle_in(name, message, socket) do
    IO.puts("====")
    IO.puts(name)
    IO.inspect(message)
    IO.puts("====")
    {:reply, :ok, socket}
  end

end
