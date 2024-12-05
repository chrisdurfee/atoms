/**
 * This will create a comment.
 *
 * @param {object} props
 * @returns {object}
 */
export const Comment = (props) => ({
    tag: 'comment',
    textContent: `${props.type} placeholder`,
    onCreated: props.onCreated
});