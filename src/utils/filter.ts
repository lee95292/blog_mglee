import _ from 'lodash'
import Frontmatter from '../models/Frontmatter'
interface Node {
  frontmatter: Frontmatter
}
interface Data{
  node:Node
}

const getPostsByType = (posts: any, classificationType: keyof Frontmatter):{ [key: string | number]: Node[] }  => {
  const postsByType: { [key: string | number]: Node[] } = {};
  posts.forEach((data: Data): void => {
    const {node} = data
    console.log(node)
    const nodeClassificationType = node.frontmatter[classificationType];
    if (nodeClassificationType) {
      if (_.isArray(nodeClassificationType)) {
        nodeClassificationType.forEach((name) => {
          if (!_.has(postsByType, name)) {
            postsByType[name] = [];
          }
          postsByType[name].push(node);
        });
      } else {
        const name = nodeClassificationType;
        if (!postsByType[name]) {
          postsByType[name] = [];
        }
        postsByType[name].push(node);
      }
    }
  });
  return postsByType;
};

export { getPostsByType };