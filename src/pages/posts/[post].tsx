import Layout from '@/components/layout';
import styles from '@/styles/Posts.module.css';
import { GetServerSideProps } from 'next';
import posts from '../../../lib/database/models/posts';
import connect from '../../../lib/database/database';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import formatDate from '../../../utils/formatDate';
import Image from 'next/image';
import { useState } from 'react';

export default function Delete({ session, data }: any) {
    const router = useRouter();
    const [writing, setWriting] = useState(false)

    return (
        <Layout title={"View Post - Give Your Time"}>
            <div className={styles['view']}>
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
                    <div className={styles['helper']}>
                        {writing || (
                            <button onClick={() => setWriting(true)}>Responder</button>
                        )}
                    </div>
                </div>
                <div className={styles['answer']}>
                    {writing && (
                        <>
                            <span contentEditable autoFocus ></span>
                            <button>&nbsp;{'>'}&nbsp;</button>
                        </>

                    )}
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    await connect();

    const post = await posts.findOne({ postid: context?.params?.post });
    if (!post) {
        return {
            redirect: {
                destination: "/404",
                permanent: false,
            },
        }
    }
    const session = await getSession(context);
    const data = {
        postid: post.postid,
        postedBy: {
            userid: post.postedBy.userid,
            name: post.postedBy.name
        },
        postedAt: formatDate(post.postedAt),
        category: post.category,
        question: post.question
    };

    return {
        props: {
            session: session,
            data: data
        }
    }
}