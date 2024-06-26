defmodule Operately.Activities.Recorder do
  use Oban.Worker
  require Logger

  alias Ecto.Multi
  alias Operately.Activities.Activity
  alias Operately.Repo

  def perform(job) do
    action = job.args["action"]
    author_id = job.args["author_id"]
    params = job.args["params"]

    {:ok, content} = build_content(action, params)

    Multi.new()
    |> Multi.insert(:activity, Activity.changeset(%{
      author_id: author_id, 
      action: action, 
      content: content 
    }))
    |> Multi.run(:notifications, fn _, changes -> schedule_notifications(changes.activity) end)
    |> Repo.transaction()
  rescue
    err -> Logger.error(Exception.format(:error, err, __STACKTRACE__))
  end

  def schedule_notifications(activity) do
    module = find_module("Operately.Activities.Notifications", activity.action)
    apply(module, :dispatch, [activity])
  end

  def build_content(action, params) do
    module = find_module("Operately.Activities.Content", action)
    changeset = module.changeset(params)

    if changeset.valid? do
      fields = module.__schema__(:fields)
      content = Ecto.Changeset.apply_changes(changeset)

      {:ok, Map.take(content, fields)}
    else
      {:error, changeset}
    end
  end

  defp find_module(base, action) when is_atom(action) do
    find_module(base, Atom.to_string(action))
  end

  defp find_module(base, action) when is_binary(action) do
    full_module_name = "Elixir.#{base}.#{Macro.camelize(action)}"
    String.to_existing_atom(full_module_name)
  end
end
