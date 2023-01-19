export default {
  pathPrefix: '/', // Prefix for all links. If you deploy your site to example.com/portfolio your pathPrefix should be "portfolio"

  siteTitle: 'Scatch note', // Navigation and Site Title
  siteTitleAlt: 'Myeonggyu Lee(lee95292) programming logs', // Alternative Site title for SEO
  siteUrl: 'https://blog.mglee.dev', // Domain of your site. No trailing slash!
  siteLanguage: 'en', // Language Tag on <html> element
  siteBanner: '/assets/banner.jpg', // Your image for og:image tag. You can find it in the /static folder
  defaultBg: '/assets/bg/1.jpg', // default post background header
  favicon: 'src/favicon.png', // Your image for favicons. You can find it in the /src folder
  siteDescription: 'Typescript Power Blog with big typography', // Your site description
  author: 'Myeonggyu Lee', // Author for schemaORGJSONLD

  // siteFBAppID: '123456789', // Facebook App ID - Optional
  // userTwitter: '', // Twitter Username - Optional
  ogSiteName: 'Myeonggyu Lee', // Facebook Site Name - Optional
  ogLanguage: 'en_US', // Facebook Language

  // Manifest and Progress color
  // See: https://developers.google.com/web/fundamentals/web-app-manifest/
  themeColor: '#3498DB',
  backgroundColor: '#2b2e3c',

  // Settings for typography.ts
  headerFontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont , Segoe UI, Helvetica , Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol',
  bodyFontFamily: 'sans-serif',
  baseFontSize: '18px',

  // Social media
  siteFBAppID: '',


  //
  Google_Tag_Manager_ID: 'GTM-XXXXXXX',
  POST_PER_PAGE: 4,
  categories: ['all','tech','howto','bugfix','etc'],
  categoryDescription : {
    'all': '글 전체',
    'tech': '개념과 기술의 원리에 대한 설명',
    'howto':'기술의 활용법이나 실험에 대한 정리',
    'bugfix':'문제와 문제의 해결과정 정리',
    'etc':'생각, 느낀점',
  },
  tagDescription:{
    'JPA study':'김영한 저, 자바 표준 ORM JPA책과 연관된 내용을 공부하면서 배운 내용이나 실험들을 정리합니다'
  }
};
