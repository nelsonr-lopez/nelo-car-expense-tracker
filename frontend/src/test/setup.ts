import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { resetMocks } from "./utils";

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Mock fetch globally
global.fetch = vi.fn();

// Mock Astro globals
vi.mock("astro", () => ({
  default: {
    props: {},
    request: {
      url: "http://localhost:3000",
      method: "GET",
      headers: new Headers(),
    },
    url: new URL("http://localhost:3000"),
    redirect: vi.fn(),
  },
}));

// Mock Astro components
vi.mock("@astrojs/react", () => ({
  default: {
    render: vi.fn(),
  },
}));

// Reset all mocks after each test
afterEach(() => {
  cleanup();
  resetMocks();
});
