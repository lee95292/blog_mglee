import styled from 'styled-components';
import { media } from '../utils/media';

export const Content = styled.div`
  box-shadow: 0 0.4rem 12rem ${(props) => props.theme.colors.grey.ultraLight};
  border-radius: 1rem;
  padding: 2rem 4rem;
  background-color: ${(props) => props.theme.colors.bg};
  z-index: 9000;
  margin-top: -4rem;
  margin-left:13%;
  margin-right:9%;
  width:950px;
  min-width:0px;
  max-witdh:100%;
  form {
    p {
      label,
      input {
        display: block;
      }
      input {
        min-width: 275px;
      }
      textarea {
        resize: vertical;
        min-height: 150px;
        width: 100%;
      }
    }
  }
  @media ${media.tablet} {
    padding: 3rem 3rem;
    margin: 0;
  }
  @media ${media.phone} {
    padding: 2rem 1.5rem;
    margin: 0;
  }
`;
