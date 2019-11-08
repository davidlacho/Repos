defmodule Repos.Worker do
  use GenServer

  def start_link(_default) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def init(args) do
    {:ok, args}
  end

  def get_user(user) do
    GenServer.call(__MODULE__, {:user, user})
  end

  def handle_call({:user, user}, _from, state) do
    case info_for(user) do
      {:ok, json} ->
        {:reply, json, state}
      _ ->
        {:reply, :error, state}
    end
  end

  defp query(user) do
    "{
      user(login: \"#{user}\") {
        name,
        login,
        avatarUrl,
        following(first: 100) {
          edges {
            node {
              login
              avatarUrl
              url
            }
          }
        }
        watching(first: 100) {
          edges {
            node {
              id
              name
              url
              description
            }
          }
        }
        issues(first: 100) {
          edges {
            node {
              id
            }
          }
        }
        pullRequests(first: 100) {
          edges {
            node {
              id
            }
          }
        }
        pinnedRepositories(first: 6) {
          edges {
            node {
              id
              name
              url
              description
            }
          }
        }
      }
    }

    "
  end

  defp info_for(user) do
    HTTPoison.post("https://api.github.com/graphql",
    Poison.encode!(%{"query" => query(user)}),
    [{"Authorization", "bearer #{apiKey()}"}, {"Content-Type", "application/json"}])
    |> parse_response
  end


  defp parse_response({:ok, %HTTPoison.Response{body: body, status_code: 200}}) do
    body
    |> JSON.decode!
    |> compute_query
  end

  defp parse_response(_) do
    :error
  end

  defp compute_query(json) do
    try do
      {:ok, json}
    rescue
      _ -> :error
    end
  end

  defp apiKey do
    "f1cec5b61bdcee36a80fe2c0f2e726eb23ff63a1"
  end


end
