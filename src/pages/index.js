import React, { useState, useEffect, useRef } from "react";
import Markdown from "markdown-to-jsx";
import { graphql } from "gatsby";
import { motion, AnimatePresence } from "framer-motion";

import { heroStringVariants } from "../animations";
import Header from "../components/header";
import useForm from "../hooks/useForm";

import "../style/index.css";

// markup
const IndexPage = ({ data }) => {
  // shorten calls for data
  let homeData = data.allStrapiHomepage.edges[0].node;

  // state: text switcher
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(
      () => setTextIndex((textIndex) => textIndex + 1),
      3000
    );
    return () => clearTimeout(intervalId);
  }, []);

  // hero area string switcher
  let text =
    homeData.heroArea.typeList[textIndex % homeData.heroArea.typeList.length]
      .entry;

  // hero area refs: check width of text and adjust width
  const [refWidth, getRefWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    getRefWidth(ref.current.offsetWidth);
  }, [text]);

  // form management: set product name
  const [{ values }, handleChange, handleSubmit] = useForm();
  const [productName, setProductName] = useState("");

  const getProductName = () => {
    if (
      values &&
      Object.keys(values).length === 0 &&
      values.constructor === Object
    ) {
      setProductName("your product");
    } else {
      setProductName(Object.entries(values)[0][1]);
    }
  };

  return (
    <main>
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
            <AnimatePresence>
              <motion.div
                key={text}
                variants={heroStringVariants}
                initial={"entrance"}
                animate={"static"}
                exit={"exit"}
                style={{ position: "absolute", marginLeft: 200 }}
              >
                <motion.span ref={ref} className="font-bold text-purple-700">
                  {text}
                </motion.span>
              </motion.div>
            </AnimatePresence>
            <motion.span
              initial={{ x: refWidth + 15 }}
              animate={{ x: refWidth + 15 }}
              transition={{ type: "spring", stiffness: 80, mass: 0.6 }}
            >
              &nbsp;{homeData.heroArea.sentenceSecond}
            </motion.span>
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
            placeholder={homeData.heroArea.fieldPlaceholder + text}
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
          <figure className="">chart thing</figure>
        </article>
      </section>
    </main>
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
