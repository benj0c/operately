import * as React from "react";
import * as People from "@/models/people";

import { Container } from "../FeedItemElements";

export default function ({ activity }) {
  return (
    <Container
      title={People.shortName(activity.author) + " acknowledged a check-in"}
      author={activity.author}
      time={activity.insertedAt}
    />
  );
}
