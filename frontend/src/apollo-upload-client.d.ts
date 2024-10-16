declare module 'apollo-upload-client/createUploadLink.mjs' {
    import { ApolloLink } from '@apollo/client';
    
    interface CreateUploadLinkOptions {
      uri: string;
      credentials?: string;
      headers?: Record<string, string>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  
    function createUploadLink(options: CreateUploadLinkOptions): ApolloLink;
  
    export default createUploadLink;
  }