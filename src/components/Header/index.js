import React, { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";

const Header = ({ ...props }) => {
  // state: shortened header string
  const [shortened, setShortened] = useState(false);
  const [overscrolled, setOverscrolled] = useState(false);

  useEffect(() => {
    window.onscroll = function () {
      if (window.pageYOffset > 100) {
        setShortened(true);
      } else {
        setShortened(false);
      }

      if (window.pageYOffset > 400) {
        setOverscrolled(true);
      } else {
        setOverscrolled(false);
      }
    };
  }, []);

  const { title, tagline } = props;
  let parsedTagline;
  shortened
    ? (parsedTagline = "web developer")
    : (parsedTagline = tagline);

  return (
    <header
      className={`transition-all px-6 md:px-12 xl:px-20 fixed z-50 top-0 left-0 w-full bg-white ${ shortened ? "py-4" : "py-6 md:py-10" } ${ overscrolled && "backdrop-filter backdrop-blur-lg bg-opacity-60" }`}
    >
      <div className="my-0 mx-auto">
        <span className="text-md mr-4 font-semibold">
          {shortened ? title.split(" ")[0] : title}
        </span>
        {shortened ? (
          <span className="text-gray-800">{parsedTagline}</span>
        ) : (
          <span className="text-gray-800 block">
            <Markdown>{parsedTagline}</Markdown>
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
