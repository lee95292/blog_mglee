import Post from './Post';

interface PageContext {
  tags?: string[];
  categories?: string[];
  categoryName: string;
  tagName?: string;
  posts?: Post[];
  next: any;
  prev: any;
}

export default PageContext;
