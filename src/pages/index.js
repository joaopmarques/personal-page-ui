import React, { useState, useEffect, useRef } from "react";
import { graphql } from "gatsby";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Markdown from "markdown-to-jsx";
import { useInView } from "react-intersection-observer";

import * as animations from "../animations";
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
    // scroll to the top first though
    //window.scrollTo(0, 0);
    //document.documentElement.style.overflow = "hidden";
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
  const [productName, setProductName] = useState("your product");

  // product showcase: scroll down and begin the journey
  const beginProductShowcase = () => {
    document.documentElement.style.overflow = "auto";
    window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
  };

  // animate on scroll: triggered animation by scroll behavior
  const animation = useAnimation();
  const [scrollAnimRef, inView, entry] = useInView({ threshold: 0.9 });

  useEffect(() => {
    if (inView) {
      animation.start("visible");
    } else {
      animation.start("hidden");
    }
  }, [animation, inView]);

  // template
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
                  variants={animations.heroStringVariants}
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
      <motion.section
        ref={scrollAnimRef}
        className="flex flex-col items-center justify-center h-screen min-h-400 py-0 px-20 bg-white overflow-y-hidden relative"
      >
        <div className="block absolute bottom-0 left-0 w-full h-96 z-10 bg-gradient-to-t from-white to-transparent"></div>
        <motion.h1
          className="text-8xl font-light text-center mt-auto"
          variants={animations.titleVariant}
        >
          {`This is ${productName}.`}
        </motion.h1>
        <article className="flex flex-wrap rounded-t-6xl bg-white shadow-2xl mt-auto overflow-hidden max-w-4xl">
          <section className="p-14 pb-7 w-1/2">
            <div className="genericList lastDescription text-2xl">
              <motion.ul
                className="ml-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delayChilden: 1,
                  staggerChildren: 1,
                }}
              >
                {homeData.productSheet.listElements.map((entry) => (
                  <motion.li
                    key={entry.id}
                    className="relative mb-4"
                    style={{ originX: 0 }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {entry.entry.replace("[[product]]", productName)}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </section>
          <figure className="flex justify-center items-end p-14 w-1/2 bg-purple-50">
            <div className="flex flex-col justify-end items-center h-full w-1/2">
              <div className="block h-1/3 w-24 bg-gray-600 rounded-4xl"></div>
              <span className="mt-6 opacity-50">The competition</span>
            </div>
            <div className="flex flex-col justify-end items-center h-full w-1/2">
              <div className="block h-full w-24 bg-purple-500 rounded-4xl"></div>
              <span className="mt-6 font-bold text-purple-700">
                {productName}
              </span>
            </div>
          </figure>
        </article>
      </motion.section>

      {/* GRAND SECTION 2 */}
      <motion.section className="flex flex-col justify-center h-screen min-h-400 py-0 px-20 bg-white overflow-y-hidden relative">
        <div className="max-w-8xl mx-auto">
          {homeData.grandFeatures.map(
            (item, index) =>
              index === 0 && (
                <>
                  <h2 className="text-6xl font-medium text-left mt-auto text-gray-700">
                    {item.featureText.title.replace("[[product]]", productName)}
                  </h2>
                  <Markdown
                    className="text-3xl font-light text-left mb-auto mt-20 not-italic text-gray-800"
                    options={{
                      overrides: {
                        h3: {
                          component: "h3",
                          props: {
                            className:
                              "text-4xl font-medium mt-18 text-gray-700",
                          },
                        },
                        em: {
                          component: "em",
                          props: {
                            className: "font-bold text-purple-700 not-italic",
                          },
                        },
                        strong: {
                          component: "strong",
                          props: { className: "font-bold" },
                        },
                      },
                    }}
                  >
                    {item.featureText.richText.replace(
                      "[[product]]",
                      productName
                    )}
                  </Markdown>
                </>
              )
          )}
        </div>
      </motion.section>

      {/* GRAND SECTIONS (4 core principles) */}
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
            listElements {
              id
              entry
            }
            chartData {
              col {
                colName
                value
              }
            }
          }
          grandFeatures {
            featureText {
              title
              richText
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
