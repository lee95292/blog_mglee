import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'gatsby';
import { Layout, Wrapper, Header, Button, Content, SectionTitle } from '../components';

import styled from 'styled-components';
import config from '../../config/SiteConfig';
const techStackBadges = {
  'spring boot': (
    <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  ),
  mongodb: (
    <img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white" />
  ),
  reactjs: (
    <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  ),
  nodejs: (
    <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" />
  ),
};

const ToggleContents = ({ children, title }) => {
  return (
    <>
      <details open>
        <ToggleSummary>
          <h3>&#x276F; {title}</h3>
        </ToggleSummary>
        {children}
      </details>
    </>
  );
};
export default () => {
  return (
    <Layout>
      <Helmet title={`Resume | ${config.siteTitle}`} />
      <Header>
        <Link to="/">
          <b>{config.siteTitle}</b>
        </Link>
        <SectionTitle uppercase={true}>MyeongGyu Lee, Resume</SectionTitle>
      </Header>
      <Wrapper>
        <Content>
          {/* 기본정보 */}
          <h3> Software Developer, 이명규 (Myeonggyu Lee)의 이력서입니다.</h3>
          <strong>
            Java, Javascript로 프로그래밍을 해왔습니다. 클린코드, TDD, 아키텍처, 인공지능,
            클라우드같은 주제에 관심이 많습니다.🔥
          </strong>
          <br />
          <ProfileBase>
            <ProfileImg src="/assets/resume_profile.jpeg" />
            <ProfileDetails>
              <ProfileLine>✉️ lee95292@naver.com</ProfileLine>
              <ProfileLine>
                블로그: <a href="https://blog.mglee.dev">https://blog.mglee.dev</a>{' '}
              </ProfileLine>
              <ProfileLine>
                깃허브: <a href="https://github.com/lee95292">https://github.com/lee95292</a>
              </ProfileLine>
              최종학력
              <hr />
              <ProfileLine>전북대학교 4학년 2학기 재학</ProfileLine>
              <ProfileLine> 2023.08 졸업예정 GPA 3.62/4.5</ProfileLine>
            </ProfileDetails>
          </ProfileBase>

          {/* 기본정보 */}
          {/* 활동 및 경력 */}
          <ToggleContents title="활동 및 경력">
            <ActivityContainerDiv>
              {/* 카카오 인턴십, 서버개발 부문 */}
              <ResumeHeaderDiv>
                <h3>카카오 인턴십, 서버개발 부문</h3>
                <sub> 2022.06.27 ~ 2022.08.31</sub>
                <hr />
              </ResumeHeaderDiv>
              {techStackBadges['spring boot']}
              <hr />
              <VervoseUl>[설명부분은 리스트형식에서 줄글로 추후보강]</VervoseUl>
              {/* 육군본부 정보체계관리단 SW개발병 */}
              <ResumeHeaderDiv>
                <h3>육군본부 정보체계관리단 SW개발병</h3>
                <sub> 2020.12.21 ~ 2022.05.25</sub>
                <hr />
              </ResumeHeaderDiv>
              <hr />
              <strong>기술스택:</strong> {techStackBadges['spring boot']}
              <VervoseUl>[설명부분은 리스트형식에서 줄글로 추후보강]</VervoseUl>
              {/* 구름, Fullstack Software Engineer */}
              <ResumeHeaderDiv>
                <h3>구름, Fullstack Software Engineer</h3>
                <sub> 2020.03.16 ~ 2020.12.14</sub>
                <hr />
              </ResumeHeaderDiv>
              {techStackBadges['nodejs']} {techStackBadges['mongodb']}
              <hr />
              <VervoseUl>[설명부분은 리스트형식에서 줄글로 추후보강]</VervoseUl>
              {/* KOICA 월드프렌즈 ICT 봉사활동 */}
              <ResumeHeaderDiv>
                <h3>KOICA 월드프렌즈 ICT 봉사활동</h3>
                <sub> 2019.07</sub>
                <hr />
              </ResumeHeaderDiv>
              <hr />
              <strong>기술스택:</strong> {techStackBadges['spring boot']}
              <VervoseUl>[설명부분은 리스트형식에서 줄글로 추후보강]</VervoseUl>
            </ActivityContainerDiv>
          </ToggleContents>
          {/* 활동 및 경력 */}
          {/*  */}
        </Content>
      </Wrapper>
    </Layout>
  );
};

const ActivityContainerDiv = styled.div`
  h3 {
    margin-top: 1rem;
  }
  img {
    margin-bottom: 0;
  }
`;

const ResumeHeaderDiv = styled.div`
  display: flex;
  margin-top: 3rem;
  sub {
    bottom: -2.25rem;
    margin-left: 1rem;
  }
`;

const VervoseUl = styled.div`
  margin-top: 1rem;
  li {
    margin-top: 0.3rem;
  }
`;

const ToggleSummary = styled.summary`
  cursor: pointer;
`;

const ProfileBase = styled.div`
  display: flex;
`;
const ProfileDetails = styled.div`
  padding-top: 5rem;
  padding-left: 3rem;
`;

const ProfileLine = styled.p`
  font-weigt = 600;
`;
const ProfileImg = styled.img`
  width: 40%;
`;
