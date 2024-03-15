import { Goal } from "@/models/goals";

export class Tree {
  private allGoals: Goal[];
  private roots: { [key: string]: Node };

  static build(allGoals: any) {
    return new Tree(allGoals);
  }

  constructor(allGoals: any) {
    this.allGoals = allGoals;
    this.roots = this.buildRoots();
  }

  getRoots(): Node[] {
    return Object.values(this.roots);
  }

  buildRoots(): { [key: string]: Node } {
    const parentless = this.allGoals.filter((g) => !g.parentGoalId);

    const res = {};

    parentless.forEach((goal) => {
      res[goal.id] = this.buildTree(goal);
    });

    return res;
  }

  buildTree(goal: Goal, depth: number = 0): Node {
    const children = this.allGoals.filter((g) => g.parentGoalId === goal.id);
    const childNodes = children.map((g) => this.buildTree(g, depth + 1));

    return new Node(goal, childNodes, depth);
  }
}

export class Node {
  public goal: Goal;
  public children: Node[];
  public depth: number;

  constructor(goal: Goal, children: Node[], depth: number = 0) {
    this.goal = goal;
    this.children = children;
    this.depth = depth;
  }
}
