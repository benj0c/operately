import React from "react";

import * as Pages from "@/components/Pages";
import * as Paper from "@/components/PaperContainer";
import * as Spaces from "@/models/spaces";
import * as Projects from "@/models/projects";

import { FilledButton } from "@/components/Button";
import { SpacePageNavigation } from "@/components/SpacePageNavigation";
import { ProjectList } from "@/features/ProjectList";
import { Paths } from "@/routes/paths";

interface LoadedData {
  space: Spaces.Space;
  projects: Projects.Project[];
}

export async function loader({ params }): Promise<LoadedData> {
  return {
    space: await Spaces.getSpace({ id: params.id }),
    projects: await Projects.getProjects({
      spaceId: params.id,
      includeContributors: true,
      includeMilestones: true,
      includeLastCheckIn: true,
    }).then((data) => data.projects!),
  };
}

export function Page() {
  const { space, projects } = Pages.useLoadedData<LoadedData>();
  const newProjectPath = Paths.spaceNewProjectPath(space.id!);

  return (
    <Pages.Page title={space.name!}>
      <Paper.Root size="large">
        <Paper.Body minHeight="500px" backgroundColor="bg-surface">
          <SpacePageNavigation space={space} activeTab="projects" />

          <div className="flex items-center justify-between mb-8">
            <div className="font-extrabold text-3xl">Projects</div>
            <FilledButton type="primary" testId="add-project" size="sm" linkTo={newProjectPath}>
              Add Project
            </FilledButton>
          </div>

          <ProjectList projects={projects} />
        </Paper.Body>
      </Paper.Root>
    </Pages.Page>
  );
}
