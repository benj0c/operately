import type { SortColumn, SortDirection } from "./";

import * as People from "@/models/people";
import * as Groups from "@/models/groups";
import * as Time from "@/utils/time";

export type NodeTypes = "goal" | "project";

import { match } from "ts-pattern";

export abstract class Node {
  public id: string;
  public type: NodeTypes;
  public depth: number;
  public name: string;
  public sortColumn: SortColumn;
  public sortDirection: SortDirection;
  public showCompleted: boolean;

  public linkTo: string;
  public champion: People.Person;
  public children: Node[];
  public hasChildren: boolean;
  public space: Groups.Group;
  public isClosed: boolean;
  public progress: number;
  public lastCheckInDate: Date | null;
  public spaceId: string;

  abstract childrenInfoLabel(): string | null;
  abstract compareTimeframe(b: Node): number;

  compare(b: Node, column: SortColumn, direction: SortDirection): number {
    const result = match(column)
      .with("name", () => this.compareName(b))
      .with("timeframe", () => this.compareTimeframe(b))
      .with("lastCheckIn", () => this.compareLastCheckIn(b))
      .with("champion", () => this.compareChampion(b))
      .with("space", () => this.compareSpace(b))
      .with("progress", () => this.compareProgress(b))
      .exhaustive();

    const directionFactor = direction === "asc" ? 1 : -1;
    return result * directionFactor;
  }

  compareChampion(b: Node): number {
    return this.champion.fullName.localeCompare(b.champion.fullName);
  }

  compareName(b: Node): number {
    return this.name.localeCompare(b.name);
  }

  compareProgress(b: Node): number {
    if (this.isClosed && !b.isClosed) return -1;
    if (!this.isClosed && b.isClosed) return 1;
    if (this.isClosed || b.isClosed) return 1;

    return this.progress - b.progress;
  }

  compareSpace(b: Node): number {
    if (this.space.isCompanySpace && !b.space.isCompanySpace) return -1;
    if (!this.space.isCompanySpace && b.space.isCompanySpace) return 1;

    return this.space.name.localeCompare(b.name);
  }

  compareLastCheckIn(b: Node): number {
    return Time.compareAsc(this.lastCheckInDate!, b.lastCheckInDate!);
  }
}