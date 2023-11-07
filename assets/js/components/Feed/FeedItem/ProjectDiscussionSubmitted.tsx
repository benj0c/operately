import * as React from "react";
import * as People from "@/models/people";

import { Container } from "../FeedItemElements";

export default function ({ activity }) {
  return (
    <Container
      title={People.shortName(activity.author) + " started a discussion"}
      author={activity.author}
      time={activity.insertedAt}
    />
  );
}
