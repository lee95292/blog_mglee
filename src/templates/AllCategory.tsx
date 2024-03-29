import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'gatsby';
import { kebabCase } from 'lodash';
import { Layout, Wrapper, Header, SectionTitle, Content, Title } from '../components';

import config from '../../config/SiteConfig';
import PageProps from '../models/PageProps';

export default (props: PageProps) => {
  const { categories } = props.pageContext;
  if (categories) {
    return (
      <Layout>
        <Helmet title={`Categories | ${config.siteTitle}`} />
        <Header>
          <Link to="/"><b>{config.siteTitle}</b></Link>
          <SectionTitle>Categories</SectionTitle>
        </Header>
        <Wrapper>
          <Content>
            {categories.map((category, index: number) => (
              <Title key={index}>
                <Link to={`/categories/${kebabCase(category)}`}>{category}</Link>
              </Title>
            ))}
          </Content>
        </Wrapper>
      </Layout>
    );
  }
};
