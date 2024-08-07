import * as React from "react";
import * as Paper from "@/components/PaperContainer";
import * as Pages from "@/components/Pages";
import * as Projects from "@/models/projects";

import { ProjectPageNavigation } from "@/components/ProjectPageNavigation";
import { AvatarWithName } from "@/components/Avatar/AvatarWithName";

import RichContent from "@/components/RichContent";
import FormattedTime from "@/components/FormattedTime";

interface LoaderResult {
  project: Projects.Project;
}

export async function loader({ params }): Promise<LoaderResult> {
  return {
    project: await Projects.getProject({
      id: params.projectID,
      includeSpace: true,
      includePermissions: true,
      includeClosedBy: true,
    }).then((data) => data.project!),
  };
}

export function Page() {
  const { project } = Pages.useLoadedData<LoaderResult>();

  return (
    <Pages.Page title={["Retrospective", project.name!]}>
      <Paper.Root size="small">
        <ProjectPageNavigation project={project} />

        <Paper.Body minHeight="none">
          <div className="text-center text-content-accent text-3xl font-extrabold">Project Retrospective</div>
          <div className="flex items-center gap-2 font-medium justify-center mt-2">
            {project.closedBy && <AvatarWithName person={project.closedBy!} size={16} />}
            {project.closedBy && <span>&middot;</span>}
            <FormattedTime time={project.closedAt!} format="long-date" />
          </div>
          <Content project={project} />
        </Paper.Body>
      </Paper.Root>
    </Pages.Page>
  );
}

function Content({ project }) {
  const retro = JSON.parse(project.retrospective);

  return (
    <div className="mt-8">
      <div className="text-content-accent font-bold mt-4 pt-4 border-t border-stroke-base">What went well?</div>
      <RichContent jsonContent={JSON.stringify(retro.whatWentWell)} />

      <div className="text-content-accent font-bold mt-4 pt-4 border-t border-stroke-base">
        What could've gone better?
      </div>
      <RichContent jsonContent={JSON.stringify(retro.whatCouldHaveGoneBetter)} />

      <div className="text-content-accent font-bold mt-4 pt-4 border-t border-stroke-base">What did you learn?</div>
      <RichContent jsonContent={JSON.stringify(retro.whatDidYouLearn)} />
    </div>
  );
}
