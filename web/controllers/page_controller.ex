defmodule Repos.PageController do
  use Repos.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
