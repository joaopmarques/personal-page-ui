import React, { useState, useEffect, useRef } from "react";
import { graphql } from "gatsby";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "markdown-to-jsx";

import { heroStringVariants } from "../animations";
import Header from "../components/Header";

import "../style/index.css";

// HOMEPAGE MARKUP

const IndexPage = ({ data }) => {
  // shorten calls for data
  let homeData = data.allStrapiHomepage.edges[0].node;

  // state: text switcher
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // stop vertical scrolling - this will be allowed later
    document.documentElement.style.overflow = "hidden";

    // text switiching logic
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
  const mainContainerRef = useRef(null);

  useEffect(() => {
    getRefWidth(ref.current.offsetWidth);
  }, [text]);

  // state: find product name or attribute if user didn't set one
  const [productName, setProductName] = useState("");

  // product showcase: scroll down and begin the journey
  const beginProductShowcase = () => {
    window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
    document.documentElement.style.overflow = "auto";
  };

  return (
    <motion.main
      ref={mainContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.section>
        <title>Homepage</title>

        {/* HEADER */}
        <Header
          title={homeData.header.nameDescription.title}
          tagline={homeData.header.nameDescription.text}
        />

        {/* HERO AREA */}
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
          <div className="flex w-full max-w-3xl">
            <input
              className="fieldReset mt-8 -z-10"
              type="text"
              placeholder={homeData.heroArea.fieldPlaceholder + text}
              onChange={(e) => setProductName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && beginProductShowcase()}
            />
            <button
              onClick={() => beginProductShowcase()}
              className="buttonReset mt-8 pl-14 -ml-14 z-10"
            >
              {homeData.heroArea.buttonString}
            </button>
          </div>
        </section>
      </motion.section>

      {/* GRAND SECTION 1 */}
      <motion.section className="flex flex-wrap content-center h-screen min-h-400 py-3 px-20 bg-white">
        <section className="flex flex-wrap content-center h-screen min-h-600 py-3 px-20 bg-white">
          <h1>{`This is ${productName}.`}</h1>
          <article className="">
            <section className="">
              <Markdown>{homeData.productSheet.features}</Markdown>
            </section>
            <figure className="">chart thing</figure>
          </article>
        </section>
      </motion.section>
    </motion.main>
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
