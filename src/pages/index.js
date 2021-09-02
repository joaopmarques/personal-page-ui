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
    <main>
      <motion.section>
        <title>João P. Marques | Web Developer</title>

        {/* HEADER */}
        <Header
          title={homeData.header.nameDescription.title}
          tagline={homeData.header.nameDescription.text}
        />

        {/* HERO AREA */}
        <section className="flex flex-wrap content-center h-screen min-h-1000 py-2 md:py-3 px-6 md:px-12 xl:px-20 bg-white">
          <div className="hidden xl:block w-full text-3xl text-gray-800">
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

          <div className="block xl:hidden w-full text-2xl text-gray-800">
            <span className="flex flex-col">
              <span className="mb-2 text-center">
                {homeData.heroArea.sentenceFirst}&nbsp;
              </span>
              <div style={{ margin: 0, height: 30, position: "relative" }}>
                <AnimatePresence>
                  <motion.div
                    key={text}
                    variants={animations.heroStringVariants}
                    initial={"entrance"}
                    animate={"static"}
                    exit={"exit"}
                    style={{
                      width: "100%",
                      position: "absolute",
                      textAlign: "center",
                    }}
                  >
                    <motion.span className="font-bold text-purple-700">
                      {text}
                    </motion.span>
                  </motion.div>
                </AnimatePresence>
              </div>
              <span className="mt-2 text-center">
                &nbsp;{homeData.heroArea.sentenceSecond}
              </span>
              <br />
            </span>
            <span className="block text-center mt-4">
              {homeData.heroArea.sentenceLast}
            </span>
          </div>

          <div className="flex w-full max-w-3xl mx-auto xl:mx-0">
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
        className="flex flex-col items-center justify-center md:h-screen min-h-800 py-6 md:py-12 xl:py-20 pb-12 md:pb-6 xl:pb-0 bg-white overflow-y-hidden relative"
      >
        <div className="block absolute bottom-0 left-0 w-full h-96 z-10 bg-gradient-to-t from-white to-transparent"></div>
        <motion.h1
          className="text-5xl md:text-7xl xl:text-8xl mb-8 font-light text-center mt-auto"
          variants={animations.titleVariant}
        >
          {`This is ${productName}.`}
        </motion.h1>
        <article className="flex flex-wrap rounded-t-6xl bg-white shadow-2xl mt-auto overflow-hidden max-w-4xl">
          <section className="p-14 pb-7 w-full md:w-1/2">
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
          <figure className="flex justify-center items-end p-14 w-full md:w-1/2 h-500 md:h-auto bg-purple-50">
            <div className="flex flex-col justify-end items-center h-full w-1/2">
              <div className="block h-1/3 w-24 bg-gray-600 rounded-4xl"></div>
              <span className="mt-6 opacity-50 text-center">
                The competition
              </span>
            </div>
            <div className="flex flex-col justify-end items-center h-full w-1/2">
              <div className="block h-full w-24 bg-purple-500 rounded-4xl"></div>
              <span className="mt-6 font-bold text-purple-700 text-center">
                {productName}
              </span>
            </div>
          </figure>
        </article>
      </motion.section>

      {/* GRAND SECTION 2 */}
      <motion.section className="flex flex-col justify-center md:h-screen min-h-800 py-6 md:py-12 xl:py-20 px-6 md:px-12 xl:px-20 bg-white overflow-y-hidden relative">
        <div className="max-w-8xl mx-auto">
          {homeData.grandFeatures.map(
            (item, index) =>
              index === 0 && (
                <>
                  <h2 className="text-3xl md:text-5xl xl:text-6xl font-medium text-left mt-auto text-gray-700">
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
                              "text-3xl md:text-4xl font-medium mt-18 text-gray-700",
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
      <motion.section className="grandFeatures">
        {homeData.grandFeatures.map(
          (feature, index) =>
            index > 0 &&
            index < 5 && (
              <motion.section className="flex flex-wrap items-center h-800 md:h-screen min-h-800">
                <section className="descriptionContainer z-10 flex flex-col items-start justify-center w-full md:w-1/2 min-h-800 md:h-screen p-8 lg:p-14 xl:p-18 2xl:p-24">
                  <motion.div className="-ml-6 mb-3">
                    <span className="text-xl font-light mr-3">{index}.</span>
                    <span className="text-xl uppercase tracking-widest font-medium">
                      {feature.featureText.text}
                    </span>
                  </motion.div>
                  <motion.h3 className="text-6xl xl:text-7xl 2xl:text-9xl font-bold uppercase mb-16">
                    {feature.featureText.title}
                  </motion.h3>
                  <Markdown className="text-2xl xl:text-3xl">
                    {feature.featureText.richText}
                  </Markdown>
                </section>
                <section className="pictureContainer flex items-center justify-center relative -top-full md:top-0 z-0 w-full md:w-1/2 min-h-800 md:h-screen">
                  <img
                    className="h-full w-full object-cover absolute top-0 left-0"
                    src={feature.featureArtwork.url}
                    alt={feature.featureText.title}
                  />
                </section>
              </motion.section>
            )
        )}
      </motion.section>

      {/* WRAP UP SECTION */}
      <motion.section className="flex flex-col justify-center items-center min-h-800 p-4 md:p6 xl:p8">
        <h2 className="text-center text-5xl md:text-6xl xl:text-7xl text-gray-800 mb-8">
          {homeData.grandFeatures[5].featureText.title}
        </h2>
        <Markdown className="text-center text-xl md:text-2xl xl:text-3xl text-gray-800">
          {homeData.grandFeatures[5].featureText.richText.replace(
            "[[product]]",
            productName
          )}
        </Markdown>
        <a
          href="https://www.linkedin.com/in/jopmarques/"
          target="_blank"
          rel="noreferrer"
          className="mainButton my-8 w-48 px-12 mx-auto"
        >
          Get in touch
        </a>
      </motion.section>

      {/* FOOTER */}
      <motion.footer className="flex px-8 md:px-12 py-16 md:py-24 min-h-400 bg-gray-900 text-gray-50">
        <section className="flex-grow-0 flex-shrink-0">
          <img
            src={homeData.footer.avatar.avatarPicture.url}
            alt={homeData.footer.avatar.altText}
            className="block w-16 md:w-28 h-16 md:h-28 rounded-full border-4 border-white mr-6"
          />
        </section>
        <section className="flex-grow-1 opacity-90">
          <h4 className="text-xl font-bold">
            {homeData.footer.footerText.title}
          </h4>
          <Markdown className="text-xl font-regular">
            {homeData.footer.footerText.text}
          </Markdown>
          <ul className="mt-12 italic">
          {homeData.footer.quickLinks.map((link, index) => (
            <li className="flex column mb-2">
            <a
              key={index}
              href={link.url}
              target={link.targetBlank ? "_blank" : ""}
              rel="noreferrer"
            >
              {link.text} &#62;
            </a>
            </li>
          ))}
          </ul>
        </section>
      </motion.footer>
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
              text
              title
              richText
            }
            featureArtwork {
              url
            }
          }
          footer {
            avatar {
              altText
              avatarPicture {
                url
              }
            }
            footerText {
              title
              text
            }
            quickLinks {
              id
              text
              url
              targetBlank
            }
          }
        }
      }
    }
  }
`;
