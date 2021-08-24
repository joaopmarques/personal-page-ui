import * as React from "react";
import Markdown from 'markdown-to-jsx';
import { Link, graphql } from "gatsby";

import Header from "../components/header";

import "../style/index.css";

// markup
const IndexPage = ({ data }) => {

  // shorten calls for data
  let homeData = data.allStrapiHomepage.edges[0].node;

  return (
    <main>
      <title>Home Page</title>

      <Header
        title={homeData.header.nameDescription.title}
        tagline={homeData.header.nameDescription.text}
        shortened={false}
      />

      {/* Hero Area */}
      <section className="flex flex-wrap content-center h-screen py-3 px-20 bg-white">
        <div className="block text-xl text-gray-800">
          {homeData.heroArea.heroText.text}
        </div>
      </section>

      <section className="max-w-6xl my-7 mx-auto">
        <ul className="flex">
          {data.allStrapiArticle.edges.map(article => (
            <li key={article.node.id} className="mx-4 my-2 w-1/2">
              <h2 className="text-3xl mt-2 mb-5 font-bold text-purple-600">
                <Link to={`/${article.node.id}`}>
                  <Markdown>{article.node.titleText.title}</Markdown>
                </Link>
              </h2>
              <p>
                <Markdown>{article.node.titleText.text}</Markdown>
              </p>
              <footer>
                {article.node.externalLinks.map(link => (
                  <Link to={link.url} className="block my-3 p-2 text-md bg-purple-100 text-purple-700 bold">
                    <Markdown>{link.text}</Markdown>
                  </Link>
                ))}
              </footer>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query IndexQuery {
    allStrapiHomepage {
      edges {
        node {
          heroArea {
            heroText {
              title
              text
            }
          }
          header {
            nameDescription {
              title
              text
            }
          }
        }
      }
    }
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