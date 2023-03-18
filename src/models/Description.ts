interface DescriptionType {
    [key: string]: string;
}
const TagDescription: DescriptionType = {
    'JPA 스터디': '김영한 저, 자바 표준 ORM JPA책과 연관된 내용을 공부하면서 배운 내용이나 실험들을 정리합니다'
}

const CategoryDescription: DescriptionType = {
    'all': '글 전체',
    'tech': '개념과 기술의 원리에 대한 설명',
    'howto': '기술의 활용법이나 실험에 대한 정리',
    'bugfix': '문제와 문제의 해결과정 정리',
    'etc': '생각, 느낀점',
}
export {TagDescription, CategoryDescription}