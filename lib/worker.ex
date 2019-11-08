defmodule Repos.Worker do
  use GenServer

  ## Client API

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  def reset_stats(pid) do
    GenServer.cast(pid, :reset_stats)
  end

  def get_user(pid, user) do
    GenServer.call(pid, {:user, user})
  end

  def get_stats(pid) do
    GenServer.call(pid, :get_stats)
  end

  def stop(pid) do
    GenServer.cast(pid, :stop)
  end

  ## Server API

  # handle_calls go here

  def handle_call({:user, user}, _from, stats) do
    case info_for(user) do
      {:ok, json} ->
        new_stats = update_stats(stats, user)
        {:reply, json, new_stats}
_ ->
        {:reply, :error, stats}
    end
  end

  def handle_call(:get_stats, _from, stats) do
    {:reply, stats, stats}
  end

  def handle_cast(:reset_stats, _stats) do
    {:noreply, %{}}
  end

  def handle_cast(:stop, stats) do
    {:stop, :normal, stats}
  end

  ## Server Callbacks

  def init(:ok) do
    {:ok, %{}}
  end

  defp query(user) do
    "{
      user(login: \"#{user}\") {
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

  defp update_stats(old_stats, user) do
    case Map.has_key?(old_stats, user) do
      true ->
        Map.update!(old_stats, user, &(&1 + 1))
      false ->
        Map.put_new(old_stats, user, 1)
    end
  end


  def terminate(reason, stats) do
    # We could write to a file, database etc
    IO.puts "server terminated because of #{inspect reason}"
       inspect stats
    :ok
  end

  def apiKey do
    ""
  end


end
