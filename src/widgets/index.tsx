import React from 'react';
import { updateAndroidWidget } from "@use-voltra/android-client";
import type { Proverb } from "../models/proverb";
import { ProverbWidget } from "./proverb-widget";

const widgetContent = (proverb: Proverb | null) =>
  React.createElement(ProverbWidget, { proverb });

export const updateProverbWidget = async (proverb: Proverb | null) => {
  await updateAndroidWidget("proverb_widget", [
    { size: { width: 250, height: 250 }, content: widgetContent(proverb) },
  ]);
};

export { ProverbWidget };