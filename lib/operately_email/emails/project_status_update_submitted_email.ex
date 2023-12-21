defmodule OperatelyEmail.Emails.ProjectStatusUpdateSubmittedEmail do
  import OperatelyEmail.Mailers.ActivityMailer
  alias Operately.{Repo, Projects, Updates}

  def send(person, activity) do
    author = Repo.preload(activity, :author).author
    update = Updates.get_update!(activity.content["status_update_id"])
    project = Projects.get_project!(update.updatable_id)
    company = Repo.preload(project, :company).company

    company
    |> new()
    |> to(person)
    |> subject(who: author, action: "submitted a check-in for the #{project.name} project")
    |> assign(:author, author)
    |> assign(:project, project)
    |> assign(:update, update)
    |> render("project_status_update_submitted")
  end
end