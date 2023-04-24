defmodule Operately.UpdatesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Operately.Updates` context.
  """

  def update_fixture(:with_author, attrs) do
    person = Operately.PeopleFixtures.person_fixture()
    update = update_fixture(Map.put(attrs, :author_id, person.id))

    {update, person}
  end

  def update_fixture(attrs \\ %{}) do
    {:ok, update} =
      attrs
      |> Enum.into(%{
        content: "some content",
        updatable_id: Ecto.UUID.generate(),
        updatable_type: :objective,
      })
      |> Operately.Updates.create_update()

    update
  end

  def comment_fixture(:with_update, :with_author, attrs) do
    {update, author} = update_fixture(:with_author, %{})

    comment = comment_fixture(Map.merge(attrs, %{
      update_id: update.id,
      author_id: author.id
    }))

    {comment, update, author}
  end

  def comment_fixture(attrs \\ %{}) do
    {:ok, comment} =
      attrs
      |> Enum.into(%{
        content: "some content"
      })
      |> Operately.Updates.create_comment()

    comment
  end
end