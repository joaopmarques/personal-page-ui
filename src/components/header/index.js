import React, { Component } from 'react';
import Markdown from 'markdown-to-jsx';


export default class headerImg extends Component {
    render() {

        const { title, tagline, shortened } = this.props;
        let parsedTagline;
        shortened ? parsedTagline = tagline.match(/(?<=\_)(.*?)(?=\_)/g) : parsedTagline = tagline;

        return (
            <header className={`transition-all px-20 fixed top-0 left-0 w-full bg-gradient-to-b from-white via-white to-transparent ${shortened ? 'py-6' : 'py-12'}`}>
                <div className="my-0 mx-auto">
                    <span className="text-md mr-2">{title}</span>
                    {shortened ?
                        <span className="text-gray-800">{parsedTagline}</span>
                    :
                        <span className="text-gray-800 block"><Markdown>{parsedTagline}</Markdown></span>
                    }
                </div>
            </header>
        )
    }
}
