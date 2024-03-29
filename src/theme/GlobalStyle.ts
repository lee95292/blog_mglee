import { createGlobalStyle } from 'styled-components';
import { media } from '../utils/media';
import { reset } from './Reset';

const GlobalStyle = createGlobalStyle`
 /* ${reset} */
 /* html { */
   /* font-size: 62.5%; 62.5% of 16px = 10px */
 /* } */
  ::selection {
    color: ${(props) => props.theme.colors.bg};
    background: ${(props) => props.theme.colors.primary};
  }
  body {
    background: ${(props) => props.theme.colors.bg};
    color: ${(props) => props.theme.colors.grey.det};
    word-break: keep-all;
    @media ${media.phone} {
      font-size: 0.8rem;
    }
  }
  a {
    color: ${(props) => props.theme.colors.grey.dark};
    text-decoration: none;
    transition: all ${(props) => props.theme.transitions.normal};
  }
  a:hover {
    color: ${(props) => props.theme.colors.primary};
  }
  h1, h2, h3, h4 {
    color: ${(props) => props.theme.colors.grey.dark};
    word-break: keep-all;
    font-weight:600;
  }
  h1{
    font-size:41px;
    margin-top:6rem;
  }
  h2{
    margin-top:4rem;
  }
  h3{
    margin-top:3rem;
  }
  blockquote {
    font-style: italic;
    position: relative;
  }

  blockquote:before {
    content: "";
    position: absolute;
    background: ${(props) => props.theme.colors.primary};
    height: 100%;
    width: 0.6rem;
    margin-left: -1.6rem;
  }
  label {
    margin-bottom: .5rem;
    color: ${(props) => props.theme.colors.grey.dark};
  }
  input, textarea {
    border-radius: .5rem;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    padding: .25rem 1rem;
    &:focus {
      outline: none;
    }
  }
  .textRight {
    text-align:right;
  }
`;

export { GlobalStyle };
