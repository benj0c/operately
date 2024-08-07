import React from "react";

import * as TipTapEditor from "@/components/Editor";

import { FilledButton } from "@/components/Button";
import { FormState } from "./useForm";
import { NotificationSection } from "./NotificationSection";
import { StatusDropdown } from "../StatusDropdown";
import classNames from "classnames";

interface FormProps {
  form: FormState;
}

export function Form({ form }: FormProps) {
  return (
    <>
      {form.mode === "create" && <Header />}
      <StatusSection form={form} />
      <DescriptionSection form={form} />

      {form.mode === "create" && <NotificationSection form={form} />}
      {form.mode === "create" && <SubmitActions form={form} />}
    </>
  );
}

function Header() {
  return (
    <div>
      <div className="text-2xl font-bold mx-auto">Let's Check In</div>
    </div>
  );
}

export function StatusSection({ form }: { form: FormState }) {
  const error = !!form.errors.find((e) => e.field === "status");

  return (
    <div className="my-8">
      <div className="text-lg font-bold mx-auto">1. How's the project going?</div>
      {error && <div className="text-xs text-red-500 mt-1 font-medium">Status is required</div>}

      <div className="flex flex-col gap-2 mt-2">
        <StatusDropdown
          onStatusSelected={form.setStatus}
          status={form.status}
          reviewer={form.reviewer!}
          error={error}
        />
      </div>
    </div>
  );
}

function DescriptionSection({ form }: { form: FormState }) {
  const error = !!form.errors.find((e) => e.field === "description");

  const className = classNames("mt-2 border border-surface-outline rounded", {
    "border-red-500": error,
  });

  return (
    <>
      <div className="text-lg font-bold mx-auto">2. What's new since the last check-in?</div>
      {error && <div className="text-xs text-red-500 mt-1 font-medium">Description is required</div>}
      <div className={className}>
        <TipTapEditor.StandardEditorForm editor={form.editor.editor} />
      </div>
    </>
  );
}

function SubmitActions({ form }: { form: FormState }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mt-4">
        <FilledButton onClick={form.submit} testId="post-check-in" bzzzOnClickFailure>
          {form.submitButtonLabel}
        </FilledButton>

        <FilledButton type="secondary" linkTo={form.cancelPath} data-test-id="cancel" loading={form.submitting}>
          Cancel
        </FilledButton>
      </div>
    </div>
  );
}
