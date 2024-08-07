defmodule OperatelyWeb.Api.Mutations.PostProjectCheckIn do
  use TurboConnect.Mutation
  use OperatelyWeb.Api.Helpers

  inputs do
    field :project_id, :string
    field :status, :string
    field :description, :string
  end

  outputs do
    field :check_in, :project_check_in
  end

  def call(conn, inputs) do
    {:ok, project_id} = decode_id(inputs.project_id)

    author = me(conn)
    status = inputs.status
    description = Jason.decode!(inputs.description)

    {:ok, check_in} = Operately.Operations.ProjectCheckIn.run(author, project_id, status, description)
    {:ok, %{check_in: Serializer.serialize(check_in, level: :essential)}}
  end
end
