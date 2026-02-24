import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:8080/api-docs-json",
      // filters: {
      //   mode: "include",
      //   tags: ["__never_generate_operations__"],
      // },
    },
    output: {
      mode: "tags",
      target: "./shared/model/orval",
      schemas: "./shared/model/orvalSchemas",
      client: "fetch",
      clean: true,
    },
  },
});
