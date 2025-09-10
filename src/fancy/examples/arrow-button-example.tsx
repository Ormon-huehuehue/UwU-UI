'use client';

import React from 'react';
import ArrowPointsToCta from "@/components/arrow-pointer";
import ButtonBlack from "@/components/chunky-button";

export default function ArrowButtonExample() {
  return (
    <ArrowPointsToCta
      button={<ButtonBlack title="Buy now" />}
      buttonWidth="default"
      arrow={{
        thickness: 2,
        color: "rgb(255, 0, 0)",
        type: "dashed",
        gapBetweenDashes: 15,
        lineCap: "round",
        tipLength: 12,
        preview: true
      }}
    />
  );
}
