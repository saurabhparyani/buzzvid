import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "../backend/src/schema.gql",
  documents: ["src/graphql/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
}

export default config