import * as React from "react";
import Markdown from 'markdown-to-jsx';
import { Link, graphql } from "gatsby";

import "../style/index.css";

// markup
const IndexPage = ({ data }) => {
  console.log(data);
  return (
    <main>
      <title>Home Page</title>
      <ul className="flex">
        {data.allStrapiArticle.edges.map(article => (
          <li key={article.node.id} className="mx-4 my-2 w-1/2">
            <h2 className="text-3xl mt-2 mb-5 black text-purple-600">
              <Link to={`/${article.node.id}`}>
                <Markdown>{article.node.titleText.title}</Markdown>
              </Link>
            </h2>
            <p>
              <Markdown>{article.node.titleText.text}</Markdown>
            </p>
            <footer>
              {article.node.externalLinks.map(link => (
                <Link to={link.url} className="block my-3 p-2 text-md bg-purple-100 text-purple-800 bold">
                  <Markdown>{link.text}</Markdown>
                </Link>
              ))}
            </footer>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query IndexQuery {
    allStrapiArticle {
      edges {
        node {
          id
          titleText {
            title
            text
          }
          externalLinks {
            text
            url
            targetBlank
          }
          headerImg {
            name
            alternativeText
            formats {
              large {
                url
              }
            }
          }
        }
      }
    }
  }
`