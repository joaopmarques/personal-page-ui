import React, { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import { graphql } from "gatsby";
import TextTransition, { presets } from "react-text-transition";
import { useSpring, animated } from "react-spring";

import Header from "../components/header";
import useForm from "../hooks/useForm";

import "../style/index.css";

// markup
const IndexPage = ({ data }) => {
  // state: text switcher
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setTextIndex((textIndex) => textIndex + 1),
      2500
    );
    return () => clearTimeout(intervalId);
  }, []);

  // spring: fade in animation
  const fadeIn = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

  // form management: set product name
  const [{ values }, handleChange, handleSubmit] = useForm();
  const [productName, setProductName] = useState("");

  const getProductName = () => {
    if (values && Object.keys(values).length === 0 && values.constructor === Object) {
      setProductName("your product");
    } else {
      setProductName(Object.entries(values)[0][1]);
    }
  };

  // shorten calls for data
  let homeData = data.allStrapiHomepage.edges[0].node;

  return (
    <animated.main style={fadeIn}>
      <title>Home Page</title>

      <Header
        title={homeData.header.nameDescription.title}
        tagline={homeData.header.nameDescription.text}
      />

      {/* Hero Area */}
      <section className="flex flex-wrap content-center h-screen min-h-400 py-3 px-20 bg-white">
        <div className="block w-full text-3xl text-gray-800">
          <span className="flex justify-start">
            <span>{homeData.heroArea.sentenceFirst}&nbsp;</span>
            <TextTransition
              className="font-bold text-purple-700"
              text={
                homeData.heroArea.typeList[
                  textIndex % homeData.heroArea.typeList.length
                ].entry
              }
              springConfig={presets.gentle}
            />
            <span>&nbsp;{homeData.heroArea.sentenceSecond}</span>
            <br />
          </span>
          <span className="block mt-4">{homeData.heroArea.sentenceLast}</span>
        </div>
        <form
          className="flex w-full max-w-3xl"
          onSubmit={handleSubmit(getProductName)}
        >
          <input
            className="fieldReset mt-8 -z-10"
            onChange={handleChange}
            id="item_name"
            type="text"
            placeholder={
              homeData.heroArea.fieldPlaceholder +
              homeData.heroArea.typeList[
                textIndex % homeData.heroArea.typeList.length
              ].entry
            }
          />
          <input
            className="buttonReset mt-8 pl-14 -ml-14 z-10"
            type="submit"
            value={homeData.heroArea.buttonString}
          />
        </form>
      </section>

      {/* Grand Area #1: showcase */}
      <section className="flex justify-center content-end h-screen min-h-600">
        <h1>{`This is ${productName}.`}</h1>
        <article className="">
          <main className="">
            <Markdown>{homeData.productSheet.features}</Markdown>
          </main>
          <figure className="">
            chart thing
          </figure>
        </article>
      </section>
    </animated.main>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    allStrapiHomepage {
      edges {
        node {
          header {
            nameDescription {
              title
              text
            }
          }
          heroArea {
            sentenceFirst
            typeList {
              entry
            }
            sentenceSecond
            sentenceLast
            buttonString
            fieldPlaceholder
          }
          productSheet {
            features
            chartData {
              col {
                colName
                value
              }
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
`;
