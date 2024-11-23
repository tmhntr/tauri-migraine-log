import { expect, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { setupServer } from 'msw/node'
import React from 'react';

import { handlers } from './mocks/handlers'
export const server = setupServer(...handlers)

expect.extend(matchers);

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // do nothing
    }
    unobserve() {
      // do nothing
    }
    disconnect() {
      // do nothing
    }
  };
});

afterEach(() => {
  cleanup();
});