import { gql } from '@apollo/client';

export const GetSearchResults = gql`
  query GetSearchResults($first: Int!, $after: String, $search: String) {
    contentNodes(first: $first, after: $after, where: { search: $search }) {
      edges {
        node {
          __typename
          id
          uri
          databaseId
          ... on NodeWithTitle {
            title
          }
          ... on NodeWithExcerpt {
            excerpt
          }
          ... on Page {
            content
          }
          ... on Post {
            content
          }
          ... on Bellamontanahome {
            content
            bellaMontanaFields {
              status
            }
          }
          ... on Project {
            projectFields {
              title: projectTitle
              summary
              contentArea
            }
          }
          ... on Testimonial {
            testimonialFields {
              testimonialContent
              testimonialAuthor
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
