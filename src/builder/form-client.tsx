"use client";

import { emailAction, webhookAction } from "@builder/components-pro/form-actions";
import { honeypot, timing } from "@builder/components-pro/form-spam";
import { FormView, type FormViewProps } from "@builder/components-pro/form-view";

// The demo site's form actions. A real site points them at its own function (which keeps the mail password
// and the recipient); the demo posts to a placeholder address the tests answer.
const ENDPOINT = process.env.NEXT_PUBLIC_DEMO_FORM_URL || "https://forms.demo-studio.example/submit";

const actions = {
  email: emailAction({ url: `${ENDPOINT}/email` }),
  webhook: webhookAction({ url: `${ENDPOINT}/webhook` }),
};
// Obvious bots are stopped here (the demo has no server to judge them).
const spam = [honeypot({ block: true }), timing({ minMs: 1500, block: true })];

export function DemoFormView(p: Omit<FormViewProps, "actions" | "spam">) {
  return <FormView {...p} actions={actions} spam={spam} />;
}
