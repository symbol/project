import React from 'react';

const Footer = function (props) {
	const { links } = props;

	return (
		<div className="footer">
			{links.map((item, index) => (
				<a className="link-container" target="_blank" rel="noopener noreferrer" href={item.href} key={`link${index}`}>
					<img className="link-icon" src={item.icon} alt={item.text} />
					<div className="link-text">{item.text}</div>
				</a>
			))}
		</div>
	);
};

export default Footer;
