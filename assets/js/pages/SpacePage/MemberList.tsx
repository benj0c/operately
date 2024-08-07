import * as React from "react";
import * as Spaces from "@/models/spaces";

import { useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { Paths } from "@/routes/paths";
import Button from "@/components/Button";

export default function MemberList({ space }: { space: Spaces.Space }) {
  const navigate = useNavigate();

  const gotoSpaceMembersPage = () => navigate(Paths.spaceMembersPath(space.id!));
  const gotoSpaceAccessManagementPage = () => navigate(Paths.spaceAccessManagementPath(space.id!));

  if (space.members!.length === 0) return null;

  if (space.isCompanySpace) {
    return (
      <div>
        <div className="inline-flex gap-2 justify-center mb-4 flex-wrap mx-8" data-test-id="space-members">
          {space.members!.map((m) => (
            <Avatar key={m.id} person={m} size={32} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center mt-2 gap-3">
        <div
          className="inline-flex gap-2 justify-end flex-wrap"
          onClick={gotoSpaceMembersPage}
          data-test-id="space-members"
        >
          {space.members!.map((m) => (
            <Avatar key={m.id} person={m} size={32} />
          ))}
        </div>
        <Button
          onClick={gotoSpaceAccessManagementPage}
          size="small"
          variant="success"
          data-test-id="access-management"
        >
          Manage Access
        </Button>
      </div>
    );
  }
}
