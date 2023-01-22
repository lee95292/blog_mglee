import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { kebabCase } from 'lodash';
import { Subline } from './Subline';

const Post = styled.article`
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Title = styled.h3`
  font-size: 27px;
  position: relative;
  text-shadow: 0 1.2rem 3rem rgba(0, 0, 0, 0.15);
  margin-bottom: 0.75rem;
`;

const Excerpt = styled.p`
  grid-column: -1 / 1;
  margin-top: 1rem;
  margin-bottom: 1rem;
  
`;

interface Props {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  timeToRead: number;
  category: string;
}

const Article = ({ title, date, excerpt, slug, timeToRead, category }: Props) => {
  return (
    <Post>
      <Title>
        <Link to={`/blog/${decodeURI(slug)}`}>{title}</Link>
      </Title>
      <Subline>
        {date} &mdash; {timeToRead} Min Read &mdash; In
        <Link to={`/categories/${kebabCase(category)}`}> {category}</Link>
      </Subline>
      <Excerpt>{excerpt}</Excerpt>
    </Post>
  );
};

export { Article };
