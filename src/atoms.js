import { Atom } from '@base-framework/base';
import { On, OnRoute, OnState } from './on/on.js';
export { On, OnRoute, OnState };

/**
 * Creates a generic HTML tag.
 *
 * @param {object} props - Properties for the HTML element.
 * @param {array} children - Children elements of the HTML element.
 * @returns {object} - Returns an object representing the HTML element.
 */
const Tag = (props, children) => {
    return { ...props, children };
};

/**
 * Creates a Doctype tag.
 *
 * @param {object} props - Properties for the HTML element.
 * @returns {object} - Returns an object representing the HTML element.
 */
export const Doctype = (props) => ({ ...props, tag: 'DOCTYPE' });

/**
 * Creates an HTML tag.
 *
 * @param {object} props - Properties for the HTML element.
 * @param {array} children - Children elements of the HTML element.
 * @returns {object} - Returns an object representing the HTML element.
 */
export const Html = Atom((props, children) => Tag({ ...props, tag: 'html' }, children));

/**
 * Creates a script tag.
 *
 * @param {object} props - Properties for the HTML element.
 * @param {array} children - Children elements of the HTML element.
 * @returns {object} - Returns an object representing the HTML element.
 */
export const Script = Atom((props, children) => Tag({ ...props, tag: 'script' }, children));

/**
 * Creates a style tag.
 *
 * @param {object} props - Properties for the HTML element.
 * @param {array} children - Children elements of the HTML element.
 * @returns {object} - Returns an object representing the HTML element.
 */
export const Style = Atom((props, children) => Tag({ ...props, tag: 'style' }, children));

/**
 * Creates a head tag.
 *
 * @param {object} props - Properties for the head element.
 * @param {array} children - Children elements of the head.
 * @returns {object} - Returns an object representing the head element.
 */
export const Head = Atom((props, children) => Tag({ ...props, tag: 'head' }, children));

/**
 * Creates a title tag.
 *
 * @param {object} props - Properties for the title element.
 */
export const Title = (props) =>
{
    return { ...props };
};

/**
 * Creates a meta tag.
 *
 * @param {object} props - Properties for the meta element.
 * @returns {object} - Returns an object representing the meta element.
 */
export const Meta = (props) => ({ ...props, tag: 'meta' });

/**
 * Creates a link tag.
 *
 * @param {object} props - Properties for the link element.
 * @returns {object} - Returns an object representing the link element.
 */
export const Link = (props) => ({ ...props, tag: 'link' });

/**
 * Creates a body tag.
 *
 * @param {object} props - Properties for the body element.
 * @param {array} children - Children elements of the body.
 * @returns {object} - Returns an object representing the body element.
 */
export const Body = Atom((props, children) => Tag({ ...props, tag: 'body' }, children));

/**
 * Creates a div element.
 *
 * @param {object} props - Properties for the div element.
 * @param {array} children - Children elements of the div.
 * @returns {object} - Returns an object representing the div element.
 */
export const Div = Atom((props, children) => Tag(props, children));

/**
 * Creates a dialog element.
 *
 * @param {object} props - Properties for the div element.
 * @param {array} children - Children elements of the div.
 * @returns {object} - Returns an object representing the dialog element.
 */
export const Dialog = Atom((props, children) => Tag({ ...props, tag: 'dialog' }, children));

/**
 * Creates a span element.
 *
 * @param {object} props - Properties for the span element.
 * @param {array} children - Children elements of the span.
 * @returns {object} - Returns an object representing the span element.
 */
export const Span = Atom((props, children) => Tag({ ...props, tag: 'span' }, children));

/**
 * Creates a paragraph (p) element.
 *
 * @param {object} props - Properties for the paragraph element.
 * @param {array} children - Children elements of the paragraph.
 * @returns {object} - Returns an object representing the paragraph element.
 */
export const P = Atom((props, children) => Tag({ ...props, tag: 'p' }, children));

/**
 * Creates an anchor (a) element.
 *
 * @param {object} props - Properties for the anchor element.
 * @param {array} children - Children elements of the anchor.
 * @return {object} - Returns an object representing the anchor element.
 */
export const A = Atom((props, children) => Tag({ ...props, tag: 'a' }, children));

/**
 * Creates a button element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Button = Atom((props, children) => Tag({ ...props, tag: 'button' }, children));

/**
 * Creates a submit button element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const SubmitButton = Atom((props, children) => Button({ ...props, type: 'submit' }, children));

/**
 * Creates an unordered list (ul) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Ul = Atom((props, children) => Tag({ ...props, tag: 'ul' }, children));

/**
 * Creates a list item (li) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Li = Atom((props, children) => Tag({ ...props, tag: 'li' }, children));

/**
 * Creates an image (img) element.
 */
export const Img = Atom((props) => Tag({ ...props, tag: 'img' }, null));

/**
 * Create a br element.
 *
 * @param {object} props - Properties for the br element.
 * @returns {object} - Returns an object representing the br element.
 */
export const Br = Atom((props) => Tag({ ...props, tag: 'br' }, null));

/**
 * Creates a horizontal rule (hr) element.
 *
 * @param {object} props - Properties for the hr element.
 * @returns {object} - Returns an object representing the hr element.
 */
export const Hr = Atom((props) => Tag({ ...props, tag: 'hr' }, null));

/**
 * Creates a text (text) element.
 *
 * @param {object} props - Properties for the text element.
 * @param {array} children - Children elements of the text element.
 * @returns {object} - Returns an object representing the text element.
 */
export const Text = Atom((props, children) => Tag({ ...props, tag: 'text' }, children));

/**
 * Creates a header 1 (h1) element.
 *
 * @param {object} props - Properties for the h1 element.
 * @param {array} children - Children elements of the h1 element.
 * @returns {object} - Returns an object representing the h1 element.
 */
export const H1 = Atom((props, children) => Tag({ ...props, tag: 'h1' }, children));

/**
 * Creates a header 2 (h2) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const H2 = Atom((props, children) => Tag({ ...props, tag: 'h2' }, children));

/**
 * Creates a header 3 (h3) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const H3 = Atom((props, children) => Tag({ ...props, tag: 'h3' }, children));

/**
 * Creates a header 4 (h4) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const H4 = Atom((props, children) => Tag({ ...props, tag: 'h4' }, children));

/**
 * Creates a header 5 (h5) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const H5 = Atom((props, children) => Tag({ ...props, tag: 'h5' }, children));

/**
 * Creates a header 6 (h6) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const H6 = Atom((props, children) => Tag({ ...props, tag: 'h6' }, children));

/**
 * Creates an input element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Input = Atom((props) => Tag({ ...props, tag: 'input' }, null));

/**
 * Creates a label element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Label = Atom((props, children) => Tag({ ...props, tag: 'label' }, children));

/**
 * Creates a checkbox input element.
 *
 * @param {object} props - Properties for the checkbox input element.
 * @returns {object} - Returns an object representing the checkbox input element.
 */
export const Checkbox = Atom((props) => Input({ ...props, type: 'checkbox' }));

/**
 * Creates a section element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Section = Atom((props, children) => Tag({ ...props, tag: 'section' }, children));

/**
 * Creates an article element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Article = Atom((props, children) => Tag({ ...props, tag: 'article' }, children));

/**
 * Creates a header (header) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Header = Atom((props, children) => Tag({ ...props, tag: 'header' }, children));

/**
 * Creates a footer element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Footer = Atom((props, children) => Tag({ ...props, tag: 'footer' }, children));

/**
 * Creates a nav element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Nav = Atom((props, children) => Tag({ ...props, tag: 'nav' }, children));

/**
 * Creates an aside element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Aside = Atom((props, children) => Tag({ ...props, tag: 'aside' }, children));

/**
 * Creates a figure element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Figure = Atom((props, children) => Tag({ ...props, tag: 'figure' }, children));

/**
 * Creates a figcaption element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Figcaption = Atom((props, children) => Tag({ ...props, tag: 'figcaption' }, children));

/**
 * Creates a main element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Main = Atom((props, children) => Tag({ ...props, tag: 'main' }, children));

/**
 * Creates a video element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Video = Atom((props, children) => Tag({ ...props, tag: 'video' }, children));

/**
 * Creates an audio element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Audio = Atom((props, children) => Tag({ ...props, tag: 'audio' }, children));

/**
 * Creates a table element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Table = Atom((props, children) => Tag({ ...props, tag: 'table' }, children));

/**
 * Creates a table row (tr) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Tr = Atom((props, children) => Tag({ ...props, tag: 'tr' }, children));

/**
 * Creates a table header (th) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Th = Atom((props, children) => Tag({ ...props, tag: 'th' }, children));

/**
 * Creates a table data (td) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Td = Atom((props, children) => Tag({ ...props, tag: 'td' }, children));

/**
 * Creates a table header group (thead) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Thead = Atom((props, children) => Tag({ ...props, tag: 'thead' }, children));

/**
 * Creates a table body (tbody) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Tbody = Atom((props, children) => Tag({ ...props, tag: 'tbody' }, children));

/**
 * Creates a table footer (tfoot) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Tfoot = Atom((props, children) => Tag({ ...props, tag: 'tfoot' }, children));

/**
 * Creates a form element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Form = Atom((props, children) => Tag({ ...props, tag: 'form' }, children));

/**
 * Creates a select element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Select = Atom((props, children) => Tag({ ...props, tag: 'select' }, children));

/**
 * Creates an option element for a select tag.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Option = Atom((props, children) => Tag({ ...props, tag: 'option' }, children));

/**
 * Creates a textarea element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Textarea = Atom((props, children) => Tag({ ...props, tag: 'textarea' }, children));

/**
 * Creates a canvas element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Canvas = Atom((props, children) => Tag({ ...props, tag: 'canvas' }, children));

/**
 * Creates a progress element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Progress = Atom((props, children) => Tag({ ...props, tag: 'progress' }, children));

/**
 * Creates a blockquote element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Blockquote = Atom((props, children) => Tag({ ...props, tag: 'blockquote' }, children));

/**
 * Creates a preformatted text (pre) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Pre = Atom((props, children) => Tag({ ...props, tag: 'pre' }, children));

/**
 * Creates a code element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Code = Atom((props, children) => Tag({ ...props, tag: 'code' }, children));

/**
 * Creates an ordered list (ol) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Ol = Atom((props, children) => Tag({ ...props, tag: 'ol' }, children));

/**
 * Creates a definition list (dl) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Dl = Atom((props, children) => Tag({ ...props, tag: 'dl' }, children));

/**
 * Creates a definition term (dt) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Dt = Atom((props, children) => Tag({ ...props, tag: 'dt' }, children));

/**
 * Creates a definition description (dd) element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Dd = Atom((props, children) => Tag({ ...props, tag: 'dd' }, children));

/**
 * Creates a fieldset element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Fieldset = Atom((props, children) => Tag({ ...props, tag: 'fieldset' }, children));

/**
 * Creates a legend element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Legend = Atom((props, children) => Tag({ ...props, tag: 'legend' }, children));

/**
 * Creates a meter element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Meter = Atom((props, children) => Tag({ ...props, tag: 'meter' }, children));

/**
 * Creates an iframe element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Iframe = Atom((props, children) => Tag({ ...props, tag: 'iframe' }, children));

/**
 * Creates a details element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Details = Atom((props, children) => Tag({ ...props, tag: 'details' }, children));

/**
 * Creates a summary element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Summary = Atom((props, children) => Tag({ ...props, tag: 'summary' }, children));

/**
 * Creates an em element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Em = Atom((props, children) => Tag({ ...props, tag: 'em' }, children));

/**
 * Creates a strong element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Strong = Atom((props, children) => Tag({ ...props, tag: 'strong' }, children));

/**
 * Creates a small element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Small = Atom((props, children) => Tag({ ...props, tag: 'small' }, children));

/**
 * Creates a s element (strikethrough).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const S = Atom((props, children) => Tag({ ...props, tag: 's' }, children));

/**
 * Creates a cite element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Cite = Atom((props, children) => Tag({ ...props, tag: 'cite' }, children));

/**
 * Creates a q element (inline quotation).
 */
export const Q = Atom((props, children) => Tag({ ...props, tag: 'q' }, children));

/**
 * Creates a dfn element (definition element).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Dfn = Atom((props, children) => Tag({ ...props, tag: 'dfn' }, children));

/**
 * Creates an abbr element (abbreviation).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Abbr = Atom((props, children) => Tag({ ...props, tag: 'abbr' }, children));

/**
 * Creates a data element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Data = Atom((props, children) => Tag({ ...props, tag: 'data' }, children));

/**
 * Creates a time element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Time = Atom((props, children) => Tag({ ...props, tag: 'time' }, children));

/**
 * Creates a var element (variable).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Var = Atom((props, children) => Tag({ ...props, tag: 'var' }, children));

/**
 * Creates a samp element (sample output).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Samp = Atom((props, children) => Tag({ ...props, tag: 'samp' }, children));

/**
 * Creates a kbd element (keyboard input).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Kbd = Atom((props, children) => Tag({ ...props, tag: 'kbd' }, children));

/**
 * Creates a sub element (subscript).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Sub = Atom((props, children) => Tag({ ...props, tag: 'sub' }, children));

/**
 * Creates a sup element (superscript).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Sup = Atom((props, children) => Tag({ ...props, tag: 'sup' }, children));

/**
 * Creates an i element (italic).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const I = Atom((props, children) => Tag({ ...props, tag: 'i' }, children));

/**
 * Creates a b element (bold).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const B = Atom((props, children) => Tag({ ...props, tag: 'b' }, children));

/**
 * Creates a u element (underline).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const U = Atom((props, children) => Tag({ ...props, tag: 'u' }, children));

/**
 * Creates a mark element.
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Mark = Atom((props, children) => Tag({ ...props, tag: 'mark' }, children));

/**
 * Creates a ruby element (for East Asian typography).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Ruby = Atom((props, children) => Tag({ ...props, tag: 'ruby' }, children));

/**
 * Creates an rt element (explanation/pronunciation of characters in East Asian typography).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Rt = Atom((props, children) => Tag({ ...props, tag: 'rt' }, children));

/**
 * Creates an rp element (for East Asian fallback parenthesis).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Rp = Atom((props, children) => Tag({ ...props, tag: 'rp' }, children));

/**
 * Creates a bdi element (Bi-Directional Isolation).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Bdi = Atom((props, children) => Tag({ ...props, tag: 'bdi' }, children));

/**
 * Creates a bdo element (Bi-Directional Override).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Bdo = Atom((props, children) => Tag({ ...props, tag: 'bdo' }, children));

/**
 * Creates a wbr element (Word Break Opportunity).
 *
 * @param {object} props - Properties for the element.
 * @param {array} children - Children elements.
 * @returns {object} - Returns an object representing the element.
 */
export const Wbr = Atom((props) => Tag({ ...props, tag: 'wbr' }, null));