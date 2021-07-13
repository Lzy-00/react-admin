import './index.less';
/*
外形像连接的button
*/
export default function linkButton(props) {
    return <button className="link-button" {...props}>{props.children}</button>
}
