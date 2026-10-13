import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { __resetProgressStoreForTests } from "@/hooks/useProgress";

afterEach(() => {
  cleanup();
  __resetProgressStoreForTests();
});
