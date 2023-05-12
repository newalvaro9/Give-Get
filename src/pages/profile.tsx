import Layout from '@/components/layout';
import styles from '@/styles/Posts.module.css'
import formatDate from '../../utils/formatDate';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import posts from '../../lib/database/models/posts';
import connect from '../../lib/database/database';
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
    answersLength: number;
  }>;
}

export default function Home({ arrayData }: Props) {
  const router = useRouter();

  const handleDelete = (post: number) => {
    router.push('/delete/' + post);
  }

  const handleSee = (post: number) => {
    router.push('/posts/' + post)
  }

  return (
    <Layout>
      <h1 style={{textAlign: 'center'}}>Les meves preguntes</h1>
      <div className={styles['cards']}>
        {arrayData.map(data => (
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
                <button onClick={() => handleSee(data.postid)}>Veure</button>
                <button onClick={() => handleDelete(data.postid)}>
                  <Image
                    src={"/trash.svg"}
                    width={20}
                    height={15}
                    alt={'Delete'}
                  />
                </button>
                <p>{data.answersLength} respostes</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context);
  await connect();
  const rawData = await posts.find({ "postedBy.userid": (session?.user as any).userid });
  const arrayData = rawData.map((item: any) => {
    return {
      postid: item.postid,
      postedBy: {
        userid: item.postedBy.userid,
        name: item.postedBy.name
      },
      postedAt: formatDate(item.postedAt),
      category: item.category,
      question: item.question,
      answersLength: item.answers.length
    };
  }).reverse();


  return {
    props: {
      arrayData: arrayData,
      sessionUserId: (session?.user as any).userid
    }
  };
}