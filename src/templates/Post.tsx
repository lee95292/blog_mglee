import React, {useEffect} from 'react';
import { Helmet } from 'react-helmet';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import { kebabCase } from 'lodash';
import {
  Layout,
  Wrapper,
  Header,
  Subline,
  SEO,
  PrevNext,
  SectionTitle,
  Content,
} from '../components';
import config from '../../config/SiteConfig';
import '../utils/prismjs-theme.css';
import PageContext from '../models/PageContext';
import Post from '../models/Post';

const PostContent = styled.div`
  margin-top: 4rem;
`;


interface Props {
  data: {
    markdownRemark: Post;
  };
  pageContext: PageContext;
}

export default (props: Props) => {
  const { prev, next } = props.pageContext;
  const post = props.data.markdownRemark;
  useEffect(() => {
      let script = document.createElement("script");
      let anchor = document.getElementById("uterances-comments");
      script.setAttribute("src", "https://utteranc.es/client.js");
      script.setAttribute("crossorigin","anonymous");
      script.setAttribute("async", "true");
      script.setAttribute("repo", "lee95292/lee95292.github.io");
      script.setAttribute("issue-term", "title");
      script.setAttribute( "theme", "github-light");
      anchor?.appendChild(script);
  })
  return (
    <Layout>
      {post ? (
        <>
          <SEO postPath={post.fields.slug} postNode={post} postSEO={true} />
          <Helmet title={`${post.frontmatter.title} | ${config.siteTitle}`} />
          <Header banner={post.frontmatter.banner}>
            <Link to="/"><b>{config.siteTitle}</b></Link>
            <SectionTitle>{post.frontmatter.title}</SectionTitle>
            <Subline>
              {post.frontmatter.date} &mdash; {post.timeToRead} Min Read &mdash; In{' '}
              <Link to={`/categories/${kebabCase(post.frontmatter.category)}`}>
                {post.frontmatter.category}
              </Link>
            </Subline>
          </Header>
          <Wrapper>
            <Content>
              <PostContent dangerouslySetInnerHTML={{ __html: post.html }} />
              {post.frontmatter.tags ? (
                <Subline>
                  Tags: &#160;
                  {post.frontmatter.tags.map((tag, i) => (
                    <Link key={i} to={`/tags/${kebabCase(tag)}`}>
                      <strong>{tag}</strong> {i < post.frontmatter.tags.length - 1 ? `, ` : ``}
                    </Link>
                  ))}
                </Subline>
              ) : null}
              <PrevNext prev={prev} next={next} />
              <div id="uterances-comments"></div>
            </Content>
          </Wrapper>
        </>
      ) : null}
    </Layout>
  );
};

export const postQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MM.DD.YYYY")
        category
        tags
        banner
      }
      timeToRead
    }
  }
`;
