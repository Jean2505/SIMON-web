import { doc } from "firebase/firestore";

export const DUMMY_FORUM_POSTS = [
    {
        title: 'Dummy Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel malesuada risus. Aliquam malesuada nisi.',
        userId: 'u01',
        userName: 'Jean Victor',
        createdAt: new Date(),
        courseId: 'd01',
        likes: 26,
        comments: ['a', 'aa', 'aaa']
    },

    {
        title: 'Dummy Title 2',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel malesuada risus. Aliquam malesuada nisi.',
        userId: 'u02',
        userName: 'Luan Magri',
        createdAt: new Date(),
        courseId: 'd02',
        likes: 21,
        comments: ['a', 'aa', 'aaa', 'aaaa']
    }
]