import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'gatsby';
import { Layout, Wrapper, Header, Button, Content, SectionTitle } from '../components';

import config from '../../config/SiteConfig';
export default () => {
  return (
    <Layout>
      <Helmet title={`Contact | ${config.siteTitle}`} />
      <Header>
        <Link to="/"><b>{config.siteTitle}</b></Link>
        <SectionTitle uppercase={true}>Contact</SectionTitle>
      </Header>
      <Wrapper>
        <Content>
        <h2>백엔드 개발자의 기본기 갖추기</h2>
        <h4>아래 주제에 대해 꾸준히 공부하고 글 쓰기</h4>
        {/* <br/><br/> */}
        <ul>
          <li>책 Java ORM 표준: JPA 프로그래밍스터디: <a style={{"color":"blue"}} target="_blank" href="https://www.notion.so/djunnni-resume/JPA-09bf2e8307504e959f208d6ebce8ecc2">(스터디 노션 링크)</a> </li>
          <li>Spring Document를 기반으로 한 깊이있는 학습</li>
          <li>TDD와 테스트코드 스터디</li>
          <li>Real MySQL, SQL 안티패턴 스터디</li>
        </ul>
          <a href="https://github.com/lee95292">
            <Button big={true}>
              <svg
                width="1792"
                height="1792"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z" />
              </svg>
              Github
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/myeunggyu-lee-b9560b185/">
            <Button big={true}>
              <svg
                width="1792"
                height="1792"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z" />
              </svg>
              Linkedin
            </Button>
          </a>
          <a href="https://lee95292.github.io">
            <Button big={true}>
              <svg
                width="1792"
                height="1792"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z" />
              </svg>
              Website
            </Button>
          </a>
        </Content>
      </Wrapper>
    </Layout>
  );
};
