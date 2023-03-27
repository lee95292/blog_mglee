import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'gatsby';
import styled from 'styled-components';

import { Layout, Wrapper, Header, Button, Content, SectionTitle } from '../components';
import config from '../../config/SiteConfig';

export default () => {
  return (
    <Layout>
      <Helmet title={`Resume | ${config.siteTitle}`} />
      <Header>
        <Link to="/">
          <b>{config.siteTitle}</b>
        </Link>
        <SectionTitle uppercase={true}>Resume, MyeongGyu Lee</SectionTitle>
      </Header>
      <Wrapper>
        <Content>
          <img src="/assets/resume/1.png" unselectable="on" draggable="false" style={{"margin-bottom":"-0.5rem"}}/>
          <img src="/assets/resume/2.png" style={{"margin-bottom":"-0.7rem"}} />
          <img src="/assets/resume/3.png" />
          <img src="/assets/resume/4.png" />
          <VervoseDiv>
            <br/><br/>Notion으로 만든 커스텀 링크가 로딩속도 이슈가 있어 잠시 블로그에 이미지 형태로 옮겼습니다. 
            <br/><br/>[링크 1 별첨] CLIK 소개 논문 <br/> <a href="https://onlinelibrary.wiley.com/doi/full/10.1002/cae.22289  ">🔗https://onlinelibrary.wiley.com/doi/full/10.1002/cae.22289  </a>
            <br/><br/>[링크 2 별첨] Jenkins 403 no valid crumb 에러리포트 <br/> <a href="https://blog.mglee.dev/blog/jenkins-403-no-valid-crumb-에러-리포트/">🔗https://blog.mglee.dev/blog/jenkins-403-no-valid-crumb-에러-리포트</a>
            <br/><br/>[링크 3 별첨] Planning Poker 소개<br/><a href="https://www.notion.so/mglees/Planning-Poker-dfab48ee82d74bf7ba5d6e49e920609c">🔗 https://www.notion.so/mglees/Planning-Poker-dfab48ee82d74bf7ba5d6e49e920609c</a>
          </VervoseDiv>
        </Content>
      </Wrapper>
    </Layout>
  );
};

const VervoseDiv = styled.div`
padding-left: 1rem;
`