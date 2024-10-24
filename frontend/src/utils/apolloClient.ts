import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink,
  // HttpLink,
} from "@apollo/client";

import createUploadLink from "apollo-upload-client/createUploadLink.mjs"
import { onError } from "@apollo/client/link/error";
import { useUserStore } from "@/stores/userStore";

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `,
    });

    const newAccessToken = data?.refreshToken;
    console.log("newAccessToken", newAccessToken);
    if (!newAccessToken) {
      throw new Error("New access token not received.");
    }
    // localStorage.setItem("accessToken", newAccessToken);
    return `Bearer ${newAccessToken}`;
  } catch (err) {
    console.log(err);
    throw new Error("Error getting new access token.");
  }
}

let retryCount = 0;
const maxRetry = 3;

const uploadLink = createUploadLink({
  uri: "https://buzz-backend-bu05.onrender.com/graphql",
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});


const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  const operationName = operation.operationName;
  console.log(operationName, "operationName");

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
        console.log("refresh token not found", err.extensions)
        if (
          (err.extensions.originalError as { message: string }).message === "Refresh token not found"
        ) {
          useUserStore.setState({
            id: undefined,
            fullname: '',
            email: '',
            image: '',
            googleImage: '',
            bio: '',
          })
        }

        retryCount++;

        return new Observable((observer) => {
          refreshToken(client)
            .then((token) => {
              console.log("token", token);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              operation.setContext((previousContext: any) => ({
                headers: {
                  ...previousContext.headers,
                  authorization: token,
                },
              }));
              const forward$ = forward(operation);
              forward$.subscribe(observer);
            })
            .catch((error) => observer.error(error));
        });
      }
    }
  }
});

// const httpLink = new HttpLink({
//   uri: "https://buzz-backend-bu05.onrender.com/graphql",
//   credentials: "include",
//   headers: {
//     "apollo-require-preflight": "true",
//   },
// });



export const client = new ApolloClient({
  uri: "https://buzz-backend-bu05.onrender.com/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getCommentsByPostId: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            merge(incoming: any) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  link: ApolloLink.from([errorLink, uploadLink]),
});
