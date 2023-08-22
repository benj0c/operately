defmodule OperatelyWeb.GraphQL.Types.Updates do
  use Absinthe.Schema.Notation

  object :update do
    field :id, non_null(:id)
    field :title, :string
    field :inserted_at, non_null(:naive_datetime)
    field :updated_at, non_null(:naive_datetime)
    field :acknowledged, non_null(:boolean)
    field :acknowledged_at, :naive_datetime

    field :previous_phase, :string
    field :new_phase, :string

    field :previous_health, :string
    field :new_health, :string

    field :project, :project do
      resolve fn update, _, _ ->
        project = Operately.Projects.get_project!(update.updatable_id)

        {:ok, project}
      end
    end

    field :acknowledging_person, :person do
      resolve fn update, _, _ ->
        if update.acknowledging_person_id == nil do
          {:ok, nil}
        else
          person = Operately.People.get_person!(update.acknowledging_person_id)
          {:ok, person}
        end
      end
    end

    field :message, non_null(:string) do
      resolve fn update, _, _ ->
        {:ok, Jason.encode!(update.content["message"])}
      end
    end

    field :message_type, non_null(:string) do
      resolve fn update, _, _ ->
        {:ok, update.type || "status_update"}
      end
    end

    field :comments, list_of(:comment) do
      resolve fn update, _, _ ->
        comments = Operately.Updates.list_comments(update.id)

        {:ok, comments}
      end
    end

    field :author, :person do
      resolve fn update, _, _ ->
        person = Operately.People.get_person!(update.author_id)

        {:ok, person}
      end
    end

    field :reactions, list_of(:reaction) do
      resolve fn update, _, _ ->
        reactions = Operately.Updates.list_reactions(update.id, :update)

        {:ok, reactions}
      end
    end

    field :content, :update_content do
      resolve fn update, _, _ ->
        {:ok, update}
      end
    end
  end

  union :update_content do
    types [
      :update_content_project_created,
      :update_content_project_milestone_created,
    ]

    resolve_type fn %{type: type}, _ ->
      String.to_atom("update_content_#{type}") 
    end
  end

  object :update_content_project_created do
    field :creator, :person do
      resolve fn update, _, _ ->
        person = Operately.People.get_person!(update.content["creator_id"])

        {:ok, person}
      end
    end

    field :champion, :person do
      resolve fn update, _, _ ->
        person = Operately.People.get_person!(update.content["champion_id"])

        {:ok, person}
      end
    end
  end

  object :update_content_project_milestone_created do
    field :milestone, non_null(:milestone) do
      resolve fn update, _, _ ->
        milestone = Operately.Projects.get_milestone!(update.content["milestone_id"])

        {:ok, milestone}
      end
    end
  end

end
