import Layout from '@/components/layout';
import styles from '@/styles/Posts.module.css'
import formatDate from '../../../utils/formatDate';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import posts from '../../../lib/database/models/posts';
import connect from '../../../lib/database/database';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type Props = {
  arrayData: Array<{
    postid: number;
    postedBy: {
      userid: number;
      name: string;
    };
    postedAt: string;
    category: string;
    question: string;
  }>;
  sessionUserId: number;
}

export default function Home({ arrayData, sessionUserId }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleDelete = (post: number) => {
    router.push('/delete/' + post);
  }
  
  const handleHelp = (post: number) => {
    router.push('/posts/' + post)
  }

  return (
    <Layout setSearchQuery={setSearchQuery}>
      <h1>Gente que necesita ayuda</h1>
      <div className={styles['cards']}>
        {arrayData.filter((item) => item.question.toLowerCase().includes(searchQuery.toLowerCase())).map(data => (
          <div className={styles['card']}>
            <div className={styles['card-header']}>
              <Image
                src={'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'}
                alt='avatar'
                width={40}
                height={40}
              ></Image>
              <div className={styles['header-info']}>
                <h4>{data.postedBy.name}</h4>
                <p>{data.postedAt} · {data.category}</p>
              </div>
            </div>
            <div className={styles['card-body']}>
              <pre>{data.question}</pre>
            </div>
            <div className={styles['card-helpers']}>
              <div className={styles['helper']}>
                <button onClick={() => handleHelp(data.postid)}>AJUDA'M</button>
                {data.postedBy.userid === sessionUserId && (
                  <button onClick={() => handleDelete(data.postid)}>
                    <Image
                      src={"/trash.svg"}
                      width={20}
                      height={15}
                      alt={'Delete'}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  await connect();
  const rawData = await posts.find();
  const arrayData = rawData.map(item => {
    return {
      postid: item.postid,
      postedBy: {
        userid: item.postedBy.userid,
        name: item.postedBy.name
      },
      postedAt: formatDate(item.postedAt),
      category: item.category,
      question: item.question
    };
  }).reverse();

  const session = await getSession(context);

  return {
    props: {
      arrayData: arrayData,
      sessionUserId: (session?.user as any).userid
    }
  };
}