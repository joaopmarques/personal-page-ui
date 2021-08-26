import React, { useState } from "react";
import Markdown from 'markdown-to-jsx';
import { Link, graphql } from "gatsby";
import TextTransition, { presets } from "react-text-transition";

import Header from "../components/header";

import "../style/index.css";

// markup
const IndexPage = ({ data }) => {

  // state: shortened header string
  const [shortened, setShortened] = useState(false);

  React.useEffect(() => {
    window.onscroll = function () {
      if (window.scrollY > 100) {
        setShortened(true);
      } else {
        setShortened(false);
      }
    }
  }, []);

  // state: text switcher
  const [textIndex, setTextIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() =>
      setTextIndex(textIndex => textIndex + 1),
      2500
    );
    return () => clearTimeout(intervalId);
  }, []);

  // shorten calls for data
  let homeData = data.allStrapiHomepage.edges[0].node;

  return (
    <main>
      <title>Home Page</title>

      <Header
        title={homeData.header.nameDescription.title}
        tagline={homeData.header.nameDescription.text}
        shortened={shortened}
      />

      {/* Hero Area */}
      <section className="flex flex-wrap content-center h-screen py-3 px-20 bg-white">
        <div className="block text-xl text-gray-800">
          <span className="flex justify-start">
            {homeData.heroArea.sentenceFirst}&nbsp;
            <TextTransition
              className="font-bold text-purple-700"
              text={homeData.heroArea.typeList[textIndex % homeData.heroArea.typeList.length].entry}
              springConfig={presets.stiff}
            />
            &nbsp;{homeData.heroArea.sentenceSecond}<br />
          </span>
          <span>{homeData.heroArea.sentenceLast}</span>
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
            sentenceFirst
            typeList {
              entry
            }
            sentenceSecond
            sentenceLast
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