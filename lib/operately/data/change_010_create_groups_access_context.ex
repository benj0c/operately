defmodule Operately.Data.Change010CreateGroupsAccessContext do
  import Ecto.Query, only: [from: 2]

  alias Operately.Repo
  alias Operately.Access

  def run do
    Repo.transaction(fn ->
      groups = Repo.all(from g in Operately.Groups.Group, select: g.id)

      Enum.each(groups, fn group_id ->
        case create_group_access_contexts(group_id) do
          {:error, _} -> raise "Failed to create access context"
          _ -> :ok
        end
      end)
    end)
  end

  defp create_group_access_contexts(group_id) do
    Access.create_context(%{group_id: group_id})
  end
end
