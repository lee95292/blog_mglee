import React from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import { rgba, darken, lighten } from 'polished';
import { Layout, Wrapper, Button, Article } from '../components';
import PageProps from '../models/PageProps';
import { Helmet } from 'react-helmet';
import config from '../../config/SiteConfig';
import { media } from '../utils/media';

const Homepage = styled.main`
  display: flex;
  height: 100vh;
  flex-direction: row;
  animation: 0.3s ease-in-out 0.1s both slide;
  @media ${media.tablet} {
    height: 100%;
    flex-direction: column;
  }
  @media ${media.phone} {
    height: 100%;
    flex-direction: column;
  }
`;

const GridRow: any = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props: any) =>
    props.background
      ? `linear-gradient(
      -185deg,
      ${rgba(darken(0.1, props.theme.colors.primary), 0.7)}, 
      ${rgba(lighten(0.1, props.theme.colors.black), 0.9)}), url(${config.defaultBg}) no-repeat`
      : null};
  background-size: cover;
  padding: 2rem 4rem;
  color: ${(props: any) => (props.background ? props.theme.colors.white : null)};
  h1 {
    color: ${(props: any) => (props.background ? props.theme.colors.white : null)};
  }
  @media ${media.tablet} {
    padding: 3rem 3rem;
  }
  @media ${media.phone} {
    padding: 2rem 1.5rem;
  }
`;

const HomepageContent = styled.div<{ center?: boolean }>`
  max-width: 30rem;
  text-align: ${(props) => (props.center ? 'center' : 'left')};
  animation: 0.5s ease-in-out 0.6s both fadeIn;
`;

const LatestArea = styled.div<{}>`
  display: flex;
  justify-content: space-between;
  .allArticles{
    margin-top: 2%;
  }
`

export default ({ data }: PageProps) => {
  const { edges, totalCount } = data.allMarkdownRemark;
  return (
    <Layout>
      <Wrapper fullWidth={true}>
        <Helmet title={`${config.siteTitle}`} />
        <Homepage>
          <GridRow background={true}>
            <HomepageContent center={true}>
              <img src={config.siteLogo} alt={config.siteTitle} />
              <h1>
                MyeongGyu Lee <br />
                
              </h1>
              <p>웹 프로그래밍(Java/Kotlin,JS), 머신러닝/딥러닝(Vision), 컴퓨터공학 지식과 개인적인 일상에 대한 글을 씁니다. </p>
              <Link to="/contact">
                <Button big={true}>
                  <svg
                    width="1792"
                    height="1792"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z" />
                  </svg>
                  Contact
                </Button>
              </Link>
              <Link to="/blog">
                <Button big={true}>
                  <svg
                    width="1792"
                    height="1792"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z" />
                  </svg>
                  Articles
                </Button>
              </Link>
            </HomepageContent>
          </GridRow>
          <GridRow>
            <HomepageContent>
              <h2>About My Posts</h2>
              <p>
                간결하고 흐름이 잡혀있는, 필자의 생각과 경험/지식이 녹아들어있는 글을 쓰기 위해 노력하고 있습니다.
              </p>
              <hr />
              <LatestArea>
                <h2>Latest Articles</h2>
                <p className={'allArticles'}>
                  <Link to={'/blog'}>All articles ({totalCount})</Link>
                </p>
              </LatestArea>
              {edges.map((post) => (
                <Article
                  title={post.node.frontmatter.title}
                  date={post.node.frontmatter.date}
                  excerpt={post.node.excerpt}
                  timeToRead={post.node.timeToRead}
                  slug={post.node.fields.slug}
                  category={post.node.frontmatter.category}
                  key={post.node.fields.slug}
                />
              ))}
            </HomepageContent>
          </GridRow>
        </Homepage>
      </Wrapper>
    </Layout>
  );
};
export const IndexQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 3) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "DD.MM.YYYY")
            category
          }
          timeToRead
        }
      }
    }
  }
`;
