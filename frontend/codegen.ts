import { CodegenConfig } from "@graphql-codegen/cli"
import path from "path"

const config: CodegenConfig = {
  schema: path.resolve(__dirname, "../backend/src/schema.gql"),
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